"use client";
import { Spinner } from "@/src/components/ui/spinner";
import {
  requestSongs,
  type SongItem,
} from "@/src/features/graphql/queries/songs";
// HLS and audio now handled by PlayerContainer
import { useAuth } from "@/src/stores/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Music, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import {} from "react";
import { usePlayerStore } from "@/src/stores/usePlayerStore";
import TrackRow from "@/src/components/TrackRow";
import { useSongsWebSocket } from "@/src/hooks/use-songs-websocket";
import { notify } from "@/src/libs/toast";

/* ─── Home page — unified experience for everyone ─── */
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const activeSong = usePlayerStore((s) => s.activeSong);
  const setActiveSong = usePlayerStore((s) => s.setActiveSong);
  const isPlaying = usePlayerStore((s) => s.playing);
  const setIsPlaying = usePlayerStore((s) => s.setPlaying);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const setDuration = usePlayerStore((s) => s.setDuration);

  /* Listen for real-time songs updates via WebSocket */
  useSongsWebSocket();

  /* Fetch songs — public, no auth required */
  const songsQuery = useQuery({
    queryKey: ["songs", user?.id ?? "public"],
    queryFn: async () => {
      const response = await requestSongs(
        { filters: { pageNumber: 1, limit: 20 } },
        user?.token,
      );
      return response.songs.data;
    },
  });

  /* Player handled by PlayerContainer mounted in Providers; page only triggers store actions */

  const handleSelectSong = (song: SongItem) => {
    if (activeSong?.id === song.id) {
      // toggle play state handled by PlayerContainer watching store
      setIsPlaying(!isPlaying);
      return;
    }
    setCurrentTime(0);
    setDuration(0);
    setActiveSong(song);
    setIsPlaying(true);
  };

  // Player controls handled by PlayerContainer

  const handleEditSong = (songId: string) => {
    notify.info("Edit song", `Opening editor for song: ${songId}`);
    // TODO: Implement edit flow (navigate to editor or show modal)
  };

  const songs = songsQuery.data?.data ?? [];
  const hasSongs = songs.length > 0;

  return (
    <div className="flex flex-col flex-1 pb-28">
      {/* Page header */}
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-accent mb-2">
              Discover
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {user ? `Welcome back, ${user.username}` : "Explore Music"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {songsQuery.isFetching && (
              <span className="inline-flex items-center gap-2 text-xs text-ms-text-tertiary">
                <Spinner className="size-3" />
                Syncing...
              </span>
            )}
            {user && (
              <button
                type="button"
                onClick={() => router.push("/upload")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ms-accent text-ms-accent-text font-semibold text-sm rounded-lg hover:bg-ms-accent-hover active:scale-[0.98] ms-transition"
              >
                <Upload size={15} />
                Upload
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sign-in prompt for guests — subtle, non-blocking */}
      {!user && (
        <div className="px-8 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-ms-accent-subtle border border-ms-accent/10">
            <span className="text-sm text-ms-text-secondary">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-ms-accent hover:text-ms-accent-hover ms-transition"
              >
                Sign in
              </button>{" "}
              to upload tracks, save favorites, and build your library.
            </span>
          </div>
        </div>
      )}

      {/* Trending tracks */}
      <div className="px-8 pt-6 pb-2">
        <h2 className="text-lg font-semibold tracking-tight mb-4">
          Trending Tracks
        </h2>
      </div>

      <div className="px-8 flex-1">
        {songsQuery.isLoading ? (
          <div className="flex items-center gap-3 text-ms-text-secondary py-12">
            <Spinner className="size-5" />
            Loading tracks...
          </div>
        ) : hasSongs ? (
          <div className="rounded-xl border border-ms-border-subtle overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_5rem] sm:grid-cols-[2.5rem_2fr_1fr_5rem] gap-4 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ms-text-tertiary border-b border-ms-border-subtle">
              <span>#</span>
              <span>Title</span>
              <span className="hidden sm:block">Artist</span>
              <span className="text-right">Time</span>
            </div>
            {songs.map((song, idx) => (
              <TrackRow
                key={song.id}
                song={song}
                index={idx}
                isActive={activeSong?.id === song.id}
                isPlaying={activeSong?.id === song.id && isPlaying}
                onSelect={() => handleSelectSong(song)}
                onEdit={handleEditSong}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="size-16 rounded-2xl bg-ms-accent-subtle flex items-center justify-center mb-5">
              <Music size={28} className="text-ms-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tracks yet</h3>
            <p className="text-sm text-ms-text-secondary max-w-sm mb-6">
              {user
                ? "Upload your first track and it will appear here once HLS processing is complete."
                : "No music has been uploaded yet. Check back soon, or sign in to be the first to upload."}
            </p>
            {user && (
              <button
                type="button"
                onClick={() => router.push("/upload")}
                className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-ms-accent text-ms-accent-text font-semibold text-sm rounded-lg hover:bg-ms-accent-hover active:scale-[0.98] ms-transition"
              >
                <Upload size={15} />
                Upload Your First Track
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* PlayerBar moved to Providers to persist across navigation */}
    </div>
  );
}
