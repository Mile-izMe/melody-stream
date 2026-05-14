import { requestGraphQL } from "@/src/services/graphql-client";

export const MY_PLAYLISTS_QUERY = /* GraphQL */ `
  query MyPlaylists($request: GetMyPlaylistsRequest!) {
    myPlaylists(request: $request) {
      data {
        count
        cursor
        data {
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

export const MY_PLAYLISTS_WITH_SONGS_QUERY = /* GraphQL */ `
  query MyPlaylistsWithSongs($request: GetMyPlaylistsRequest!) {
    myPlaylists(request: $request) {
      data {
        count
        cursor
        data {
          id
          name
          songCount
          createdAt
          updatedAt
          songs {
            id
          }
        }
      }
    }
  }
`;

export interface PlaylistsRequestSortInput {
  by: "name" | "createdAt" | "updatedAt";
  order: "ASC" | "DESC";
}

export interface PlaylistsRequestPaginationFiltersInput {
  limit?: number;
  pageNumber?: number;
  cursor?: string;
  search?: string;
  sorts?: PlaylistsRequestSortInput[];
}

export interface GetMyPlaylistsRequestInput {
  filters: PlaylistsRequestPaginationFiltersInput;
}

export interface PlaylistItem {
  id: string;
  name: string;
  songCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyPlaylistsResponse {
  myPlaylists: {
    data: {
      count: number;
      cursor?: string;
      data: PlaylistItem[];
    };
  };
}

export interface PlaylistItemWithSongs extends PlaylistItem {
  songs: Array<{ id: string }>;
}

export interface MyPlaylistsWithSongsResponse {
  myPlaylists: {
    data: {
      count: number;
      cursor?: string;
      data: PlaylistItemWithSongs[];
    };
  };
}

export async function requestMyPlaylists(
  request: GetMyPlaylistsRequestInput,
  token?: string,
) {
  return requestGraphQL<
    MyPlaylistsResponse,
    { request: GetMyPlaylistsRequestInput }
  >(MY_PLAYLISTS_QUERY, { request }, token);
}

export async function requestMyPlaylistsWithSongs(
  request: GetMyPlaylistsRequestInput,
  token?: string,
) {
  return requestGraphQL<
    MyPlaylistsWithSongsResponse,
    { request: GetMyPlaylistsRequestInput }
  >(MY_PLAYLISTS_WITH_SONGS_QUERY, { request }, token);
}

export const PLAYLIST_SONGS_QUERY = /* GraphQL */ `
  query PlaylistSongs($request: GetPlaylistSongsRequest!) {
    playlistSongs(request: $request) {
      data {
        playlist {
          id
          name
          songCount
          createdAt
          updatedAt
        }
        songs {
          id
          title
          artist
          audioUrl
          thumbnailUrl
          duration
          createdAt
          updatedAt
          isEditable
        }
      }
    }
  }
`;

export interface GetPlaylistSongsRequestInput {
  playlistId: string;
}

export interface PlaylistSongsData {
  playlist: PlaylistItem;
  songs: Array<{
    id: string;
    title: string;
    artist: string;
    audioUrl: string;
    thumbnailUrl?: string | null;
    duration?: number | null;
    createdAt: string;
    updatedAt: string;
    isEditable: boolean;
  }>;
}

export interface PlaylistSongsResponse {
  playlistSongs: {
    data?: PlaylistSongsData | null;
  };
}

export async function requestPlaylistSongs(
  request: GetPlaylistSongsRequestInput,
  token?: string,
) {
  return requestGraphQL<
    PlaylistSongsResponse,
    { request: GetPlaylistSongsRequestInput }
  >(PLAYLIST_SONGS_QUERY, { request }, token);
}
