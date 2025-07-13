import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/utils/authFetch";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export default function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // ✅ 动态读取后端地址
    authFetch(`${API_URL}/auth/check`, {
      method: "GET",
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Invalid token");
      })
      .catch(() => {
        localStorage.clear();
        router.push("/");
      });
  }, [router]);
}
