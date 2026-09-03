"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getMe } from "./api";
import type { User } from "@/types";

export function useAuth(requireAuth = false) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      queueMicrotask(() => setLoading(false));
      if (requireAuth) router.push("/admin/login");
      return;
    }

    getMe()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem("token");
        if (requireAuth) router.push("/admin/login");
      })
      .finally(() => setLoading(false));
  }, [requireAuth, router]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/admin/login");
  };

  return { user, loading, logout };
}

export function setToken(token: string) {
  localStorage.setItem("token", token);
}

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}
