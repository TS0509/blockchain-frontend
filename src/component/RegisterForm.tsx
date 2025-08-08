"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "@/utils/firebaseConfig";
import { detectFace } from "@/utils/faceAPI";
import { compareFaces } from "@/utils/faceAPI";
import { collection, getDocs } from "firebase/firestore";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

const RegisterForm = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ic, setIC] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "default" | "success" | "error" | "warn"
  >("default");

  const getMessageColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-500";
      case "warn":
        return "text-yellow-600";
      default:
        return "text-gray-700";
    }
  };

  const isDuplicateFace = async (base64Image: string): Promise<boolean> => {
    const snapshot = await getDocs(collection(db, "users"));

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      if (!data.faceImageUrl) continue;

      try {
        const similarity = await compareFaces(base64Image, data.faceImageUrl);
        console.log(`Compared with ${docSnap.id}, confidence: ${similarity}`);
        if (similarity > 80) {
          return true;
        }
      } catch (e) {
        console.warn("Face comparison error:", e);
      }
    }

    return false;
  };

  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  const captureAndRegister = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = videoRef.current!;
    video.srcObject = stream;

    for (let i = 3; i > 0; i--) {
      setCountdown(i);
      await new Promise((r) => setTimeout(r, 1000));
    }
    setCountdown(null);

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    stream.getTracks().forEach((t) => t.stop());
    video.srcObject = null;

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b!), "image/jpeg")
    );
    const base64 = await blobToBase64(blob);

    const isFace = await detectFace(base64);
    if (!isFace) {
      throw new Error(
        "⚠️ No valid face was detected. Please try again facing the camera."
      );
    }

    const isDuplicate = await isDuplicateFace(base64);
    if (isDuplicate) {
      throw new Error("⚠️ This face has already been registered.");
    }

    // 先注册后端
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ic: ic.trim() }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error("❌ Failed to register backend：" + text);
    }
    const result = await response.json();
    console.log(
      "Backend registration is successful, wallet address:",
      result.address
    );

    // 上传人脸图像
    const imageRef = storageRef(storage, `faces/${ic.trim()}.jpg`);
    await uploadBytes(imageRef, blob);
    const imageUrl = await getDownloadURL(imageRef);

    // 合并写入 firestore
    await setDoc(
      doc(db, "users", ic.trim()),
      {
        faceImageUrl: imageUrl,
      },
      { merge: true }
    );

    console.log("✅ Firestore Merge update successful");
  };

  const handleRegister = async () => {
    if (!ic.trim()) {
      setMessage("⚠️ Please enter your ID number");
      setStatus("warn");
      return;
    }

    setLoading(true);
    setMessage("📷 Collecting faces...");
    setStatus("default");

    try {
      await captureAndRegister();
      setStatus("success");
      setMessage("✅ Registration successful, redirecting...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setStatus("error");
      setMessage(error.message || "❌ Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="relative z-10 max-w-md w-full bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-[#D4AF37]/30">
        {/* Malaysian emblem-inspired logo */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#010066] flex items-center justify-center relative">
          <div className="w-12 h-12 rounded-full bg-[#FFCC00] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#CC0000]"></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#010066] mb-2 text-center">
          <span className="text-[#CC0000]">Face registration</span>
        </h1>
        <p className="text-gray-600 mb-6 text-center">
          Sistem Pendaftaran Berasaskan Wajah
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#010066] mb-1">
              ID number (IC Number)
            </label>
            <input
              type="text"
              placeholder="Contoh: 901025-14-5555"
              value={ic}
              onChange={(e) => {
                const value = e.target.value;
                const cleaned = value.replace(/[^0-9-]/g, "");
                setIC(cleaned);
              }}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#010066] focus:border-transparent"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full cursor-pointer px-6 py-3 rounded-xl shadow-lg transition-all duration-300 ${
              loading
                ? "bg-gray-400"
                : "bg-gradient-to-r from-[#010066] to-[#0066CC] hover:from-[#010066] hover:to-[#004499] hover:-translate-y-0.5"
            } text-white font-medium flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registering...
              </>
            ) : (
              "Register / Daftar"
            )}
          </button>

          {message && (
            <p
              className={`text-sm font-medium text-center mt-2 ${getMessageColor()}`}
            >
              {message}
            </p>
          )}

          <div className="mt-4 relative border border-gray-200 rounded-xl overflow-hidden shadow-md">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover bg-black"
            />
            {countdown !== null && (
              <div
                className="absolute top-4 right-4 text-[80px] font-extrabold pointer-events-none select-none"
                style={{
                  color: "transparent",
                  WebkitTextStroke: "3px white",
                  opacity: 1,
                }}
              >
                {countdown}
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-xs text-gray-500 text-center">
          Dibawah Kelolaan{" "}
          <span className="text-[#010066] font-medium">SPR Malaysia</span>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
