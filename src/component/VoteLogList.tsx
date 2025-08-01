"use client";
import { useRouter } from "next/navigation";
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

interface PaginatedResponse {
  logs: VoteLog[];
  totalCount: number;
  page: number;
  pageSize: number;
}

export default function VoteLogList() {
  const [logs, setLogs] = useState<VoteLog[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10); // 可自定义分页大小
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  useAuthGuard();

  const fetchVoteLogs = async (page: number) => {
    setLoading(true);
    try {
      const res = await authFetch(
        `${API_URL}/api/votelog?page=${page}&size=${pageSize}`
      );
      if (!res.ok) throw new Error("无法获取投票日志");
      const data: PaginatedResponse = await res.json();
      setLogs(data.logs);
      setTotal(data.totalCount);
    } catch (err) {
      console.error(err);
      setError("❌ 获取投票日志失败");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVoteLogs(page);
  }, [page]);

  const totalPages = Math.ceil(total / pageSize);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 space-y-6">
      <button
        onClick={() => router.push("/home")}
        className="fixed top-4 left-4 z-20 cursor-pointer bg-white/80 text-blue-700 px-4 py-2 rounded-xl shadow hover:bg-white/100 active:scale-95 transition-transform"
      >
        ← Home
      </button>
      <h2 className="text-2xl font-bold text-center text-[#010066]">
        voting record
      </h2>

      {logs.length === 0 ? (
        <p className="text-center text-gray-500">No record yet</p>
      ) : (
        logs.map((log, idx) => (
          <div
            key={idx}
            className="p-4 bg-white rounded-lg shadow border border-gray-200"
          >
            <p>
              <strong>Voter:</strong> {log.voter}
            </p>
            <p>
              <strong>Candidate number:</strong> {log.candidateIndex}
            </p>
            <p>
              <strong>block number:</strong> {log.blockNumber}
            </p>
            <p className="break-all">
              <strong>transaction hash:</strong> {log.txHash}
            </p>
          </div>
        ))
      )}

      {/* 分页控件 */}
      <div className="flex justify-center items-center space-x-4 mt-4">
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Previous page
        </button>
        <span className="text-gray-700">
          the <strong>{page}</strong> page / total <strong>{totalPages}</strong>{" "}
          page
        </span>
        <button
          className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Next page
        </button>
      </div>
    </div>
  );
}
