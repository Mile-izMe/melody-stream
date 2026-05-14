import { requestGraphQL } from "@/src/services/graphql-client";

export interface CreatePermissionRequestInput {
  name: string;
}

export interface CreateRolePermissionRequestInput {
  roleId?: string;
  roleIds?: string[];
  permissionId?: string;
  permissionIds?: string[];
}

export interface MutationPermissionItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MutationRoleItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface MutationRolePermissionItem {
  roleId: string;
  permissionId: string;
  role: MutationRoleItem;
  permission: MutationPermissionItem;
}

export const CREATE_PERMISSION_MUTATION = /* GraphQL */ `
  mutation CreatePermission($request: CreatePermissionRequest!) {
    createPermission(request: $request) {
      success
      message
      data {
        permission {
          id
          name
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const CREATE_ROLE_PERMISSION_MUTATION = /* GraphQL */ `
  mutation CreateRolePermission($request: CreateRolePermissionRequest!) {
    createRolePermission(request: $request) {
      success
      message
      data {
        rolePermissions {
          roleId
          permissionId
          role {
            id
            name
            createdAt
            updatedAt
          }
          permission {
            id
            name
            createdAt
            updatedAt
          }
        }
      }
    }
  }
`;

export interface CreatePermissionResponse {
  createPermission: {
    success: boolean;
    message: string;
    data: {
      permission: MutationPermissionItem;
    } | null;
  };
}

export interface CreateRolePermissionResponse {
  createRolePermission: {
    success: boolean;
    message: string;
    data: {
      rolePermissions: MutationRolePermissionItem[];
    } | null;
  };
}

export async function requestCreatePermission(
  request: CreatePermissionRequestInput,
  token?: string,
) {
  return requestGraphQL<
    CreatePermissionResponse,
    { request: CreatePermissionRequestInput }
  >(CREATE_PERMISSION_MUTATION, { request }, token);
}

export async function requestCreateRolePermission(
  request: CreateRolePermissionRequestInput,
  token?: string,
) {
  const normalizedRoleIds =
    request.roleIds ?? (request.roleId ? [request.roleId] : []);
  const normalizedPermissionIds =
    request.permissionIds ??
    (request.permissionId ? [request.permissionId] : []);

  return requestGraphQL<
    CreateRolePermissionResponse,
    {
      request: {
        roleIds: string[];
        permissionIds: string[];
      };
    }
  >(
    CREATE_ROLE_PERMISSION_MUTATION,
    {
      request: {
        roleIds: normalizedRoleIds,
        permissionIds: normalizedPermissionIds,
      },
    },
    token,
  );
}
