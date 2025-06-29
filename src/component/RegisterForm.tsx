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
      throw new Error("⚠️ 未检测到有效人脸，请正对摄像头重试");
    }

    // 先注册后端
    const response = await fetch("http://localhost:8080/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ic: ic.trim() }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error("❌ 注册后端失败：" + text);
    }
    const result = await response.json();
    console.log("后端注册成功，钱包地址:", result.address);

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

    console.log("✅ Firestore 合并更新成功");
  };

  const handleRegister = async () => {
    if (!ic.trim()) {
      setMessage("⚠️ 请输入身份证号码");
      setStatus("warn");
      return;
    }

    setLoading(true);
    setMessage("📷 正在采集人脸...");
    setStatus("default");

    try {
      await captureAndRegister();
      setStatus("success");
      setMessage("✅ 注册成功，正在跳转...");
      setTimeout(() => router.push("/"), 1500);
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      setStatus("error");
      setMessage(error.message || "❌ 注册失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-sm mx-auto space-y-4 bg-white rounded-xl shadow text-center">
      <h1 className="text-2xl font-bold text-gray-800">📝 人脸注册</h1>

      <input
        type="text"
        placeholder="请输入身份证号（IC）"
        value={ic}
        onChange={(e) => setIC(e.target.value)}
        className="w-full border p-2 rounded"
      />

      <button
        onClick={handleRegister}
        disabled={loading}
        className={`w-full py-2 rounded text-white font-semibold ${
          loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "注册中..." : "注册"}
      </button>

      {message && (
        <p className={`text-sm font-medium ${getMessageColor()}`}>{message}</p>
      )}

      <div className="mt-4 relative border rounded overflow-hidden shadow-md">
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
              WebkitTextStroke: "3px black",
              opacity: 1,
            }}
          >
            {countdown}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
