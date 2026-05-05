type ServiceName = "graphql" | "minio";

const DEFAULT_ENDPOINTS: Record<ServiceName, string> = {
  graphql: "http://localhost:3001/graphql",
  minio: "http://localhost:9000",
};

const ENV_KEYS: Record<ServiceName, string> = {
  graphql: "NEXT_PUBLIC_GRAPHQL_ENDPOINT",
  minio: "NEXT_PUBLIC_MINIO_ENDPOINT",
};

export function getServiceEndpoint(service: ServiceName) {
  const envKey = ENV_KEYS[service] as keyof NodeJS.ProcessEnv;

  return process.env[envKey] ?? DEFAULT_ENDPOINTS[service];
}
