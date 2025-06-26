// src/app/result/page.tsx
"use client";

import { useEffect, useState } from "react";
import ResultChart from "@/component/ResultChart";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";
import { ethers } from "ethers";

type VoteResult = {
  name: string;
  votes: number;
};

export default function ResultPage() {
  const [results, setResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVotes = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const rawCandidates = await contract.getCandidates();

        const parsed: VoteResult[] = rawCandidates.map((c: any) => ({
          name: c.name,
          votes: Number(c.voteCount), // 注意 voteCount 是 BigNumber
        }));

        setResults(parsed);
      } catch (err) {
        console.error("读取投票结果失败", err);
      } finally {
        setLoading(false);
      }
    };

    loadVotes();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">📊 投票结果</h2>
      {loading ? (
        <p>加载中...</p>
      ) : results.length > 0 ? (
        <ResultChart data={results} />
      ) : (
        <p>暂无投票数据。</p>
      )}
    </div>
  );
}
