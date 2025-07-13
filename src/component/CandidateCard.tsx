"use client";

import Image from "next/image";

type Props = {
  name: string;
  description?: string;
  avatar?: string; // ✅ 原本是 imgUrl，改成 avatar
  index: number;
  onVote: () => void;
  isLoading?: boolean;
};

export default function CandidateCard({
  name,
  description,
  avatar,
  index,
  onVote,
  isLoading = false,
}: Props) {
  return (
    <div className="p-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4AF37]/30 hover:shadow-xl transition-all duration-300 space-y-3">
      {/* 头像 - Candidate Image */}
      <div className="w-full h-40 sm:h-48 relative rounded-lg overflow-hidden border border-[#010066]/20">
        <Image
          src={avatar || "/default-avatar.png"} // ✅ 用 avatar 代替
          alt={`${name} 头像`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* 姓名 - Name */}
      <h3 className="text-lg sm:text-xl font-semibold text-[#010066]">
        {name}
      </h3>

      {/* 编号 - Index */}
      <p className="text-sm text-[#CC0000] font-medium">
        {/* 可加 index 展示编号：候选人 #{index + 1} */}
      </p>

      {/* 简介 - Description */}
      {description && (
        <p className="text-sm text-gray-700">{description}</p>
      )}

      {/* 投票按钮 - Vote Button */}
      <button
        onClick={onVote}
        disabled={isLoading}
        className={`w-full py-2 sm:py-3 rounded-xl shadow-md transition-all duration-300 cursor-pointer ${
          isLoading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gradient-to-r from-[#010066] to-[#0066CC] hover:from-[#010066] hover:to-[#004499] hover:-translate-y-0.5"
        } text-white font-medium`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
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
            处理中 / Memproses...
          </span>
        ) : (
          `投票给 ${name} / Undi ${name}`
        )}
      </button>
    </div>
  );
}
