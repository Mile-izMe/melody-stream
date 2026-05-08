import { requestGraphQL } from "@/src/services/graphql-client";

export const REGISTER_MUTATION = /* GraphQL */ `
  mutation Register($request: RegisterRequest!) {
    register(request: $request) {
      success
      message
      data {
        id
        username
        email
      }
    }
  }
`;

export interface RegisterRequestInput {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  register: {
    success: boolean;
    message: string;
    data: {
      id: string;
      username: string;
      email: string;
    } | null;
  };
}

export async function requestRegister(request: RegisterRequestInput) {
  return requestGraphQL<RegisterResponse, { request: RegisterRequestInput }>(
    REGISTER_MUTATION,
    { request },
  );
}
