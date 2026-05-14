"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Disc3, FolderPlus, ListMusic, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/use-auth-store";
import { notify } from "@/src/libs/toast";
import type { SongItem } from "@/src/features/graphql/queries/songs";
import {
  requestMyPlaylists,
  requestCreatePlaylist,
  requestAddSongToPlaylist,
} from "@/src/features/graphql";

interface PlaylistPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  song: SongItem;
}

export function PlaylistPickerModal({
  isOpen,
  onClose,
  song,
}: PlaylistPickerModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const token = user?.token;

  const playlistsQuery = useQuery({
    queryKey: ["my-playlists", user?.id ?? "guest"],
    queryFn: async () => {
      const response = await requestMyPlaylists(
        {
          filters: {
            pageNumber: 1,
            limit: 24,
            sorts: [{ by: "createdAt", order: "DESC" }],
          },
        },
        token,
      );

      return response.myPlaylists.data;
    },
    enabled: isOpen && Boolean(token),
  });

  const playlists = playlistsQuery.data?.data ?? [];
  const selectedPlaylist = playlists.find(
    (playlist) => playlist.id === selectedPlaylistId,
  );

  const addExistingPlaylistMutation = useMutation({
    mutationFn: async (playlistId: string) => {
      if (!token) {
        throw new Error("Please sign in to manage playlists");
      }

      return requestAddSongToPlaylist(
        {
          playlistId,
          songId: song.id,
        },
        token,
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["my-playlists", user?.id ?? "guest"],
      });
      notify.success(
        "Added to playlist",
        `${song.title} is now in the playlist.`,
      );
      onClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Unable to add song";
      notify.error("Could not add song", message);
    },
  });

  const createPlaylistMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!token) {
        throw new Error("Please sign in to manage playlists");
      }

      const response = await requestCreatePlaylist({ name }, token);
      const playlist = response.createPlaylist.data?.playlist;

      if (!playlist) {
        throw new Error("Playlist was not created");
      }

      await requestAddSongToPlaylist(
        {
          playlistId: playlist.id,
          songId: song.id,
        },
        token,
      );

      return playlist;
    },
    onSuccess: async (playlist) => {
      await queryClient.invalidateQueries({
        queryKey: ["my-playlists", user?.id ?? "guest"],
      });
      setNewPlaylistName("");
      notify.success(
        "Playlist created",
        `${song.title} was added to ${playlist.name}.`,
      );
      onClose();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Unable to create playlist";
      notify.error("Could not create playlist", message);
    },
  });

  if (!isOpen) {
    return null;
  }

  const canSubmitExisting =
    Boolean(selectedPlaylistId) && !addExistingPlaylistMutation.isPending;
  const canSubmitNew =
    newPlaylistName.trim().length > 0 && !createPlaylistMutation.isPending;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ms-scrim/80 backdrop-blur-md p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: -300 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg rounded-2xl border border-ms-border-default bg-ms-bg-raised p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ms-accent mb-2">
              Add to playlist
            </p>
            <h2 className="text-xl font-bold tracking-tight">{song.title}</h2>
            <p className="text-sm text-ms-text-secondary truncate">
              {song.artist}
            </p>
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

        {!token ? (
          <div className="rounded-xl border border-ms-border-subtle bg-ms-bg-elevated p-4">
            <p className="text-sm text-ms-text-secondary mb-4">
              Sign in to add songs to playlists or create a new one.
            </p>
            <button
              type="button"
              onClick={() => {
                onClose();
                router.push("/login");
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-ms-accent px-4 py-2.5 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover ms-transition"
            >
              <Plus size={16} />
              Sign in
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <section className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
                <ListMusic size={16} className="text-ms-accent" />
                Choose a playlist
              </div>

              {playlistsQuery.isLoading ? (
                <div className="rounded-xl border border-ms-border-subtle bg-ms-bg-elevated p-4 text-sm text-ms-text-secondary">
                  Loading playlists...
                </div>
              ) : playlists.length > 0 ? (
                <div
                  cursor-pointer
                  className="grid gap-2 max-h-56 overflow-y-auto pr-1"
                >
                  {playlists.map((playlist) => {
                    const isSelected = playlist.id === selectedPlaylistId;

                    return (
                      <button
                        key={playlist.id}
                        type="button"
                        onClick={() => setSelectedPlaylistId(playlist.id)}
                        className={`flex items-center justify-between gap-4 rounded-xl border px-4 py-3 text-left ms-transition ${
                          isSelected
                            ? "cursor-pointer border-ms-accent bg-ms-accent-subtle"
                            : "border-ms-border-subtle bg-ms-bg-elevated hover:border-ms-border-default hover:bg-ms-bg-elevated/80"
                        }`}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-ms-text-primary">
                            {playlist.name}
                          </p>
                          <p className="text-xs text-ms-text-secondary">
                            {playlist.songCount} song
                            {playlist.songCount === 1 ? "" : "s"}
                          </p>
                        </div>
                        {isSelected ? (
                          <Check
                            size={16}
                            className="shrink-0 text-ms-accent"
                          />
                        ) : (
                          <Disc3
                            size={16}
                            className="shrink-0 text-ms-text-tertiary"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-ms-border-subtle bg-ms-bg-elevated p-4 text-sm text-ms-text-secondary">
                  You do not have any playlists yet. Create one below.
                </div>
              )}

              <button
                type="button"
                disabled={!canSubmitExisting}
                onClick={() => {
                  if (!selectedPlaylist) {
                    notify.warning(
                      "Pick a playlist",
                      "Choose a playlist first.",
                    );
                    return;
                  }

                  addExistingPlaylistMutation.mutate(selectedPlaylist.id);
                }}
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-ms-accent px-4 py-2.5 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover disabled:cursor-not-allowed disabled:opacity-50 ms-transition"
              >
                <Plus size={16} />
                Add to selected playlist
              </button>
            </section>

            <section className="space-y-3 rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-ms-text-primary">
                <FolderPlus size={16} className="text-ms-accent" />
                Create a new playlist
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={newPlaylistName}
                  onChange={(event) => setNewPlaylistName(event.target.value)}
                  placeholder="Chill mix, Road trip, Favorites..."
                  className="flex-1 rounded-xl border border-ms-border-default bg-ms-bg-raised px-4 py-3 text-sm text-ms-text-primary outline-none placeholder:text-ms-text-tertiary focus:border-ms-accent"
                />
                <button
                  type="button"
                  disabled={!canSubmitNew}
                  onClick={() => {
                    const name = newPlaylistName.trim();

                    if (!name) {
                      notify.warning(
                        "Name your playlist",
                        "Enter a playlist name first.",
                      );
                      return;
                    }

                    createPlaylistMutation.mutate(name);
                  }}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-xl bg-ms-bg-raised px-4 py-3 text-sm font-semibold text-ms-text-primary border border-ms-border-subtle hover:bg-ms-bg-elevated disabled:cursor-not-allowed disabled:opacity-50 ms-transition"
                >
                  {createPlaylistMutation.isPending
                    ? "Creating..."
                    : "Create & add"}
                </button>
              </div>
            </section>
          </div>
        )}
      </motion.div>
    </div>
  );
}
