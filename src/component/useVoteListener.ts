"use client";
import { useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "@/utils/contract";

export function useVoteListener(onVote: (voter: string, candidateId: number) => void) {
  useEffect(() => {
    if (!window.ethereum) return;

    const provider = new ethers.BrowserProvider(window.ethereum);
    let contract: ethers.Contract;

    const setupListener = async () => {
      const signer = await provider.getSigner();
      contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

      contract.on("VoteCast", (voter: string, candidateId: ethers.BigNumberish) => {
        onVote(voter, Number(candidateId));
      });
    };

    setupListener();

    return () => {
      if (contract) {
        contract.removeAllListeners("VoteCast");
      }
    };
  }, [onVote]);
}
