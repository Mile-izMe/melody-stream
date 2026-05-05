"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Layout } from "./sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show layout for login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}
