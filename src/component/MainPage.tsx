"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function MalaysiaVotingPortal() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      {/* Malaysian flag pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-[#CC0000]"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-[#010066]"></div>
        <div className="absolute top-0 left-0 w-1/3 h-full bg-[#FFCC00]"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 w-full max-w-md sm:max-w-2xl bg-white/90 backdrop-blur-sm p-6 sm:p-12 rounded-2xl shadow-xl border border-[#D4AF37]/30 text-center mx-4">
        {/* Malaysian emblem-inspired logo */}
        <div className="mx-auto mb-6 w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-[#010066] flex items-center justify-center relative">
          <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-[#FFCC00] flex items-center justify-center">
            <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-[#CC0000]"></div>
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-[#010066] mb-2">
          <span className="text-[#CC0000]">Malaysia</span> Blockchain Voting
        </h1>
        <p className="text-sm sm:text-lg text-gray-600 mb-6 sm:mb-10">
          Sistem Pengundian Berasaskan Blockchain
        </p>

        {/* Buttons with Malaysian color scheme */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
          <button
            onClick={() => router.push("/login")}
            className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#010066] to-[#0066CC] hover:from-[#010066] hover:to-[#004499] text-white font-medium rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#010066] focus:ring-opacity-50 flex items-center justify-center text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
              />
            </svg>
            Login / Log Masuk
          </button>
          <button
            onClick={() => router.push("/register")}
            className="cursor-pointer px-6 py-3 bg-gradient-to-r from-[#CC0000] to-[#FF6600] hover:from-[#AA0000] hover:to-[#DD5500] text-white font-medium rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#CC0000] focus:ring-opacity-50 flex items-center justify-center text-sm sm:text-base"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            Register / Daftar
          </button>
        </div>

        {/* Malaysian government footer note */}
        <p className="mt-6 sm:mt-10 text-xs sm:text-sm text-gray-500">
          Dibawah Kelolaan <span className="text-[#010066] font-medium">SPR Malaysia</span>
        </p>
      </div>
    </main>
  );
}