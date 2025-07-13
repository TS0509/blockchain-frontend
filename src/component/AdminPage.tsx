"use client";

import { useState } from "react";
import { authFetch } from "@/utils/authFetch";
import { storage } from "@/utils/firebaseConfig";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import useAdminGuard from "@/utils/useAdminGuard";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function AdminPage() {
  useAdminGuard();
  const [candidateName, setCandidateName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();
  
  
  
const handleAddCandidate = async () => {
  setMessage(""); // 清空消息
  if (!candidateName.trim() || !avatarFile) {
    setMessage("❌ 必须填写候选人名称并上传头像");
    return;
  }

  try {
    const path = `candidates/${candidateName}_${Date.now()}.jpg`;
    const imageRef = storageRef(storage, path);
    const snapshot = await uploadBytes(imageRef, avatarFile);
    const avatarUrl = await getDownloadURL(snapshot.ref);

    const res = await authFetch(`${API_URL}/admin/add-candidate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: candidateName,
        avatar: avatarUrl,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "添加失败");
    setMessage("✅ 添加成功！");
    setCandidateName("");
    setAvatarFile(null);
  } catch (err: unknown) {
  if (err instanceof Error) {
    setMessage("❌ " + err.message);
  } else {
    setMessage("❌ 发生未知错误");
  }
}
};

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("icNumber");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("token");
    // Redirect to home
    router.push('/');
  };

  const handleStartVoting = async () => {
    try {
      const res = await authFetch(`${API_URL}/admin/start-voting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "启动失败");
      setMessage("✅ 投票已开始");
    } catch (err: unknown) {
  if (err instanceof Error) {
    setMessage("❌ " + err.message);
  } else {
    setMessage("❌ 发生未知错误");
  }
}
  };

  const handleStopVoting = async () => {
    try {
      const res = await authFetch(`${API_URL}/admin/stop-voting`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "停止失败");
      setMessage("✅ 投票已停止");
    } catch (err: unknown) {
  if (err instanceof Error) {
    setMessage("❌ " + err.message);
  } else {
    setMessage("❌ 发生未知错误");
  }
}
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 relative">
      {/* Malaysian flag pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-[#CC0000]"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-[#010066]"></div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-[#FFCC00]"></div>
      </div>

      {/* Logout button in top-left corner */}
      <button
        onClick={handleLogout}
        className="absolute top-4 sm:top-6 left-4 sm:left-6 cursor-pointer px-3 py-1 sm:px-4 sm:py-2 bg-gradient-to-r from-[#CC0000] to-[#FF6600] hover:from-[#AA0000] hover:to-[#DD5500] text-white text-xs sm:text-sm font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:ring-opacity-50 z-20"
      >
        Logout / Keluar
      </button>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-[#D4AF37]/30">
        {/* Malaysian emblem-inspired logo */}
        <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-[#010066] flex items-center justify-center relative">
          <div className="w-12 h-12 rounded-full bg-[#FFCC00] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#CC0000]"></div>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-[#010066] mb-2 text-center">
          <span className="text-[#CC0000]">🔐 管理员控制台</span>
        </h1>

        {/* Avatar upload */}
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setAvatarFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-[#010066] file:text-white
                       hover:file:bg-[#004499]"
          />
        </div>

        {/* Candidate input */}
        <div className="flex gap-2 mb-6">
          <input
            value={candidateName}
            onChange={(e) => setCandidateName(e.target.value)}
            placeholder="候选人名称"
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#010066] focus:border-transparent"
          />
          <button 
            onClick={handleAddCandidate} 
            className="px-4 py-2 bg-gradient-to-r from-[#010066] to-[#0066CC] hover:from-[#010066] hover:to-[#004499] text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5"
          >
            添加候选人
          </button>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 gap-3">
          <button 
            onClick={handleStartVoting}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#00AA00] to-[#00CC66] hover:from-[#008800] hover:to-[#00AA55] text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#00AA00] focus:ring-opacity-50"
          >
            开始投票
          </button>
          <button 
            onClick={handleStopVoting}
            className="w-full px-4 py-3 bg-gradient-to-r from-[#CC0000] to-[#FF6600] hover:from-[#AA0000] hover:to-[#DD5500] text-white font-medium rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:ring-opacity-50"
          >
            停止投票
          </button>
        </div>

        {/* Message display */}
        {message && (
          <p className={`mt-4 text-center text-lg ${message.includes("✅") ? "text-green-600" : "text-red-600"}`}>
            {message}
          </p>
        )}

        {/* Footer note */}
        <p className="mt-6 text-xs text-gray-500 text-center">
          Dibawah Kelolaan <span className="text-[#010066] font-medium">SPR Malaysia</span>
        </p>
      </div>
    </div>
  );
}
