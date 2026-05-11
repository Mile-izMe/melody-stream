"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster({ ...props }: ToasterProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Sonner
      theme={resolvedTheme === "light" ? "light" : "dark"}
      richColors
      position="top-right"
      closeButton
      toastOptions={{
        classNames: {
          toast:
            "!bg-ms-bg-raised !text-ms-text-primary !border !border-ms-border-default !shadow-xl",
          title: "!text-ms-text-primary",
          description: "!text-ms-text-secondary",
          actionButton: "!bg-ms-accent !text-ms-bg-deep",
          cancelButton: "!bg-ms-bg-elevated !text-ms-text-secondary",
        },
      }}
      {...props}
    />
  );
}
