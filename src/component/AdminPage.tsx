"use client";

import { useState } from "react";

export default function AdminPage() {
  const [candidateName, setCandidateName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleAddCandidate = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/add-candidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: candidateName, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "添加失败");
      setMessage("✅ 添加成功！");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  const handleStartVoting = async () => {
    try {
      const res = await fetch("http://localhost:8080/admin/start-voting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "启动失败");
      setMessage("✅ 投票已开始");
    } catch (err: any) {
      setMessage("❌ " + err.message);
    }
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">🔐 管理员控制台</h2>

      <input
        type="password"
        placeholder="管理员密码"
        className="border px-2 py-1"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <div className="flex gap-2">
        <input
          value={candidateName}
          onChange={(e) => setCandidateName(e.target.value)}
          placeholder="候选人名称"
          className="border px-2 py-1"
        />
        <button onClick={handleAddCandidate} className="bg-blue-600 text-white px-4 py-1 rounded">
          添加候选人
        </button>
      </div>

      <button onClick={handleStartVoting} className="bg-green-600 text-white px-4 py-2 rounded">
        开始投票
      </button>

      {message && <p className="mt-4 text-lg">{message}</p>}
    </div>
  );
}
