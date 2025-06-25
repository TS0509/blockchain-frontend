"use client";
import { useVoteListener } from "@/component/useVoteListener";
import { useState } from "react";

export default function VotePage() {
  const [votes, setVotes] = useState<{ voter: string; candidateIndex: number }[]>([]);

  useVoteListener((voter, candidateIndex) => {
    setVotes((prev) => [...prev, { voter, candidateIndex }]);
  });

  return (
    <div>
      <h2 className="text-xl font-bold">📊 实时投票监听</h2>
      <ul>
        {votes.map((v, i) => (
          <li key={i}>
            🧑 {v.voter} 投给候选人 #{v.candidateIndex}
          </li>
        ))}
      </ul>
    </div>
  );
}
