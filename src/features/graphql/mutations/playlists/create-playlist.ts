import { requestGraphQL } from "@/src/services/graphql-client";
import type { PlaylistItem } from "@/src/features/graphql/queries/playlists";

export const CREATE_PLAYLIST_MUTATION = /* GraphQL */ `
  mutation CreatePlaylist($request: PlaylistCreateRequest!) {
    createPlaylist(request: $request) {
      success
      message
      data {
        playlist {
          id
          name
          songCount
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export interface CreatePlaylistRequestInput {
  name: string;
}

export interface CreatePlaylistResponse {
  createPlaylist: {
    success: boolean;
    message: string;
    data: {
      playlist: PlaylistItem;
    } | null;
  };
}

export async function requestCreatePlaylist(
  request: CreatePlaylistRequestInput,
  token?: string,
) {
  return requestGraphQL<
    CreatePlaylistResponse,
    { request: CreatePlaylistRequestInput }
  >(CREATE_PLAYLIST_MUTATION, { request }, token);
}
