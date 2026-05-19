import { requestGraphQL } from "@/src/services/graphql-client";
import { SongItem } from "./songs";
import { PlaylistItem } from "./playlists";

export interface GlobalSearchRequestInput {
  keyword: string;
  limit?: number;
}

export interface GlobalSearchUserItem {
  id: string;
  username: string;
  email: string;
}

export interface GlobalSearchResultData {
  songs: SongItem[];
  playlists: PlaylistItem[];
  users: GlobalSearchUserItem[];
}

export const GLOBAL_SEARCH_QUERY = /* GraphQL */ `
  query GlobalSearch($request: GlobalSearchRequest!) {
    globalSearch(request: $request) {
      data {
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
        playlists {
          id
          name
          songCount
          createdAt
          updatedAt
        }
        users {
          id
          username
          email
        }
      }
    }
  }
`;

export interface GlobalSearchResponse {
  globalSearch: {
    data: GlobalSearchResultData | null;
  };
}

export async function requestGlobalSearch(
  request: GlobalSearchRequestInput,
  token?: string,
) {
  return requestGraphQL<
    GlobalSearchResponse,
    { request: GlobalSearchRequestInput }
  >(GLOBAL_SEARCH_QUERY, { request }, token);
}
