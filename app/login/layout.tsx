"use client";

import React from "react";
import { AuthProvider } from "@/src/providers/auth-provider";
import { ThemeProvider } from "@/src/providers/theme-provider";
import QueryProvider from "@/src/providers/query-provider";

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>{children}</QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
