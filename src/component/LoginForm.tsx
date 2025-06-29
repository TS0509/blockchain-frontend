"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { storage, db } from "@/utils/firebaseConfig";
import { detectFace, compareFaces } from "@/utils/faceAPI";

const LoginForm = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [ic, setIC] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"default" | "success" | "error" | "warn">("default");

  // 将 Blob 转为 base64
  const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

  // 倒计时 + 拍照
  const startCountdownAndCapture = async (): Promise<string> => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const video = videoRef.current!;
    video.srcObject = stream;

    await new Promise<void>((resolve) => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });

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

    const blob = await new Promise<Blob>((resolve) => canvas.toBlob((b) => resolve(b!), "image/jpeg"));
    return await blobToBase64(blob);
  };

  const handleLogin = async () => {
    if (!ic.trim()) {
      setStatus("warn");
      setMessage("⚠️ 请输入身份证号码");
      return;
    }

    setLoading(true);
    setMessage("📷 打开摄像头准备中...");
    setStatus("default");

    try {
      const base64 = await startCountdownAndCapture();

      setMessage("🔍 正在检测人脸...");
      const hasFace = await detectFace(base64);
      if (!hasFace) {
        setStatus("error");
        setMessage("❌ 没有检测到人脸或人脸数量不正确");
        setLoading(false);
        return;
      }

      const imageRef = storageRef(storage, `faces/${ic.trim()}.jpg`);
      const registeredURL = await getDownloadURL(imageRef);

      setMessage("🤝 正在比对...");
      const confidence = await compareFaces(base64, registeredURL);

      if (confidence >= 80) {
        const docRef = doc(db, "users", ic.trim());
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const walletAddress = userData.address || "";


          localStorage.setItem("icNumber", ic.trim());
          localStorage.setItem("walletAddress", walletAddress);

          setStatus("success");
          setMessage(`✅ 登录成功，相似度 ${confidence.toFixed(1)}%，跳转中...`);
          setTimeout(() => router.push("/home"), 1500);
        } else {
          setStatus("error");
          setMessage("❌ Firestore 中找不到此用户，请先注册");
        }
      } else {
        setStatus("error");
        setMessage(`❌ 人脸不匹配，相似度仅 ${confidence.toFixed(1)}%`);
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("❌ 登录失败，请检查摄像头权限或是否已注册");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6 space-y-4 relative">
        <h1 className="text-2xl font-bold text-center text-gray-800">🔐 人脸识别登录</h1>

        <input
          type="text"
          placeholder="请输入身份证号（IC）"
          value={ic}
          onChange={(e) => setIC(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-2 rounded text-white font-semibold ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "处理中..." : "开始登录"}
        </button>

        {message && <p className={`text-center text-sm font-medium ${getMessageColor()}`}>{message}</p>}

        <div className="mt-4 relative border rounded overflow-hidden shadow-md">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-64 object-cover bg-gray-200"
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
    </div>
  );
};

export default LoginForm;
