"use client";

import { useRouter } from "next/navigation";
import React from "react";

export default function Main() {
  const router = useRouter();

  return (
    <main className="flex flex-col justify-center items-center h-screen bg-gray-100 gap-6">
      <h1 className="text-3xl font-bold">Welcome to Blockchain Voting</h1>
      <div className="flex gap-4">
        <button
          className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          onClick={() => router.push("/login")}
        >
          Login
        </button>
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
          onClick={() => router.push("/register")}
        >
          Register
        </button>
      </div>
    </main>
  );
}
