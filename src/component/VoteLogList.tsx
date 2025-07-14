"use client";

import { useEffect, useState } from "react";
import { authFetch } from "@/utils/authFetch";
import useAuthGuard from "@/hook/useAuthGuard";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

interface VoteLog {
  voter: string;
  candidateIndex: number;
  txHash: string;
  blockNumber: number;
}

export default function VoteLogList() {
  const [logs, setLogs] = useState<VoteLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useAuthGuard();

  useEffect(() => {
    const fetchVoteLogs = async () => {
      try {
        const res = await authFetch(`${API_URL}/api/votelogs`);
        if (!res.ok) throw new Error("无法获取投票日志");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error(err);
        setError("❌ 获取投票日志失败");
      } finally {
        setLoading(false);
      }
    };
    fetchVoteLogs();
  }, []);

  if (loading) return <p className="text-center mt-10">加载中...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center text-[#010066]">投票记录</h2>
      {logs.map((log, idx) => (
        <div
          key={idx}
          className="p-4 bg-white rounded-lg shadow border border-gray-200"
        >
          <p><strong>投票人:</strong> {log.voter}</p>
          <p><strong>候选人编号:</strong> {log.candidateIndex}</p>
          <p><strong>区块编号:</strong> {log.blockNumber}</p>
          <p className="break-all">
            <strong>交易哈希:</strong> {log.txHash}
          </p>
        </div>
      ))}
    </div>
  );
}
