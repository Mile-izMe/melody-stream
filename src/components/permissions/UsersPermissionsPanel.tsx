"use client";

import { Shield } from "lucide-react";
import { Spinner } from "@/src/components/ui/spinner";

interface UserPermissionInfo {
  userId: string;
  username: string;
  email: string;
  permissions: { id: string; name: string }[];
}

interface Props {
  usersPermissions?: UserPermissionInfo[];
  isLoading?: boolean;
}

export default function UsersPermissionsPanel({
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
        <div className="space-y-3">
          {usersPermissions?.map((userPermission) => (
            <div
              key={userPermission.userId}
              className="rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ms-text-primary">
                    {userPermission.username}
                  </p>
                  <p className="text-xs text-ms-text-tertiary">
                    {userPermission.email}
                  </p>
                </div>
                <span className="rounded-full border border-ms-border-subtle px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
                  {userPermission.permissions.length} permissions
                </span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {userPermission.permissions.length > 0 ? (
                  userPermission.permissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="rounded-full bg-ms-accent-subtle px-3 py-1 text-xs font-medium text-ms-accent"
                    >
                      {permission.name}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-ms-text-tertiary">
                    No permissions
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
