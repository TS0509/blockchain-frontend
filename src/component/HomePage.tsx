"use client";

import { useRouter } from "next/navigation";
import useAuthGuard from "@/hook/useAuthGuard";

export default function HomePage() {
  const router = useRouter();
  useAuthGuard();

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("icNumber");
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("token");
    // Redirect to home
    router.push("/");
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
      <div className="relative z-10 w-full max-w-md sm:max-w-2xl bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-[#D4AF37]/30 text-center">
        {/* Malaysian emblem-inspired logo */}
        <div className="mx-auto mb-6 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#010066] flex items-center justify-center relative">
          <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-[#FFCC00] flex items-center justify-center">
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#CC0000]"></div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#010066] mb-2">
          <span className="text-[#CC0000]">欢迎回来！</span>
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-10">
          Anda telah berjaya log masuk ke sistem.
        </p>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <button
            onClick={() => router.push("/blocklist")}
            className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#010066] to-[#0066CC] hover:from-[#010066] hover:to-[#004499] text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#010066] focus:ring-opacity-50"
          >
            区块链结构 / Struktur Blockchain
          </button>
          <button
            onClick={() => router.push("/vote")}
            className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#00AA00] to-[#00CC66] hover:from-[#008800] hover:to-[#00AA55] text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#00AA00] focus:ring-opacity-50"
          >
            去投票 / Undi Sekarang
          </button>
          <button
            onClick={() => router.push("/result")}
            className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#6600CC] to-[#AA00FF] hover:from-[#5500AA] hover:to-[#8800DD] text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#6600CC] focus:ring-opacity-50"
          >
            投票结果 / Keputusan Undian
          </button>
          <button
            onClick={() => router.push("/votelog")}
            className="cursor-pointer px-4 py-2 sm:px-6 sm:py-3 bg-gradient-to-r from-[#010066] to-[#FFCC00] hover:from-[#00004d] hover:to-[#e6b800] text-white text-xs sm:text-sm font-medium rounded-lg sm:rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#010066] focus:ring-opacity-50"
          >
            投票记录 / Rekod Undian
          </button>
        </div>

        {/* Malaysian government footer note */}
        <p className="mt-6 sm:mt-10 text-xs text-gray-500">
          Dibawah Kelolaan{" "}
          <span className="text-[#010066] font-medium">SPR Malaysia</span>
        </p>
      </div>
    </div>
  );
}
