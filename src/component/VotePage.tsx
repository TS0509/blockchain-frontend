"use client";

import { useEffect, useState } from "react";
import CandidateCard from "@/component/CandidateCard";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";
import { ethers } from "ethers";

type Candidate = {
  name: string;
  index: number;
};

export default function VotePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [walletAddress, setWalletAddress] = useState("");

  // 🔄 加载候选人 & 用户信息
  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

        const rawCandidates = await contract.getCandidates();
        const parsed = rawCandidates.map((c: any, i: number) => ({
          name: c.name,
          index: i,
        }));
        setCandidates(parsed);
      } catch (err) {
        console.error("获取候选人失败", err);
      }
    };

    fetchCandidates();

    // ⬇️ 加载本地用户钱包地址
    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) setWalletAddress(storedWallet);
  }, []);

  // 🗳️ 发送投票请求
  const handleVote = async (index: number) => {
    setIsLoading(true);
    setMessage("");

    try {
      const ic = localStorage.getItem("icNumber");
      if (!ic) throw new Error("找不到您的 IC 号码，请先登录");

      const res = await fetch("http://localhost:8080/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: index, ic }),
      });

      if (!res.ok) {
        const errorText = await res.text();

        // 🔍 错误识别
        if (errorText.includes("Already voted")) {
          throw new Error("您已投过票，不能重复投票");
        } else if (errorText.includes("Voting not started")) {
          throw new Error("投票尚未开始，请稍后再试");
        } else if (errorText.includes("User not found")) {
          throw new Error("未找到您的身份，请重新登录");
        } else {
          throw new Error("投票失败：" + errorText);
        }
      }

      const data = await res.json();
      setMessage(`✅ 投票成功！交易哈希：${data.txHash}`);
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">🗳️ 投票页面</h2>

      {/* 当前钱包地址 */}
      {walletAddress && (
        <p className="text-sm text-gray-500">
          当前钱包地址：<span className="text-blue-700">{walletAddress}</span>
        </p>
      )}

      {/* 候选人列表 */}
      <div className="grid md:grid-cols-2 gap-4">
        {candidates.map((c) => (
          <CandidateCard
            key={c.index}
            name={c.name}
            index={c.index}
            onVote={() => handleVote(c.index)}
            isLoading={isLoading}
          />
        ))}
      </div>

      {/* 状态信息 */}
      {message && <p className="text-center text-lg mt-4">{message}</p>}
    </div>
  );
}
