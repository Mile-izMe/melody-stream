import { requestGraphQL } from "@/src/services/graphql-client";

export const SONG_PRESIGN_URL_MUTATION = /* GraphQL */ `
  mutation SongPresignUrl($request: SongPresignUrlRequest!) {
    songPresignUrl(request: $request) {
      data {
        key
        url
      }
    }
  }
`;

export interface SongPresignUrlRequestInput {
  contentType: string;
  fileName?: string;
}

export interface SongPresignUrlResponse {
  songPresignUrl: {
    data: {
      key: string;
      url: string;
    };
  };
}

export async function requestSongPresignUrl(
  request: SongPresignUrlRequestInput,
  token?: string,
) {
  return requestGraphQL<
    SongPresignUrlResponse,
    { request: SongPresignUrlRequestInput }
  >(SONG_PRESIGN_URL_MUTATION, { request }, token);
}
