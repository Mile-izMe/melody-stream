"use client";

import { Shield, Users, ChevronRight } from "lucide-react";
import { Spinner } from "@/src/components/ui/spinner";
import { RolePermissionsSummary } from "@/src/features/graphql";

interface Props {
  roleSummaries?: RolePermissionsSummary[];
  isLoading?: boolean;
}

function RoleSection({ summary }: { summary: RolePermissionsSummary }) {
  const rolePermissions = summary.permissions;
  const usersInRole = summary.users;

  return (
    <div className="rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated overflow-hidden">
      {/* Role header */}
      <div className="flex items-center justify-between gap-3 border-b border-ms-border-subtle bg-ms-bg-raised/50 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ms-accent/15">
            <Shield size={14} className="text-ms-accent" />
          </div>
          <span className="text-sm font-bold uppercase tracking-[0.12em] text-ms-text-primary">
            {summary.role.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full border border-ms-border-subtle px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
            {summary.permissionCount} permissions
          </span>
          <span className="rounded-full border border-ms-border-subtle px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
            {summary.userCount} users
          </span>
        </div>
      </div>

      {/* Role permissions */}
      <div className="px-5 pt-4 pb-2">
        {rolePermissions.length > 0 ? (
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
                key={u.username}
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
                  className="text-ms-text-tertiary shrink-0"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-ms-border-subtle bg-ms-bg-raised/40 px-3.5 py-3 text-center">
            <Users
              size={16}
              className="mx-auto mb-1 text-ms-text-tertiary/50"
            />
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
  roleSummaries,
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
          {roleSummaries && roleSummaries.length > 0 ? (
            roleSummaries.map((summary) => (
              <RoleSection key={summary.role.id} summary={summary} />
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
