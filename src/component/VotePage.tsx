"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function VotePage() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleVote(candidate: number) {
    setIsLoading(true);
    try {
      // Step 1: 获取 IC（从 localStorage）
      const ic = localStorage.getItem("ic");
      if (!ic) throw new Error("User IC not found");

      // Step 2: 请求私钥
      const resUser = await fetch("/api/getUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ic }),
      });

      const userData = await resUser.json();
      if (!resUser.ok) throw new Error(userData.error || "Failed to get user");

      const privateKey = userData.privateKey;

      // Step 3: 发起投票请求
      const resVote = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate,
          privateKey,
        }),
      });

      const voteData = await resVote.json();
      if (!resVote.ok) throw new Error(voteData.error || "Vote failed");

      setMessage(`✅ 投票成功，交易哈希：${voteData.txHash}`);
    } catch (err: any) {
      setMessage("❌ " + (err.message || "发生错误"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">🗳️ 请选择候选人</h2>
      <button
        className="bg-blue-500 text-white p-2 rounded"
        disabled={isLoading}
        onClick={() => handleVote(0)}
      >
        投给候选人 A
      </button>
      <button
        className="bg-green-500 text-white p-2 rounded"
        disabled={isLoading}
        onClick={() => handleVote(1)}
      >
        投给候选人 B
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
