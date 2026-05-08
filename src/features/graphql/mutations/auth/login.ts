import { requestGraphQL } from "@/src/services/graphql-client";

export const LOGIN_MUTATION = /* GraphQL */ `
  mutation Login($request: LoginRequest!) {
    login(request: $request) {
      success
      message
      data {
        accessToken
        refreshToken
      }
    }
  }
`;

export interface LoginRequestInput {
  email: string;
  password: string;
  deviceId: string;
}

export interface LoginResponse {
  login: {
    success: boolean;
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
    } | null;
  };
}

export async function requestLogin(request: LoginRequestInput) {
  return requestGraphQL<LoginResponse, { request: LoginRequestInput }>(
    LOGIN_MUTATION,
    { request },
  );
}
