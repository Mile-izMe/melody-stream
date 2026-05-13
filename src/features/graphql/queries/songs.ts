import { requestGraphQL } from "@/src/services/graphql-client";

export const SONGS_QUERY = /* GraphQL */ `
  query Songs($request: SongsRequest!) {
    songs(request: $request) {
      data {
        count
        cursor
        data {
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

export interface SongsRequestSortInput {
  by: "title" | "createdAt" | "updatedAt";
  order: "ASC" | "DESC";
}

export interface SongsRequestPaginationFiltersInput {
  limit?: number;
  pageNumber?: number;
  cursor?: string;
  search?: string;
  sorts?: SongsRequestSortInput[];
}

export interface SongsRequestInput {
  filters: SongsRequestPaginationFiltersInput;
}

export interface SongItem {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string | null;
  duration?: number | null;
  createdAt: string;
  updatedAt: string;
  isEditable?: boolean;
}

export interface SongsResponse {
  songs: {
    data: {
      count: number;
      cursor?: string;
      data: SongItem[];
    };
  };
}

export async function requestSongs(request: SongsRequestInput, token?: string) {
  return requestGraphQL<SongsResponse, { request: SongsRequestInput }>(
    SONGS_QUERY,
    { request },
    token,
  );
}
