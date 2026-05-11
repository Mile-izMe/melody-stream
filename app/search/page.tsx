"use client";

import { useState } from "react";
import { Search as SearchIcon, Music } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { requestSongs } from "@/src/features/graphql/queries/songs";
import { useAuth } from "@/src/stores/use-auth-store";
import { Spinner } from "@/src/components/ui/spinner";
import Image from "next/image";
import { useSongsWebSocket } from "@/src/hooks/use-songs-websocket";

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");

  /* Listen for real-time songs updates via WebSocket */
  useSongsWebSocket();

  const songsQuery = useQuery({
    queryKey: ["songs-search", query, user?.id ?? "public"],
    queryFn: async () => {
      const response = await requestSongs(
        {
          filters: {
            pageNumber: 1,
            limit: 20,
            ...(query ? { search: query } : {}),
          },
        },
        user?.token,
      );
      return response.songs.data;
    },
    enabled: query.length > 0,
  });

  const songs = songsQuery.data?.data ?? [];

  return (
    <div className="flex flex-col flex-1 pb-28">
      {/* Search header */}
      <div className="px-8 pt-8 pb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-5">Search</h1>
        <div className="relative max-w-lg">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ms-text-tertiary"
            size={18}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full pl-11 pr-4 py-3 bg-ms-bg-elevated border border-ms-border-default focus:border-ms-accent rounded-xl outline-none text-sm text-ms-text-primary placeholder:text-ms-text-tertiary ms-transition"
            autoFocus
          />
        </div>
      </div>

      {/* Results */}
      <div className="px-8 flex-1">
        {!query ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="size-14 rounded-2xl bg-ms-bg-elevated flex items-center justify-center mb-4">
              <SearchIcon size={24} className="text-ms-text-tertiary" />
            </div>
            <p className="text-sm text-ms-text-secondary">
              Search for songs, artists, or albums
            </p>
          </div>
        ) : songsQuery.isLoading ? (
          <div className="flex items-center gap-3 text-ms-text-secondary py-12">
            <Spinner className="size-5" />
            Searching...
          </div>
        ) : songs.length > 0 ? (
          <div className="rounded-xl border border-ms-border-subtle overflow-hidden">
            <div className="grid grid-cols-[2rem_1fr_5rem] sm:grid-cols-[2.5rem_2fr_1fr_5rem] gap-4 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ms-text-tertiary border-b border-ms-border-subtle">
              <span>#</span>
              <span>Title</span>
              <span className="hidden sm:block">Artist</span>
              <span className="text-right">Time</span>
            </div>
            {songs.map((song, idx) => (
              <div
                key={song.id}
                className="grid grid-cols-[2rem_1fr_5rem] sm:grid-cols-[2.5rem_2fr_1fr_5rem] gap-4 px-5 py-3 items-center hover:bg-ms-bg-elevated ms-transition group cursor-pointer"
              >
                <span className="text-sm text-ms-text-tertiary tabular-nums text-center">
                  {idx + 1}
                </span>
                <div className="flex items-center gap-3 min-w-0">
                  {song.thumbnailUrl ? (
                    <Image
                      src={song.thumbnailUrl}
                      alt={song.title}
                      width={40}
                      height={40}
                      className="size-10 rounded-md object-cover border border-ms-border-subtle shrink-0"
                    />
                  ) : (
                    <div className="size-10 rounded-md bg-ms-bg-elevated border border-ms-border-subtle flex items-center justify-center shrink-0">
                      <Music size={16} className="text-ms-text-tertiary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="block truncate text-sm font-medium text-ms-text-primary">
                      {song.title}
                    </span>
                    <span className="block sm:hidden truncate text-xs text-ms-text-secondary">
                      {song.artist}
                    </span>
                  </div>
                </div>
                <span className="hidden sm:block text-sm text-ms-text-secondary truncate">
                  {song.artist}
                </span>
                <span className="text-right text-sm text-ms-text-tertiary tabular-nums">
                  {song.duration
                    ? `${Math.floor(song.duration / 60)}:${Math.floor(
                        song.duration % 60,
                      )
                        .toString()
                        .padStart(2, "0")}`
                    : "--:--"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm text-ms-text-secondary">
              No results found for &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
