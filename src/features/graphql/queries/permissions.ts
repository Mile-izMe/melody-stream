import { requestGraphQL } from "@/src/services/graphql-client";

export interface RoleItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface PermissionItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPermissionInfo {
  userId: string;
  username: string;
  email: string;
  permissions: PermissionItem[];
}

export const ROLES_QUERY = /* GraphQL */ `
  query Roles {
    roles {
      data {
        roles {
          id
          name
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const ALL_USERS_PERMISSIONS_QUERY = /* GraphQL */ `
  query AllUsersPermissions {
    allUsersPermissions {
      data {
        usersPermissions {
          userId
          username
          email
          permissions {
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

export interface RolesResponse {
  roles: {
    data: {
      roles: RoleItem[];
    } | null;
  };
}

export interface AllUsersPermissionsResponse {
  allUsersPermissions: {
    data: {
      usersPermissions: UserPermissionInfo[];
    } | null;
  };
}

export async function requestRoles(token?: string) {
  return requestGraphQL<RolesResponse>(ROLES_QUERY, undefined, token);
}

export async function requestAllUsersPermissions(token?: string) {
  return requestGraphQL<AllUsersPermissionsResponse>(
    ALL_USERS_PERMISSIONS_QUERY,
    undefined,
    token,
  );
}
