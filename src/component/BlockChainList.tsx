"use client";

import { useEffect, useState } from "react";
import useAuthGuard from "@/hook/useAuthGuard";
import { authFetch } from "@/utils/authFetch";


interface ExportedBlock {
  number: number;
  hash: string;
  parentHash: string;
  timestamp: number;
  txCount: number;
  txs?: string[];
}

export default function BlockChainList() {
  const [blocks, setBlocks] = useState<ExportedBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useAuthGuard();

  useEffect(() => {
    const authFetchBlocks = async () => {
      try {
        const res = await authFetch("http://localhost:8080/api/blocks");
        if (!res.ok) throw new Error("Failed to authFetch");
        const rawData = await res.json();

        const safeData = rawData.map((b: ExportedBlock) => ({
          ...b,
          txs: Array.isArray(b.txs) ? b.txs : [],
        }));

        setBlocks(safeData);
      } catch (err) {
        console.error("Error authFetching blocks:", err);
        setError("❌ 无法获取区块数据");
      } finally {
        setLoading(false);
      }
    };

    authFetchBlocks();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#010066] flex items-center justify-center relative">
          <div className="w-12 h-12 rounded-full bg-[#FFCC00] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#CC0000]"></div>
          </div>
        </div>
        <p className="text-[#010066]">加载中...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-[#010066] flex items-center justify-center relative">
          <div className="w-12 h-12 rounded-full bg-[#FFCC00] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-[#CC0000]"></div>
          </div>
        </div>
        <p className="text-red-500">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8">
      {/* Malaysian flag pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-[#CC0000]"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-[#010066]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header with Malaysian emblem */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#010066] flex items-center justify-center mr-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFCC00] flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CC0000]"></div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#010066]">
              <span className="text-[#CC0000]">区块链结构</span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Struktur Rantai Blok
          </p>
        </div>

        {/* Blocks list */}
        <div className="space-y-4">
          {blocks.map((block, index) => (
            <div
              key={block.number || index}
              className="p-4 sm:p-6 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-[#D4AF37]/30"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-[#010066] font-medium">区块高度</p>
                  <p className="text-sm sm:text-base">#{block.number ?? "未知"}</p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#010066] font-medium">时间戳</p>
                  <p className="text-sm sm:text-base">
                    {isNaN(Number(block.timestamp))
                      ? "无效时间"
                      : new Date(Number(block.timestamp) * 1000).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#010066] font-medium">交易数量</p>
                  <p className="text-sm sm:text-base">{block.txCount ?? "未知"}</p>
                </div>
              </div>

              <div className="mt-3 sm:mt-4">
                <p className="text-xs sm:text-sm text-[#010066] font-medium">区块哈希</p>
                <p className="text-xs sm:text-sm text-gray-700 break-all">{block.hash || "无"}</p>
              </div>

              <div className="mt-2">
                <p className="text-xs sm:text-sm text-[#010066] font-medium">父区块哈希</p>
                <p className="text-xs sm:text-sm text-gray-700 break-all">{block.parentHash || "无"}</p>
              </div>

              {block.txs && block.txs.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs sm:text-sm text-[#010066] font-medium">交易列表</p>
                  <ul className="mt-1 space-y-1">
                    {block.txs.map((tx) => (
                      <li 
                        key={tx} 
                        className="text-xs sm:text-sm text-blue-700 break-all px-2 py-1 bg-blue-50 rounded"
                      >
                        {tx}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Malaysian government footer note */}
        <p className="mt-8 text-xs sm:text-sm text-center text-gray-500">
          Dibawah Kelolaan <span className="text-[#010066] font-medium">SPR Malaysia</span>
        </p>
      </div>
    </div>
  );
}