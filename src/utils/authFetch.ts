export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    ...(init.headers || {}),
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  const response = await fetch(input, {
    ...init,
    headers,
  });

  if (response.status === 401) {
    // 401 token 失效自动清除
    localStorage.removeItem("token");
    localStorage.removeItem("icNumber");
    localStorage.removeItem("walletAddress");
    window.location.href = "/";
    return Promise.reject("未授权，请重新登录");
  }

  return response;
}
