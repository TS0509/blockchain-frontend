"use client";

import { useEffect, useState } from "react";

interface ExportedBlock {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  txCount: number;
  txs?: string[]; // ← 允许 txs 为可选，防止出错
}

export default function BlockChainList() {
  const [blocks, setBlocks] = useState<ExportedBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/blocks");
        if (!res.ok) throw new Error("Failed to fetch");
        const rawData = await res.json();

        // ✨ 防御式兜底 txs 字段，确保一定是数组
        const safeData = rawData.map((b: any) => ({
          ...b,
          txs: Array.isArray(b.txs) ? b.txs : [],
        }));

        setBlocks(safeData);
      } catch (err) {
        console.error("Error fetching blocks:", err);
        setError("❌ 无法获取区块数据");
      } finally {
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  if (loading) return <p className="text-center text-gray-600">加载中...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {blocks.map((block, index) => (
  <div
    key={block.number || index}
    className="p-4 bg-white rounded-xl shadow border"
  >
    <p className="text-sm text-gray-500">区块高度：#{block.number ?? "未知"}</p>
    <p className="text-sm text-gray-500">
      时间戳：
      {isNaN(Number(block.timestamp))
        ? "无效时间"
        : new Date(Number(block.timestamp) * 1000).toLocaleString()}
    </p>
    <p className="text-sm text-gray-700">交易数量：{block.txCount ?? "未知"}</p>
    <p className="text-xs text-gray-400 break-all mt-1">Hash：{block.hash || "无"}</p>
    <p className="text-xs text-gray-400 break-all">Prev：{block.parentHash || "无"}</p>

          {block.txs && block.txs.length > 0 && (
            <div className="text-xs mt-2">
              <p className="text-gray-600">交易哈希:</p>
              <ul className="list-disc ml-4 text-blue-700">
                {block.txs.map((tx) => (
                  <li key={tx} className="break-all">{tx}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
