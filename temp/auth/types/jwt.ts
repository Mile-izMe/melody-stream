export interface JwtPayload {
  sub: string;         // User ID
  roles: string[];     // Array of roles (RBAC)
  permissions: string[]; // Array of permissions (Fine-grained RBAC)
  deviceId: string;    // Handle Rotation
}