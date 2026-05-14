"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Users, ChevronRight } from "lucide-react";
import { Spinner } from "@/src/components/ui/spinner";
import { requestPermissionsByRole } from "@/src/features/graphql";
import { useAuth } from "@/src/stores/use-auth-store";

interface RoleItem {
  id: string;
  name: string;
}

interface UserPermissionInfo {
  userId: string;
  username: string;
  email: string;
  permissions: { id: string; name: string }[];
}

interface Props {
  roles?: RoleItem[];
  usersPermissions?: UserPermissionInfo[];
  isLoading?: boolean;
}

function RoleSection({
  role,
  usersPermissions,
}: {
  role: RoleItem;
  usersPermissions?: UserPermissionInfo[];
}) {
  const { user } = useAuth();
  const token = user?.token;

  const permissionsByRoleQuery = useQuery({
    queryKey: ["permissions-by-role-panel", role.id, user?.id ?? "guest"],
    queryFn: async () => {
      const response = await requestPermissionsByRole(role.id, token);
      return response.permissionsByRole.data?.permissions ?? [];
    },
    enabled: Boolean(token) && Boolean(role.id),
  });

  const rolePermissions = permissionsByRoleQuery.data ?? [];
  const rolePermissionIds = useMemo(
    () => new Set(rolePermissions.map((p) => p.id)),
    [rolePermissions],
  );

  // Match users to this role: a user belongs to a role if they have
  // ALL permissions that role grants (and the role has at least one permission).
  const usersInRole = useMemo(() => {
    if (rolePermissionIds.size === 0) return [];

    return (usersPermissions ?? []).filter((u) => {
      const userPermIds = new Set(u.permissions.map((p) => p.id));
      for (const rolePermId of rolePermissionIds) {
        if (!userPermIds.has(rolePermId)) return false;
      }
      return true;
    });
  }, [usersPermissions, rolePermissionIds]);

  const isLoading = permissionsByRoleQuery.isLoading;

  return (
    <div className="rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated overflow-hidden">
      {/* Role header */}
      <div className="flex items-center justify-between gap-3 border-b border-ms-border-subtle bg-ms-bg-raised/50 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ms-accent/15">
            <Shield size={14} className="text-ms-accent" />
          </div>
          <span className="text-sm font-bold uppercase tracking-[0.12em] text-ms-text-primary">
            {role.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-ms-border-subtle px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
            {rolePermissions.length} permissions
          </span>
          <span className="rounded-full border border-ms-border-subtle px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
            {usersInRole.length} users
          </span>
        </div>
      </div>

      {/* Role permissions */}
      <div className="px-5 pt-4 pb-2">
        {isLoading ? (
          <div className="flex items-center gap-2 py-2 text-xs text-ms-text-secondary">
            <Spinner className="size-3" />
            Loading…
          </div>
        ) : rolePermissions.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {rolePermissions.map((permission) => (
              <span
                key={permission.id}
                className="rounded-full bg-ms-accent-subtle px-3 py-1 text-xs font-medium text-ms-accent"
              >
                {permission.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-ms-text-tertiary italic">
            No permissions assigned to this role yet.
          </p>
        )}
      </div>

      {/* Users in this role */}
      <div className="px-5 pb-4 pt-2">
        {usersInRole.length > 0 ? (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
              Members
            </p>
            {usersInRole.map((u) => (
              <div
                key={u.userId}
                className="flex items-center gap-3 rounded-xl border border-ms-border-subtle bg-ms-bg-raised px-3.5 py-2.5"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ms-accent/10 text-xs font-bold uppercase text-ms-accent">
                  {u.username.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ms-text-primary truncate">
                    {u.username}
                  </p>
                  <p className="text-[11px] text-ms-text-tertiary truncate">
                    {u.email}
                  </p>
                </div>
                <ChevronRight
                  size={14}
                  className="text-ms-text-tertiary flex-shrink-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ms-border-subtle bg-ms-bg-raised/40 px-3.5 py-3 text-center">
            <Users size={16} className="mx-auto mb-1 text-ms-text-tertiary/50" />
            <p className="text-xs text-ms-text-tertiary">
              No users with this role yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UsersPermissionsPanel({
  roles,
  usersPermissions,
  isLoading,
}: Props) {
  return (
    <div className="rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-5 shadow-sm xl:col-span-2">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
        <Shield size={16} className="text-ms-accent" />
        Current permissions
      </div>
      {isLoading ? (
        <div className="flex items-center gap-3 py-8 text-ms-text-secondary">
          <Spinner className="size-4" />
          Loading permissions...
        </div>
      ) : (
        <div className="space-y-4">
          {roles && roles.length > 0 ? (
            roles.map((role) => (
              <RoleSection
                key={role.id}
                role={role}
                usersPermissions={usersPermissions}
              />
            ))
          ) : (
            <div className="rounded-xl border border-dashed border-ms-border-subtle bg-ms-bg-elevated p-4 text-sm text-ms-text-secondary">
              No roles found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
