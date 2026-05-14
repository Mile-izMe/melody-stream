"use client";

import { FormEvent } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  permissionName: string;
  setPermissionName: (v: string) => void;
  canCreatePermission: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function CreatePermissionModal({
  isOpen,
  onClose,
  permissionName,
  setPermissionName,
  canCreatePermission,
  onSubmit,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-ms-scrim/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-2xl border border-ms-border-default bg-ms-bg-raised p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ms-accent mb-2">
              Create permission
            </p>
            <h2 className="text-xl font-bold tracking-tight">New permission</h2>
            <p className="text-sm text-ms-text-secondary truncate">
              Create a new permission to assign to roles.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-full p-2 text-ms-text-tertiary hover:text-ms-text-primary hover:bg-ms-bg-elevated ms-transition"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              value={permissionName}
              onChange={(event) => setPermissionName(event.target.value)}
              placeholder="e.g. MANAGE_USERS"
              className="w-full rounded-xl border border-ms-border-default bg-ms-bg-elevated px-4 py-3 text-sm outline-none placeholder:text-ms-text-tertiary focus:border-ms-accent"
            />
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-ms-text-primary bg-ms-bg-elevated border border-ms-border-subtle ms-transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canCreatePermission}
              className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-ms-accent px-4 py-2 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover disabled:opacity-50 ms-transition"
            >
              <Plus size={14} />
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
