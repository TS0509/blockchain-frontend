"use client";

import { useEffect, useState } from "react";
import ResultChart from "@/component/ResultChart";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/utils/contract";
import { ethers } from "ethers";
import useAuthGuard from "@/hook/useAuthGuard";

const COLORS = ["#010066", "#CC0000", "#FFCC00", "#0066CC", "#00AA00", "#6600CC"];

type VoteResult = {
  name: string;
  votes: number;
};

export default function ResultPage() {
  const [results, setResults] = useState<VoteResult[]>([]);
  const [loading, setLoading] = useState(true);
  useAuthGuard();

  useEffect(() => {
    const loadVotes = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
        const rawCandidates = await contract.getCandidates();

        const parsed: VoteResult[] = rawCandidates.map((c: any) => ({
          name: c.name,
          votes: Number(c.voteCount ?? 0),
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 px-2 py-4 sm:p-6 relative">
      {/* Malaysian flag pattern overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-[#CC0000]"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-[#010066]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header with Malaysian emblem - Mobile optimized */}
        <div className="flex flex-col items-center sm:flex-row sm:justify-between mb-4 sm:mb-6">
          <div className="flex items-center mb-3 sm:mb-0">
            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-[#010066] flex items-center justify-center mr-3 sm:mr-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FFCC00] flex items-center justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#CC0000]"></div>
              </div>
            </div>
            <h1 className="text-lg sm:text-2xl font-bold text-[#010066]">
              <span className="text-[#CC0000]">投票结果</span>
            </h1>
          </div>
          <p className="text-xs sm:text-base text-gray-600">
            Keputusan Undian
          </p>
        </div>

        {/* Results container - Mobile optimized padding */}
        <div className="bg-white/90 backdrop-blur-sm p-3 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg border border-[#D4AF37]/30">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8">
              <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-[#010066] border-t-[#FFCC00] rounded-full animate-spin mb-3 sm:mb-4"></div>
              <p className="text-sm sm:text-base text-[#010066]">加载中 / Memuatkan...</p>
            </div>
          ) : results.length > 0 ? (
            <>
              <div className="w-full h-[250px] sm:h-[350px]">
                <ResultChart data={results} colors={COLORS} />
              </div>
              
              {/* Candidate list - Responsive grid */}
              <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                {results.map((result, index) => (
                  <div key={index} className="flex items-center py-1 sm:py-0">
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    ></div>
                    <span className="text-xs sm:text-sm text-[#010066] truncate">
                      {result.name}: <span className="font-medium">{result.votes} 票</span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center py-6 sm:py-8 text-sm sm:text-base text-gray-600">
              暂无投票数据 / Tiada data undian
            </p>
          )}
        </div>

        {/* Malaysian government footer note - Mobile optimized */}
        <p className="mt-4 sm:mt-6 text-[10px] sm:text-xs text-center text-gray-500">
          Dibawah Kelolaan <span className="text-[#010066] font-medium">SPR Malaysia</span>
        </p>
      </div>
    </div>
  );
}