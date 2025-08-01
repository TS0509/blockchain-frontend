// 区块链数据页面：显示所有区块记录
"use client";

import BlockChainList from "@/component/BlockChainList";

export default function BlockChainPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">📦 Blockchain data list</h1>
      <BlockChainList />
    </div>
  );
}
