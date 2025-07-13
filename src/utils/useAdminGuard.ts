"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

function decodeJwtPayload(token: string) {
  const payloadBase64Url = token.split(".")[1];
  const payloadBase64 = payloadBase64Url.replace(/-/g, "+").replace(/_/g, "/");

  try {
    const decoded = JSON.parse(atob(payloadBase64));
    return decoded;
  } catch (e) {
    console.error("❌ JWT Payload 无法解析", e);
    return null;
  }
}

export default function useAdminGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/"); // ❌ 没 token
      return;
    }

    const payload = decodeJwtPayload(token);

    if (!payload || payload.role !== "admin") {
      router.replace("/"); // ❌ 非 admin 或解析失败
      return;
    }

    // ✅ 是 admin，允许进入
  }, []);
}
