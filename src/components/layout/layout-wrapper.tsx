"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Layout } from "./sidebar";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Only skip sidebar for the login page
  if (pathname === "/login") {
    return <>{children}</>;
  }

  // Sidebar is always visible — app is freely explorable
  return <Layout>{children}</Layout>;
}
