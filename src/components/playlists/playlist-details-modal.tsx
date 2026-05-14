"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Music2, Play, Pause, X } from "lucide-react";
import { useAuth } from "@/src/stores/use-auth-store";
import { usePlayerStore } from "@/src/stores/usePlayerStore";
import { Spinner } from "@/src/components/ui/spinner";
import {
  requestPlaylistSongs,
  type PlaylistSongsData,
} from "@/src/features/graphql";

interface PlaylistDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
}

export function PlaylistDetailsModal({
  isOpen,
  onClose,
  playlistId,
}: PlaylistDetailsModalProps) {
  const { user } = useAuth();
  const token = user?.token;

  const {
    activeSong,
    playing,
    setActiveSong,
    setPlaying,
    setQueue,
    setCurrentIndex,
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
    enabled: isOpen && Boolean(token) && Boolean(playlistId),
  });

  if (!isOpen) {
    return null;
  }

  const playlistData = playlistQuery.data;
  const songs = playlistData?.songs ?? [];

  const handleSongClick = (
    song: PlaylistSongsData["songs"][number],
    index: number,
  ) => {
    setQueue(songs);
    setCurrentIndex(index);
    setActiveSong(song);
    setPlaying(true);
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-ms-scrim/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl rounded-2xl border border-ms-border-default bg-ms-bg-raised p-6 shadow-2xl max-h-[80vh] flex flex-col"
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ms-accent mb-2">
              Playlist Details
            </p>
            {playlistData && (
              <>
                <h2 className="text-2xl font-bold tracking-tight">
                  {playlistData.playlist.name}
                </h2>
                <p className="text-sm text-ms-text-secondary mt-1">
                  {playlistData.playlist.songCount} song
                  {playlistData.playlist.songCount === 1 ? "" : "s"}
                </p>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-ms-text-tertiary hover:text-ms-text-primary hover:bg-ms-bg-elevated ms-transition"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {playlistQuery.isLoading ? (
            <div className="flex items-center gap-3 py-12 text-ms-text-secondary justify-center">
              <Spinner className="size-5" />
              Loading playlist...
            </div>
          ) : songs.length > 0 ? (
            <div className="space-y-2">
              {songs.map((song, index) => (
                <div
                  key={song.id}
                  onClick={() => handleSongClick(song, index)}
                  className={`rounded-lg border transition-all cursor-pointer ${
                    activeSong?.id === song.id
                      ? "border-ms-accent bg-ms-accent/10"
                      : "border-ms-border-subtle bg-ms-bg-elevated hover:border-ms-border-default hover:bg-ms-bg-subtle"
                  } p-4`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-lg shrink-0 transition-colors ${
                        activeSong?.id === song.id
                          ? "bg-ms-accent text-ms-accent-text"
                          : "bg-ms-accent-subtle text-ms-accent"
                      }`}
                    >
                      {activeSong?.id === song.id && playing ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
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
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-ms-accent-subtle text-ms-accent">
                <Music2 size={22} />
              </div>
              <p className="text-sm text-ms-text-secondary">
                No songs in this playlist yet
              </p>
            </div>
          )}
        </div>

        {playlistQuery.isError && (
          <div className="mt-6 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600">
            Failed to load playlist details
          </div>
        )}
      </motion.div>
    </div>
  );
}
