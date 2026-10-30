"use client";

import { SessionProvider } from "next-auth/react";

import { SessionGuard } from "@/components/SessionGuard";

export function AuthProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SessionGuard />
      {children}
    </SessionProvider>
  );
}
