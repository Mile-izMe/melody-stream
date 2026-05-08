import { requestGraphQL } from "@/src/services/graphql-client";

export const REFRESH_TOKEN_MUTATION = /* GraphQL */ `
  mutation RefreshToken($request: RefreshTokenRequest!) {
    refreshToken(request: $request) {
      success
      message
      data {
        accessToken
        refreshToken
      }
    }
  }
`;

export interface RefreshTokenRequestInput {
  refreshToken: string;
  deviceId: string;
}

export interface RefreshTokenResponse {
  refreshToken: {
    success: boolean;
    message: string;
    data: {
      accessToken: string;
      refreshToken: string;
    } | null;
  };
}

export async function requestRefreshToken(request: RefreshTokenRequestInput) {
  return requestGraphQL<
    RefreshTokenResponse,
    { request: RefreshTokenRequestInput }
  >(REFRESH_TOKEN_MUTATION, { request });
}
