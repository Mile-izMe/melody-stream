"use client";

import React from "react";
import { Layout } from "./sidebar";
import { useTheme } from "@/src/providers/theme-provider";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const { toggleTheme, isDarkMode } = useTheme();

  return (
    <Layout toggleTheme={toggleTheme} isDarkMode={isDarkMode}>
      {children}
    </Layout>
  );
}
