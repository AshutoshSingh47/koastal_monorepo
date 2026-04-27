"use client";

import { authClient } from "@/lib/auth-client";
import { useAuthStore } from "@/store/auth-store";
import { AdminUser } from "@/types/auth";
import { useEffect } from "react";

export function SessionSync() {
  const { data: session } = authClient.useSession();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    setUser(session ? (session.user as unknown as AdminUser) : null);
  }, [session, setUser]);

  return null;
}
