"use client";

import { useDeferredValue, useMemo, useState } from "react";
import {
  Search as SearchIcon,
  Music,
  Library,
  Users,
  DiscAlbum,
  UserCircle2,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { requestGlobalSearch } from "@/src/features/graphql/queries/global-search";
import { useAuth } from "@/src/stores/use-auth-store";
import { Spinner } from "@/src/components/ui/spinner";
import Image from "next/image";
import { useSongsWebSocket } from "@/src/hooks/use-songs-websocket";
import { formatTime } from "@/src/libs/formatTime";

const EMPTY_RESULTS = {
  songs: [],
  playlists: [],
  users: [],
};

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const normalizedQuery = query.trim();
  const deferredQuery = useDeferredValue(normalizedQuery);

  /* Listen for real-time songs updates via WebSocket */
  useSongsWebSocket();

  const globalSearchQuery = useQuery({
    queryKey: ["global-search", deferredQuery, user?.id ?? "public"],
    queryFn: async () => {
      const response = await requestGlobalSearch(
        {
          keyword: deferredQuery,
          limit: 6,
        },
        user?.token,
      );

      return response.globalSearch.data ?? EMPTY_RESULTS;
    },
    enabled: deferredQuery.length > 0,
  });

  const results = globalSearchQuery.data ?? EMPTY_RESULTS;
  const totalResults = useMemo(
    () =>
      results.songs.length + results.playlists.length + results.users.length,
    [results.playlists.length, results.songs.length, results.users.length],
  );

  const hasResults = totalResults > 0;

  return (
    <div className="flex flex-col flex-1 pb-28">
      {/* Search header */}
      <div className="px-8 pt-8 pb-6">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Search</h1>
          <p className="text-sm text-ms-text-secondary">
            Search across songs, playlists, and users in one place.
          </p>
        </div>

        <div className="relative mt-5 max-w-2xl">
          <SearchIcon
            className="absolute left-4 top-1/2 -translate-y-1/2 text-ms-text-tertiary"
            size={18}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search songs, playlists, or users"
            className="w-full rounded-xl border border-ms-border-default bg-ms-bg-elevated py-3 pl-11 pr-4 text-sm text-ms-text-primary outline-none placeholder:text-ms-text-tertiary ms-transition focus:border-ms-accent"
            autoFocus
          />
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ms-text-tertiary">
          <span className="rounded-full border border-ms-border-subtle px-2.5 py-1">
            Songs
          </span>
          <span className="rounded-full border border-ms-border-subtle px-2.5 py-1">
            Playlists
          </span>
          <span className="rounded-full border border-ms-border-subtle px-2.5 py-1">
            Users
          </span>
          {deferredQuery ? (
            <span className="ml-0 sm:ml-2 text-ms-text-secondary normal-case tracking-normal uppercase-none">
              {globalSearchQuery.isFetching
                ? "Searching…"
                : `${totalResults} results`}
            </span>
          ) : null}
        </div>
      </div>

      {/* Results */}
      <div className="px-8 flex-1">
        {!normalizedQuery ? (
          <div className="grid min-h-112 place-items-center">
            <div className="max-w-xl rounded-3xl border border-ms-border-subtle bg-ms-bg-elevated/60 px-8 py-10 text-center shadow-sm">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-ms-accent/10 text-ms-accent">
                <SearchIcon size={26} />
              </div>
              <h2 className="text-xl font-semibold tracking-tight text-ms-text-primary">
                Global search
              </h2>
              <p className="mt-2 text-sm leading-6 text-ms-text-secondary">
                Find songs, playlists, and users with one search box.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-ms-text-tertiary">
                <span className="rounded-full border border-ms-border-subtle px-3 py-1.5">
                  Song titles
                </span>
                <span className="rounded-full border border-ms-border-subtle px-3 py-1.5">
                  Playlist names
                </span>
                <span className="rounded-full border border-ms-border-subtle px-3 py-1.5">
                  Usernames
                </span>
                <span className="rounded-full border border-ms-border-subtle px-3 py-1.5">
                  Emails
                </span>
              </div>
            </div>
          </div>
        ) : globalSearchQuery.isLoading ? (
          <div className="flex items-center gap-3 py-12 text-ms-text-secondary">
            <Spinner className="size-5" />
            Searching everything...
          </div>
        ) : !hasResults ? (
          <div className="grid min-h-80 place-items-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated text-ms-text-tertiary">
                <SearchIcon size={24} />
              </div>
              <p className="text-sm text-ms-text-secondary">
                No results found for &ldquo;{normalizedQuery}&rdquo;
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,1fr)]">
            <section className="overflow-hidden rounded-2xl border border-ms-border-subtle bg-ms-bg-raised shadow-sm">
              <div className="flex items-center justify-between gap-3 border-b border-ms-border-subtle px-5 py-4">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-ms-accent/10 text-ms-accent">
                    <Music size={16} />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-ms-text-primary">
                      Songs
                    </h2>
                    <p className="text-xs text-ms-text-tertiary">
                      Audio matches
                    </p>
                  </div>
                </div>
                <span className="rounded-full border border-ms-border-subtle px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
                  {results.songs.length}
                </span>
              </div>

              <div>
                {results.songs.length > 0 ? (
                  results.songs.map((song) => (
                    <div
                      key={song.id}
                      className="grid grid-cols-[3rem_1fr_5rem] items-center gap-4 border-b border-ms-border-subtle px-5 py-3 last:border-b-0 hover:bg-ms-bg-elevated ms-transition"
                    >
                      {song.thumbnailUrl ? (
                        <Image
                          src={song.thumbnailUrl}
                          alt={song.title}
                          width={48}
                          height={48}
                          className="size-12 rounded-xl object-cover border border-ms-border-subtle"
                        />
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-xl border border-ms-border-subtle bg-ms-bg-elevated text-ms-text-tertiary">
                          <Music size={18} />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-ms-text-primary">
                          {song.title}
                        </p>
                        <p className="truncate text-xs text-ms-text-secondary">
                          {song.artist}
                        </p>
                      </div>
                      <div className="text-right text-xs text-ms-text-tertiary tabular-nums">
                        {song.duration ? formatTime(song.duration) : "--:--"}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-5 py-8 text-sm text-ms-text-secondary">
                    No songs matched this search.
                  </div>
                )}
              </div>
            </section>

            <div className="space-y-4">
              <section className="overflow-hidden rounded-2xl border border-ms-border-subtle bg-ms-bg-raised shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-ms-border-subtle px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-ms-accent/10 text-ms-accent">
                      <DiscAlbum size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-ms-text-primary">
                        Playlists
                      </h2>
                      <p className="text-xs text-ms-text-tertiary">
                        Collections
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full border border-ms-border-subtle px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
                    {results.playlists.length}
                  </span>
                </div>

                <div className="divide-y divide-ms-border-subtle">
                  {results.playlists.length > 0 ? (
                    results.playlists.map((playlist) => (
                      <div
                        key={playlist.id}
                        className="flex items-center gap-3 px-5 py-3"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-ms-border-subtle bg-ms-bg-elevated text-ms-text-tertiary">
                          <Library size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ms-text-primary">
                            {playlist.name}
                          </p>
                          <p className="text-xs text-ms-text-secondary">
                            {playlist.songCount} songs
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-sm text-ms-text-secondary">
                      No playlists matched this search.
                    </div>
                  )}
                </div>
              </section>

              <section className="overflow-hidden rounded-2xl border border-ms-border-subtle bg-ms-bg-raised shadow-sm">
                <div className="flex items-center justify-between gap-3 border-b border-ms-border-subtle px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-ms-accent/10 text-ms-accent">
                      <Users size={16} />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-ms-text-primary">
                        Users
                      </h2>
                      <p className="text-xs text-ms-text-tertiary">Accounts</p>
                    </div>
                  </div>
                  <span className="rounded-full border border-ms-border-subtle px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
                    {results.users.length}
                  </span>
                </div>

                <div className="divide-y divide-ms-border-subtle">
                  {results.users.length > 0 ? (
                    results.users.map((resultUser) => (
                      <div
                        key={resultUser.id}
                        className="flex items-center gap-3 px-5 py-3"
                      >
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ms-accent/10 text-xs font-bold uppercase text-ms-accent">
                          {resultUser.username.charAt(0)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-ms-text-primary">
                            {resultUser.username}
                          </p>
                          <p className="truncate text-xs text-ms-text-secondary">
                            {resultUser.email}
                          </p>
                        </div>
                        <UserCircle2
                          size={16}
                          className="shrink-0 text-ms-text-tertiary"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-8 text-sm text-ms-text-secondary">
                      No users matched this search.
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
