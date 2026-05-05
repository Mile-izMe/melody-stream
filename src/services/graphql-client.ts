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

export async function requestGraphQL<
  TData,
  TVariables extends Variables = Variables,
>(query: RequestDocument, variables?: TVariables, token?: string) {
  const client = token ? createGraphQLClient(token) : graphqlClient;

  if (variables) {
    return client.request<TData>(query, variables as never);
  }

  return client.request<TData>(query);
}
