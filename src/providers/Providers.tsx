"use client";

import React from "react";
import { ThemeProvider } from "./theme-provider";
import { AuthProvider } from "./auth-provider";
import QueryProvider from "./query-provider";
import { LayoutWrapper } from "@/src/components/layout/layout-wrapper";
import { ServiceWorkerRegistration } from "@/src/components/providers/service-worker-registration";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <ServiceWorkerRegistration />
          <LayoutWrapper>{children}</LayoutWrapper>
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
