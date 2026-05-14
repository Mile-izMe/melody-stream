"use client";

import { KeyRound, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface PermissionItem {
  id: string;
  name: string;
}

interface Props {
  availablePermissions: PermissionItem[];
  onOpenCreateModal: () => void;
}

export default function AllPermissionsPanel({
  availablePermissions,
  onOpenCreateModal,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-5 shadow-sm xl:col-span-3"
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
          <KeyRound size={16} className="text-ms-accent" />
          All permissions
        </div>
        <div>
          <button
            type="button"
            onClick={onOpenCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-ms-accent px-4 py-2 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover ms-transition"
          >
            <Plus size={14} />
            Create permission
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {availablePermissions.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ms-border-subtle bg-ms-bg-elevated p-4 text-sm text-ms-text-secondary">
            No permissions yet.
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {availablePermissions.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated p-4"
              >
                <p className="font-semibold text-ms-text-primary">{p.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.section>
  );
}
