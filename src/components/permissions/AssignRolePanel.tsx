/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Plus, Users } from "lucide-react";

interface RoleItem {
  id: string;
  name: string;
}

interface PermissionItem {
  id: string;
  name: string;
}

interface Props {
  roles?: RoleItem[];
  selectedRoleId: string;
  setSelectedRoleId: (v: string) => void;
  selectedPermissionIds: string[];
  onTogglePermissionId: (permissionId: string) => void;
  availablePermissions: PermissionItem[];
  onSubmit: (e: any) => void;
  canAssignPermission: boolean;
}

export default function AssignRolePanel({
  roles,
  selectedRoleId,
  setSelectedRoleId,
  selectedPermissionIds,
  onTogglePermissionId,
  availablePermissions,
  onSubmit,
  canAssignPermission,
}: Props) {
  return (
    <div className="rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
        <Users className="h-4 w-4 text-ms-accent" />
        Assign role permission
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <select
          value={selectedRoleId}
          onChange={(event) => setSelectedRoleId(event.target.value)}
          className="cursor-pointer w-full rounded-xl border border-ms-border-default bg-ms-bg-elevated px-4 py-3 text-sm outline-none focus:border-ms-accent"
        >
          <option value="">Select role</option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <div className="rounded-xl border border-ms-border-default bg-ms-bg-elevated p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-ms-text-tertiary">
            Select one or many permissions
          </p>
          <div className="max-h-56 space-y-2 overflow-auto pr-1">
            {availablePermissions.length === 0 ? (
              <p className="rounded-lg border border-dashed border-ms-border-subtle bg-ms-bg-raised px-3 py-2 text-xs text-ms-text-tertiary">
                No assignable permissions left for this role.
              </p>
            ) : null}

            {availablePermissions.map((permission) => {
              const checked = selectedPermissionIds.includes(permission.id);

              return (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg border border-ms-border-subtle bg-ms-bg-raised px-3 py-2"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onTogglePermissionId(permission.id)}
                    className="h-4 w-4 rounded border-ms-border-default"
                  />
                  <span className="text-sm text-ms-text-primary">
                    {permission.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={!canAssignPermission}
          className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-ms-accent px-4 py-3 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover disabled:opacity-50 ms-transition"
        >
          <Plus size={16} />
          Assign
        </button>
      </form>
    </div>
  );
}
