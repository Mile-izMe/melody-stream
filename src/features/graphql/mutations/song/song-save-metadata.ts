import { requestGraphQL } from "@/src/services/graphql-client";

export const SONG_SAVE_METADATA_MUTATION = /* GraphQL */ `
  mutation SongSaveMetadata($request: SongSaveMetadataRequest!) {
    songSaveMetadata(request: $request) {
      data {
        song {
          id
          title
          artist
          audioUrl
          thumbnailUrl
          duration
        }
      }
    }
  }
`;

export interface SongSaveMetadataRequestInput {
  userId: string;
  key: string;
  title: string;
  artist: string;
  thumbnailUrl?: string;
  duration?: number;
}

export interface SongSaveMetadataResponse {
  songSaveMetadata: {
    data: {
      song: {
        id: string;
        title: string;
        artist: string;
        audioUrl: string;
        thumbnailUrl?: string | null;
        duration?: number | null;
      };
    };
  };
}

export async function requestSongSaveMetadata(
  request: SongSaveMetadataRequestInput,
  token?: string,
) {
  return requestGraphQL<
    SongSaveMetadataResponse,
    { request: SongSaveMetadataRequestInput }
  >(SONG_SAVE_METADATA_MUTATION, { request }, token);
}
