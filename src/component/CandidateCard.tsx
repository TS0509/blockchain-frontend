// src/components/CandidateCard.tsx
"use client";

import Image from "next/image";

type Props = {
  name: string;
  description?: string;
  imgUrl?: string;
  index: number;
  onVote: () => void;
  isLoading?: boolean;
};

export default function CandidateCard({
  name,
  description,
  imgUrl,
  index,
  onVote,
  isLoading = false,
}: Props) {
  return (
    <div className="p-4 bg-white rounded-xl shadow space-y-2">
      {/* 头像 */}
      <div className="w-full h-40 relative">
        <Image
          src={imgUrl || "/default-avatar.png"}
          alt={`${name} 头像`}
          fill
          className="rounded-xl object-cover"
        />
      </div>

      {/* 姓名 */}
      <h3 className="text-lg font-semibold text-gray-800">{name}</h3>

      {/* 简介 */}
      {description && (
        <p className="text-sm text-gray-600">{description}</p>
      )}

      {/* 投票按钮 */}
      <button
        onClick={onVote}
        disabled={isLoading}
        className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2 rounded-md mt-2 disabled:opacity-50"
      >
        {isLoading ? "投票中..." : `投给 ${name}`}
      </button>
    </div>
  );
}
