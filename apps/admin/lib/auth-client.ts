import { emailOTPClient, magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:8080",
  plugins: [emailOTPClient(), magicLinkClient()],
  sessionOptions: {
    refetchInterval: 60 * 60 * 2,
    refetchOnWindowFocus: false,
  },
  fetchOptions: {
    credentials: "include",
  },
});
