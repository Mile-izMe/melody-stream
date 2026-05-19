"use client";

import { FormEvent, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, BadgeCheck, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/use-auth-store";
import { hasRole } from "@/src/libs/auth-session";

import {
  requestRoles,
  requestAllUsersPermissions,
  requestCreatePermission,
  requestCreateRolePermission,
  requestPermissions,
  requestPermissionsByRole,
} from "@/src/features/graphql";
import AllPermissionsPanel from "@/src/components/permissions/AllPermissionsPanel";
import AssignRolePanel from "@/src/components/permissions/AssignRolePanel";
import UsersPermissionsPanel from "@/src/components/permissions/UsersPermissionsPanel";
import CreatePermissionModal from "@/src/components/permissions/CreatePermissionModal";
import { notify } from "@/src/libs/toast";

export default function PermissionsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [permissionName, setPermissionName] = useState("");
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>(
    [],
  );
  const [roleAssignedPermissionIds, setRoleAssignedPermissionIds] = useState<
    Record<string, string[]>
  >({});
  const [createdPermissions, setCreatedPermissions] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [activeTab, setActiveTab] = useState<"all" | "users">("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

  const permissionsQuery = useQuery({
    queryKey: ["permissions-all", user?.id ?? "guest"],
    queryFn: async () => {
      const response = await requestPermissions(token);
      return response.permissions.data?.permissions ?? [];
    },
    enabled: Boolean(token) && isAdmin,
  });

  const permissionsByRoleQuery = useQuery({
    queryKey: ["permissions-by-role", user?.id ?? "guest"],
    queryFn: async () => {
      const response = await requestPermissionsByRole(token);
      return response.permissionsByRole.data?.roles ?? [];
    },
    enabled: Boolean(token) && isAdmin,
  });

  const availablePermissions = useMemo(() => {
    const collected = new Map<string, { id: string; name: string }>();

    for (const permission of permissionsQuery.data ?? []) {
      collected.set(permission.id, {
        id: permission.id,
        name: permission.name,
      });
    }

    for (const permission of createdPermissions) {
      if (!collected.has(permission.id)) {
        collected.set(permission.id, permission);
      }
    }

    return Array.from(collected.values()).sort((left, right) =>
      left.name.localeCompare(right.name),
    );
  }, [createdPermissions, permissionsQuery.data]);

  const assignedPermissionIdsForSelectedRole = useMemo(() => {
    if (!selectedRoleId) {
      return [] as string[];
    }

    const selectedRoleSummary = (permissionsByRoleQuery.data ?? []).find(
      (summary) => summary.role.id === selectedRoleId,
    );
    const serverAssigned = (selectedRoleSummary?.permissions ?? []).map(
      (permission) => permission.id,
    );
    const localAssigned = roleAssignedPermissionIds[selectedRoleId] ?? [];

    return Array.from(new Set([...serverAssigned, ...localAssigned]));
  }, [permissionsByRoleQuery.data, roleAssignedPermissionIds, selectedRoleId]);

  const assignablePermissions = useMemo(() => {
    if (!selectedRoleId) {
      return availablePermissions;
    }

    const assigned = new Set(assignedPermissionIdsForSelectedRole);

    return availablePermissions.filter(
      (permission) => !assigned.has(permission.id),
    );
  }, [
    availablePermissions,
    assignedPermissionIdsForSelectedRole,
    selectedRoleId,
  ]);

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
      setSelectedPermissionIds([permission.id]);
      await queryClient.invalidateQueries({ queryKey: ["permissions-users"] });
      await queryClient.invalidateQueries({ queryKey: ["permissions-all"] });
      notify.success("Permission created", permission.name);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Unable to create permission";
      notify.error("Create failed", message);
    },
  });

  const createRolePermissionMutation = useMutation({
    mutationFn: async (request: {
      roleId: string;
      permissionIds: string[];
    }) => {
      if (!token) {
        throw new Error("Please sign in first");
      }

      const response = await requestCreateRolePermission(request, token);
      const rolePermissions =
        response.createRolePermission.data?.rolePermissions ?? [];

      if (!rolePermissions.length) {
        throw new Error("Unable to assign permission");
      }

      return rolePermissions;
    },
    onSuccess: async (rolePermissions) => {
      setSelectedPermissionIds([]);
      setRoleAssignedPermissionIds((current) => {
        const next: Record<string, string[]> = { ...current };

        for (const item of rolePermissions) {
          const currentIds = next[item.roleId] ?? [];
          if (!currentIds.includes(item.permissionId)) {
            next[item.roleId] = [...currentIds, item.permissionId];
          }
        }

        return next;
      });
      await queryClient.invalidateQueries({ queryKey: ["permissions-users"] });
      await queryClient.invalidateQueries({ queryKey: ["permissions-roles"] });
      await queryClient.invalidateQueries({ queryKey: ["permissions-all"] });
      await queryClient.invalidateQueries({
        queryKey: ["permissions-by-role"],
      });

      const first = rolePermissions[0];
      const total = rolePermissions.length;

      notify.success(
        "Permission assigned",
        `${first.permission.name} -> ${first.role.name}${
          total > 1 ? ` (+${total - 1})` : ""
        }`,
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

    if (!selectedRoleId || selectedPermissionIds.length === 0) {
      notify.warning("Select values", "Choose a role and a permission.");
      return;
    }

    createRolePermissionMutation.mutate({
      roleId: selectedRoleId,
      permissionIds: selectedPermissionIds,
    });
  };

  const canCreatePermission =
    permissionName.trim().length > 0 && !createPermissionMutation.isPending;
  const canAssignPermission =
    Boolean(selectedRoleId) &&
    selectedPermissionIds.length > 0 &&
    !createRolePermissionMutation.isPending;

  const handleTogglePermissionId = (permissionId: string) => {
    setSelectedPermissionIds((current) => {
      if (current.includes(permissionId)) {
        return current.filter((id) => id !== permissionId);
      }

      return [...current, permissionId];
    });
  };

  const handleRoleChange = (roleId: string) => {
    setSelectedRoleId(roleId);
    setSelectedPermissionIds([]);
  };

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

      <div className="px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab("all")}
            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold ms-transition ${
              activeTab === "all"
                ? "bg-ms-accent text-ms-accent-text"
                : "bg-ms-bg-elevated text-ms-text-primary"
            }`}
          >
            All permissions
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold ms-transition ${
              activeTab === "users"
                ? "bg-ms-accent text-ms-accent-text"
                : "bg-ms-bg-elevated text-ms-text-primary"
            }`}
          >
            Users & roles
          </button>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-3">
          {activeTab === "all" ? (
            <AllPermissionsPanel
              availablePermissions={availablePermissions}
              onOpenCreateModal={() => setIsCreateModalOpen(true)}
            />
          ) : (
            <>
              <AssignRolePanel
                roles={rolesQuery.data}
                selectedRoleId={selectedRoleId}
                setSelectedRoleId={handleRoleChange}
                selectedPermissionIds={selectedPermissionIds}
                onTogglePermissionId={handleTogglePermissionId}
                availablePermissions={assignablePermissions}
                onSubmit={handleAssignRolePermission}
                canAssignPermission={canAssignPermission}
              />

              <UsersPermissionsPanel
                roleSummaries={permissionsByRoleQuery.data}
                isLoading={
                  allUsersPermissionsQuery.isLoading ||
                  permissionsByRoleQuery.isLoading
                }
              />
            </>
          )}
        </div>
      </div>

      <CreatePermissionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        permissionName={permissionName}
        setPermissionName={(v) => setPermissionName(v)}
        canCreatePermission={canCreatePermission}
        onSubmit={(e) => {
          handleCreatePermission(e);
          setIsCreateModalOpen(false);
        }}
      />
    </div>
  );
}
