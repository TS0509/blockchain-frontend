import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authFetch } from "@/utils/authFetch";

export default function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    // 去后端验证 token
    fetch("http://localhost:8080/auth/check", {
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
