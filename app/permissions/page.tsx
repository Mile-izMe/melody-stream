"use client";

import { FormEvent, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Shield, KeyRound, Users, Plus, BadgeCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/use-auth-store";
import { hasRole } from "@/src/libs/auth-session";
import { Spinner } from "@/src/components/ui/spinner";
import {
  requestRoles,
  requestAllUsersPermissions,
  requestCreatePermission,
  requestCreateRolePermission,
} from "@/src/features/graphql";
import { notify } from "@/src/libs/toast";

export default function PermissionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [permissionName, setPermissionName] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermissionId, setSelectedPermissionId] = useState("");
  const [createdPermissions, setCreatedPermissions] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const isAdmin = hasRole(user, "ADMIN");
  const token = user?.token;

  const rolesQuery = useQuery({
    queryKey: ["permissions-roles", user?.id ?? "guest"],
    queryFn: async () => {
      const response = await requestRoles(token);
      return response.roles.data?.roles ?? [];
    },
    enabled: Boolean(token) && isAdmin,
  });

  const allUsersPermissionsQuery = useQuery({
    queryKey: ["permissions-users", user?.id ?? "guest"],
    queryFn: async () => {
      const response = await requestAllUsersPermissions(token);
      return response.allUsersPermissions.data?.usersPermissions ?? [];
    },
    enabled: Boolean(token) && isAdmin,
  });

  const uniquePermissions = useMemo(() => {
    const collected = new Map<string, { id: string; name: string }>();

    for (const userPermissions of allUsersPermissionsQuery.data ?? []) {
      for (const permission of userPermissions.permissions) {
        if (!collected.has(permission.id)) {
          collected.set(permission.id, {
            id: permission.id,
            name: permission.name,
          });
        }
      }
    }

    return Array.from(collected.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [allUsersPermissionsQuery.data]);

  const availablePermissions = useMemo(() => {
    const collected = new Map<string, { id: string; name: string }>();

    for (const permission of uniquePermissions) {
      collected.set(permission.id, permission);
    }

    for (const permission of createdPermissions) {
      if (!collected.has(permission.id)) {
        collected.set(permission.id, permission);
      }
    }

    return Array.from(collected.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [createdPermissions, uniquePermissions]);

  const createPermissionMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!token) {
        throw new Error("Please sign in first");
      }

      const response = await requestCreatePermission({ name }, token);
      const permission = response.createPermission.data?.permission;

      if (!permission) {
        throw new Error("Unable to create permission");
      }

      return permission;
    },
    onSuccess: async (permission) => {
      setPermissionName("");
      setCreatedPermissions((current) => {
        if (current.some((item) => item.id === permission.id)) {
          return current;
        }

        return [...current, { id: permission.id, name: permission.name }];
      });
      setSelectedPermissionId(permission.id);
      await queryClient.invalidateQueries({ queryKey: ["permissions-users"] });
      notify.success("Permission created", permission.name);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Unable to create permission";
      notify.error("Create failed", message);
    },
  });

  const createRolePermissionMutation = useMutation({
    mutationFn: async (request: { roleId: string; permissionId: string }) => {
      if (!token) {
        throw new Error("Please sign in first");
      }

      const response = await requestCreateRolePermission(request, token);
      const rolePermission = response.createRolePermission.data?.rolePermission;

      if (!rolePermission) {
        throw new Error("Unable to assign permission");
      }

      return rolePermission;
    },
    onSuccess: async (rolePermission) => {
      setSelectedPermissionId("");
      await queryClient.invalidateQueries({ queryKey: ["permissions-users"] });
      await queryClient.invalidateQueries({ queryKey: ["permissions-roles"] });
      notify.success(
        "Permission assigned",
        `${rolePermission.permission.name} -> ${rolePermission.role.name}`,
      );
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Unable to assign permission";
      notify.error("Assign failed", message);
    },
  });

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-8">
        <div className="max-w-lg rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-8 text-center shadow-xl">
          <Shield className="mx-auto mb-4 text-ms-accent" size={34} />
          <h1 className="text-2xl font-bold tracking-tight">Permissions</h1>
          <p className="mt-2 text-sm text-ms-text-secondary">
            Sign in to access the admin permissions dashboard.
          </p>
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ms-accent px-5 py-3 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover ms-transition"
          >
            <Plus size={16} />
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center px-8">
        <div className="max-w-lg rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-8 text-center shadow-xl">
          <BadgeCheck className="mx-auto mb-4 text-ms-accent" size={34} />
          <h1 className="text-2xl font-bold tracking-tight">Access denied</h1>
          <p className="mt-2 text-sm text-ms-text-secondary">
            This page is only available for users with the ADMIN role.
          </p>
        </div>
      </div>
    );
  }

  const handleCreatePermission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextName = permissionName.trim();

    if (!nextName) {
      notify.warning("Name required", "Enter a permission name first.");
      return;
    }

    createPermissionMutation.mutate(nextName);
  };

  const handleAssignRolePermission = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedRoleId || !selectedPermissionId) {
      notify.warning("Select values", "Choose a role and a permission.");
      return;
    }

    createRolePermissionMutation.mutate({
      roleId: selectedRoleId,
      permissionId: selectedPermissionId,
    });
  };

  const canCreatePermission =
    permissionName.trim().length > 0 && !createPermissionMutation.isPending;
  const canAssignPermission =
    Boolean(selectedRoleId) &&
    Boolean(selectedPermissionId) &&
    !createRolePermissionMutation.isPending;

  return (
    <div className="flex flex-col flex-1 pb-28">
      <div className="px-8 pt-8 pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-ms-accent">
              Admin
            </p>
            <h1 className="text-3xl font-bold tracking-tight">Permissions</h1>
            <p className="mt-3 text-sm text-ms-text-secondary">
              Create permissions, assign them to roles, and inspect what each
              user currently has.
            </p>
          </div>
        </div>
      </div>

      <div className="px-8 grid gap-4 xl:grid-cols-3">
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
            <KeyRound size={16} className="text-ms-accent" />
            Create permission
          </div>
          <form onSubmit={handleCreatePermission} className="space-y-3">
            <input
              type="text"
              value={permissionName}
              onChange={(event) => setPermissionName(event.target.value)}
              placeholder="e.g. MANAGE_USERS"
              className="w-full rounded-xl border border-ms-border-default bg-ms-bg-elevated px-4 py-3 text-sm outline-none placeholder:text-ms-text-tertiary focus:border-ms-accent"
            />
            <button
              type="submit"
              disabled={!canCreatePermission}
              className="inline-flex items-center gap-2 rounded-xl bg-ms-accent px-4 py-3 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover disabled:opacity-50 ms-transition"
            >
              <Plus size={16} />
              Create
            </button>
          </form>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
            <Users size={16} className="text-ms-accent" />
            Assign role permission
          </div>
          <form onSubmit={handleAssignRolePermission} className="space-y-3">
            <select
              value={selectedRoleId}
              onChange={(event) => setSelectedRoleId(event.target.value)}
              className="w-full rounded-xl border border-ms-border-default bg-ms-bg-elevated px-4 py-3 text-sm outline-none focus:border-ms-accent"
            >
              <option value="">Select role</option>
              {rolesQuery.data?.map((role) => (
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
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-5 shadow-sm"
        >
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
            <Shield size={16} className="text-ms-accent" />
            Current permissions
          </div>
          {allUsersPermissionsQuery.isLoading ? (
            <div className="flex items-center gap-3 py-8 text-ms-text-secondary">
              <Spinner className="size-4" />
              Loading permissions...
            </div>
          ) : (
            <div className="space-y-3">
              {allUsersPermissionsQuery.data?.map((userPermission) => (
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
        </motion.section>
      </div>
    </div>
  );
}
