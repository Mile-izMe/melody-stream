export interface User {
  id: string;
  username: string;
  email: string;
  token: string;
  refreshToken?: string;
  deviceId?: string;
  provider?: string;
  roles?: string[];
  permissions?: string[];
}
