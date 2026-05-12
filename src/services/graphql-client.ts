import {
  GraphQLClient,
  type RequestDocument,
  type Variables,
} from "graphql-request";
import { getServiceEndpoint } from "@/src/libs/constants";

const GRAPHQL_ENDPOINT = getServiceEndpoint("graphql");

export const graphqlClient = new GraphQLClient(GRAPHQL_ENDPOINT, {
  credentials: "include",
});

export function createGraphQLClient(token?: string) {
  return new GraphQLClient(GRAPHQL_ENDPOINT, {
    credentials: "include",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}

function getGraphQLErrorMessage(error: unknown) {
  if (typeof error !== "object" || error === null) return null;

  const graphQLError = error as {
    response?: {
      errors?: Array<{ message?: string }>;
      message?: string;
    };
    message?: string;
  };

  return (
    graphQLError.response?.errors?.[0]?.message ??
    graphQLError.response?.message ??
    graphQLError.message ??
    null
  );
}

export async function requestGraphQL<
  TData,
  TVariables extends Variables = Variables,
>(query: RequestDocument, variables?: TVariables, token?: string) {
  const client = token ? createGraphQLClient(token) : graphqlClient;

  try {
    if (variables) {
      return await client.request<TData>(query, variables as never);
    }

    return await client.request<TData>(query);
  } catch (error) {
    throw new Error(getGraphQLErrorMessage(error) ?? "Something went wrong");
  }
}
