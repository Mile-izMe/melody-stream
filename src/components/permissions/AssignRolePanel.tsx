"use client";

import { Plus } from "lucide-react";

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
  selectedPermissionId: string;
  setSelectedPermissionId: (v: string) => void;
  availablePermissions: PermissionItem[];
  onSubmit: (e: any) => void;
  canAssignPermission: boolean;
}

export default function AssignRolePanel({
  roles,
  selectedRoleId,
  setSelectedRoleId,
  selectedPermissionId,
  setSelectedPermissionId,
  availablePermissions,
  onSubmit,
  canAssignPermission,
}: Props) {
  return (
    <div className="rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
        <svg className="h-4 w-4 text-ms-accent" />
        Assign role permission
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <select
          value={selectedRoleId}
          onChange={(event) => setSelectedRoleId(event.target.value)}
          className="w-full rounded-xl border border-ms-border-default bg-ms-bg-elevated px-4 py-3 text-sm outline-none focus:border-ms-accent"
        >
          <option value="">Select role</option>
          {roles?.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <select
          value={selectedPermissionId}
          onChange={(event) => setSelectedPermissionId(event.target.value)}
          className="w-full rounded-xl border border-ms-border-default bg-ms-bg-elevated px-4 py-3 text-sm outline-none focus:border-ms-accent"
        >
          <option value="">Select permission</option>
          {availablePermissions.map((permission) => (
            <option key={permission.id} value={permission.id}>
              {permission.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={!canAssignPermission}
          className="inline-flex items-center gap-2 rounded-xl bg-ms-accent px-4 py-3 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover disabled:opacity-50 ms-transition"
        >
          <Plus size={16} />
          Assign
        </button>
      </form>
    </div>
  );
}
