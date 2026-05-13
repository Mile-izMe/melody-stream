import { requestGraphQL } from "@/src/services/graphql-client";
import type { PlaylistItem } from "@/src/features/graphql/queries/playlists";

export const ADD_SONG_TO_PLAYLIST_MUTATION = /* GraphQL */ `
  mutation AddSongToPlaylist($request: PlaylistAddSongRequest!) {
    addSongToPlaylist(request: $request) {
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

export interface AddSongToPlaylistRequestInput {
  playlistId: string;
  songId: string;
}

export interface AddSongToPlaylistResponse {
  addSongToPlaylist: {
    success: boolean;
    message: string;
    data: {
      playlist: PlaylistItem;
    } | null;
  };
}

export async function requestAddSongToPlaylist(
  request: AddSongToPlaylistRequestInput,
  token?: string,
) {
  return requestGraphQL<
    AddSongToPlaylistResponse,
    { request: AddSongToPlaylistRequestInput }
  >(ADD_SONG_TO_PLAYLIST_MUTATION, { request }, token);
}
