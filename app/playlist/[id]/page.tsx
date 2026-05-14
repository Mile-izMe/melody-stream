/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Spinner } from "@/src/components/ui/spinner";
import { requestPlaylistSongs } from "@/src/features/graphql";
import { useAuth } from "@/src/stores/use-auth-store";
import { usePlayerStore } from "@/src/stores/usePlayerStore";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Music2,
  Pause,
  Play,
  Shuffle,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function PlaylistDetailPage() {
  const params = useParams();
  const router = useRouter();
  const playlistId = params.id as string;
  const { user } = useAuth();
  const token = user?.token;

  const {
    activeSong,
    playing,
    setActiveSong,
    setPlaying,
    setQueue,
    setCurrentIndex,
    playNext,
    playPrevious,
    shuffleMode,
    toggleShuffleMode,
  } = usePlayerStore();

  const playlistQuery = useQuery({
    queryKey: ["playlist-songs", playlistId],
    queryFn: async () => {
      const response = await requestPlaylistSongs(
        {
          playlistId,
        },
        token,
      );
      return response.playlistSongs.data;
    },
    enabled: Boolean(token) && Boolean(playlistId),
  });

  const playlistData = playlistQuery.data;
  const songs = playlistData?.songs ?? [];

  const handleSongClick = (song: any, index: number) => {
    setQueue(songs);
    setCurrentIndex(index);
    setActiveSong(song);
    setPlaying(true);
  };

  const handlePlayNext = () => {
    playNext();
  };

  const handlePlayPrevious = () => {
    playPrevious();
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <p className="text-ms-text-secondary mb-4">
            Please sign in to view playlists
          </p>
          <button
            onClick={() => router.push("/login")}
            className="rounded-lg bg-ms-accent px-4 py-2 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover"
          >
            Sign in
          </button>
        </div>
      </div>
    );
  }

  if (playlistQuery.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-3">
          <Spinner className="size-8" />
          <p className="text-ms-text-secondary">Loading playlist...</p>
        </div>
      </div>
    );
  }

  if (playlistQuery.isError || !playlistData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <p className="text-ms-text-secondary mb-4">Could not load playlist</p>
        <button
          onClick={() => router.back()}
          className="rounded-lg bg-ms-accent px-4 py-2 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover"
        >
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-40">
      {/* Header */}
      <div className="sticky top-0 z-40 border-b border-ms-border-default bg-ms-bg-deep/95 backdrop-blur-lg">
        <div className="px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-full p-2 hover:bg-ms-bg-elevated text-ms-text-secondary hover:text-ms-text-primary ms-transition"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold truncate">
              {playlistData.playlist.name}
            </h1>
            <p className="text-sm text-ms-text-secondary">
              {playlistData.playlist.songCount} song
              {playlistData.playlist.songCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        {/* Player Controls */}
        <div className="border-t border-ms-border-subtle bg-ms-bg-raised px-6 py-3 flex items-center gap-3 flex-wrap">
          <button
            onClick={toggleShuffleMode}
            className={`cursor-pointer p-2 rounded-full text-ms-text-secondary hover:text-ms-text-primary ms-transition ${
              shuffleMode
                ? "bg-ms-accent text-ms-accent-text"
                : "hover:bg-ms-bg-elevated"
            }`}
            title="Toggle shuffle"
          >
            <Shuffle size={18} />
          </button>

          <button
            onClick={handlePlayPrevious}
            className="cursor-pointer p-2 rounded-full text-ms-text-secondary hover:text-ms-text-primary hover:bg-ms-bg-elevated ms-transition"
            title="Previous"
          >
            <SkipBack size={18} />
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="cursor-pointer px-4 py-2 rounded-full bg-ms-accent text-ms-accent-text hover:bg-ms-accent-hover flex items-center gap-2 ms-transition"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
            <span className="text-sm font-semibold">
              {playing ? "Pause" : "Play"}
            </span>
          </button>

          <button
            onClick={handlePlayNext}
            className="cursor-pointer p-2 rounded-full text-ms-text-secondary hover:text-ms-text-primary hover:bg-ms-bg-elevated ms-transition"
            title="Next"
          >
            <SkipForward size={18} />
          </button>

          {activeSong && (
            <div className="ml-auto text-sm text-ms-text-secondary">
              Now:{" "}
              <span className="text-ms-text-primary">{activeSong.title}</span>
            </div>
          )}
        </div>
      </div>

      {/* Songs List */}
      <div className="px-6 py-6">
        {songs.length > 0 ? (
          <div className="space-y-2">
            {songs.map((song, index) => (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => handleSongClick(song, index)}
                className={`rounded-lg border transition-all cursor-pointer group ${
                  activeSong?.id === song.id
                    ? "border-ms-accent bg-ms-accent/10"
                    : "border-ms-border-subtle bg-ms-bg-raised hover:border-ms-border-default hover:bg-ms-bg-elevated"
                } p-4`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex size-12 items-center justify-center rounded-lg shrink-0 transition-colors ${
                      activeSong?.id === song.id
                        ? "bg-ms-accent text-ms-accent-text"
                        : "bg-ms-accent-subtle text-ms-accent group-hover:bg-ms-accent group-hover:text-ms-accent-text"
                    }`}
                  >
                    {activeSong?.id === song.id && playing ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`truncate font-semibold ${
                        activeSong?.id === song.id
                          ? "text-ms-accent"
                          : "text-ms-text-primary"
                      }`}
                    >
                      {song.title}
                    </h3>
                    <p className="truncate text-sm text-ms-text-secondary">
                      {song.artist}
                    </p>
                    {song.duration && (
                      <p className="text-xs text-ms-text-tertiary mt-1">
                        {Math.floor(song.duration / 60)}:
                        {String(song.duration % 60).padStart(2, "0")}
                      </p>
                    )}
                  </div>
                  <div className="text-xs text-ms-text-tertiary ml-auto">
                    #{index + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-ms-accent-subtle text-ms-accent">
              <Music2 size={32} />
            </div>
            <p className="text-ms-text-secondary">No songs in this playlist</p>
          </div>
        )}
      </div>
    </div>
  );
}
