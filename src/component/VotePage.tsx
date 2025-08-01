"use client";

import { useEffect, useState } from "react";
import CandidateCard from "@/component/CandidateCard";
import useAuthGuard from "@/hook/useAuthGuard";
import { authFetch } from "@/utils/authFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

type Candidate = {
  name: string;
  index: number;
  avatar?: string;
};

export default function VotePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [voteStatusMap, setVoteStatusMap] = useState<
    Record<number, "default" | "loading" | "success">
  >({});
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"default" | "success" | "error">(
    "default"
  );
  const [walletAddress, setWalletAddress] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  useAuthGuard();

  type CandidateResponse = {
  name: string;
  index: number;
  avatar?: string;
};


  useEffect(() => {
    const fetchFromBackend = async () => {
      try {
        const res = await authFetch(`${API_URL}/candidates`);
        const data = await res.json();

        const parsed: Candidate[] = (data as CandidateResponse[]).map((c) => ({
          name: c.name,
          index: c.index,
          avatar: c.avatar,
        }));

        setCandidates(parsed);
      } catch (err) {
        console.error("Failed to get candidates", err);
      }
    };

    fetchFromBackend();

    const storedWallet = localStorage.getItem("walletAddress");
    if (storedWallet) setWalletAddress(storedWallet);
  }, []);

  const handleVote = async (index: number) => {
    setVoteStatusMap((prev) => ({ ...prev, [index]: "loading" }));
    setMessage("");
    setStatus("default");

    try {
      const ic = localStorage.getItem("icNumber");
      if (!ic) throw new Error("Can't find your IC number, please log in first");

      const res = await authFetch(`${API_URL}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ candidate: index, ic }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      const data = await res.json();
      setMessage(`✅ Voting successful! Transaction hash：${data.txHash}`);
      setStatus("success");

      setVoteStatusMap((prev) => ({ ...prev, [index]: "success" }));
      setHasVoted(true);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "An unknown error occurred";
      setMessage("❌ " + errMsg);
      setStatus("error");
      setVoteStatusMap((prev) => ({ ...prev, [index]: "default" }));
    }
  };

  const getMessageColor = () => {
    switch (status) {
      case "success":
        return "text-green-600";
      case "error":
        return "text-red-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-8 relative">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-[#CC0000]"></div>
        <div className="absolute top-1/3 left-0 w-full h-1/3 bg-white"></div>
        <div className="absolute top-2/3 left-0 w-full h-1/3 bg-[#010066]"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#010066] flex items-center justify-center mr-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#FFCC00] flex items-center justify-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#CC0000]"></div>
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#010066]">
              <span className="text-[#CC0000]">voting page</span>
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Halaman Pengundian
          </p>
        </div>

        {walletAddress && (
          <div className="bg-white/90 backdrop-blur-sm p-4 rounded-xl shadow-md border border-[#D4AF37]/30 mb-6">
            <p className="text-xs sm:text-sm text-[#010066] font-medium">
              Current wallet address
            </p>
            <p className="text-xs sm:text-sm text-blue-700 break-all mt-1">
              {walletAddress}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {candidates.map((c) => (
            <CandidateCard
              key={c.index}
              name={c.name}
              index={c.index}
              avatar={c.avatar}
              onVote={() => handleVote(c.index)}
              isLoading={voteStatusMap[c.index] === "loading"}
              hasVoted={hasVoted}
            />
          ))}
        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl text-center ${
              status === "success"
                ? "bg-green-50"
                : status === "error"
                ? "bg-red-50"
                : "bg-gray-50"
            }`}
          >
            <p
              className={`text-sm sm:text-base font-medium ${getMessageColor()}`}
            >
              {message}
            </p>
          </div>
        )}

        <p className="mt-8 text-xs sm:text-sm text-center text-gray-500">
          Dibawah Kelolaan{" "}
          <span className="text-[#010066] font-medium">SPR Malaysia</span>
        </p>
      </div>
    </div>
  );
}
