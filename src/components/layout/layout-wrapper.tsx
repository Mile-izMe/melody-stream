"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Layout } from "./sidebar";
import { useTheme } from "@/src/providers/theme-provider";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { toggleTheme, isDarkMode } = useTheme();
  const pathname = usePathname();

  // Don't show layout for login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
      {children}
    </Layout>
  );
}
