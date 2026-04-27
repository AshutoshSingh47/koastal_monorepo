import { ApiClient } from "@workspace/api";

const apiClient = new ApiClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api`
    : "http://localhost:3001/api",
  timeout: 30000,
  withCredentials: true,
  onUnauthorized: () => {
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  },
});

export { apiClient };
