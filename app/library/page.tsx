"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Calendar,
  Disc3,
  FolderPlus,
  Library,
  Music2,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/src/stores/use-auth-store";
import { Spinner } from "@/src/components/ui/spinner";
import { PlaylistDetailsModal } from "@/src/components/playlists/playlist-details-modal";
import {
  requestMyPlaylists,
  requestCreatePlaylist,
  type PlaylistItem,
} from "@/src/features/graphql";
import { notify } from "@/src/libs/toast";

export default function LibraryPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [playlistName, setPlaylistName] = useState("");
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

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
        user?.token,
      );

      return response.myPlaylists.data;
    },
    enabled: Boolean(user),
  });

  const createPlaylistMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!user?.token) {
        throw new Error("Please sign in to manage playlists");
      }

      const response = await requestCreatePlaylist({ name }, user.token);
      return response.createPlaylist.data?.playlist;
    },
    onSuccess: async (playlist) => {
      await queryClient.invalidateQueries({
        queryKey: ["my-playlists", user?.id ?? "guest"],
      });
      setPlaylistName("");
      notify.success(
        "Playlist created",
        `${playlist?.name ?? "Your playlist"} is ready.`,
      );
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Unable to create playlist";
      notify.error("Could not create playlist", message);
    },
  });

  const playlists: PlaylistItem[] = playlistsQuery.data?.data ?? [];
  const totalSongs = playlists.reduce(
    (total, playlist) => total + playlist.songCount,
    0,
  );

  const handleCreatePlaylist = () => {
    const name = playlistName.trim();

    if (!name) {
      notify.warning("Name your playlist", "Enter a playlist name first.");
      return;
    }

    createPlaylistMutation.mutate(name);
  };

  const handlePlaylistClick = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
    setIsDetailsModalOpen(true);
  };

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] flex-col justify-center px-8 pb-28 pt-10">
        <div className="mx-auto w-full max-w-2xl rounded-3xl border border-ms-border-subtle bg-ms-bg-raised p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-ms-accent-subtle text-ms-accent">
              <Library size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-accent">
                Library
              </p>
              <h1 className="text-3xl font-bold tracking-tight">
                Your playlists
              </h1>
            </div>
          </div>
          <p className="max-w-xl text-sm text-ms-text-secondary">
            Sign in to create playlists, add tracks from the player bar, and
            keep your collection organized.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-ms-accent px-5 py-3 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover ms-transition"
            >
              <Plus size={16} />
              Sign in
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 pb-28">
      <div className="px-8 pt-8 pb-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-accent mb-2">
              Library
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Your playlists
            </h1>
            <p className="mt-3 text-sm text-ms-text-secondary">
              Collect songs into playlists, then add tracks straight from the
              player bar.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary mb-1">
                Playlists
              </p>
              <p className="text-2xl font-bold tracking-tight">
                {playlists.length}
              </p>
            </div>
            <div className="rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary mb-1">
                Tracks saved
              </p>
              <p className="text-2xl font-bold tracking-tight">{totalSongs}</p>
            </div>
            <div className="rounded-2xl border border-ms-border-subtle bg-ms-bg-elevated px-4 py-3 sm:col-span-1 col-span-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary mb-1">
                Quick create
              </p>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={playlistName}
                  onChange={(event) => setPlaylistName(event.target.value)}
                  placeholder="New playlist"
                  className="min-w-0 flex-1 rounded-lg border border-ms-border-default bg-ms-bg-raised px-3 py-2 text-sm outline-none placeholder:text-ms-text-tertiary focus:border-ms-accent"
                />
                <button
                  type="button"
                  onClick={handleCreatePlaylist}
                  disabled={createPlaylistMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-ms-accent px-3 py-2 text-sm font-semibold text-ms-accent-text hover:bg-ms-accent-hover disabled:opacity-50 ms-transition"
                >
                  <FolderPlus size={16} />
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 flex-1">
        {playlistsQuery.isLoading ? (
          <div className="flex items-center gap-3 py-12 text-ms-text-secondary">
            <Spinner className="size-5" />
            Loading playlists...
          </div>
        ) : playlists.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {playlists.map((playlist) => (
              <motion.article
                key={playlist.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handlePlaylistClick(playlist.id)}
                className="rounded-2xl border border-ms-border-subtle bg-ms-bg-raised p-5 shadow-sm cursor-pointer hover:border-ms-accent hover:shadow-md hover:bg-ms-bg-elevated ms-transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-ms-accent-subtle text-ms-accent">
                      <Disc3 size={22} />
                    </div>
                    <h2 className="truncate text-lg font-semibold tracking-tight">
                      {playlist.name}
                    </h2>
                    <p className="mt-1 text-sm text-ms-text-secondary">
                      {playlist.songCount} song
                      {playlist.songCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="rounded-full border border-ms-border-subtle bg-ms-bg-elevated px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
                    Playlist
                  </div>
                </div>

                <div className="mt-6 grid gap-3 text-xs text-ms-text-secondary">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-ms-text-tertiary" />
                    Created{" "}
                    {new Intl.DateTimeFormat("vi-VN", {
                      dateStyle: "medium",
                    }).format(new Date(playlist.createdAt))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Music2 size={14} className="text-ms-text-tertiary" />
                    Updated{" "}
                    {new Intl.DateTimeFormat("vi-VN", {
                      dateStyle: "medium",
                    }).format(new Date(playlist.updatedAt))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-ms-border-subtle bg-ms-bg-elevated py-24 text-center"
          >
            <div className="mb-5 flex size-16 items-center justify-center rounded-2xl bg-ms-accent-subtle text-ms-accent">
              <Library size={28} />
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              No playlists yet
            </h2>
            <p className="mt-2 max-w-md text-sm text-ms-text-secondary">
              Create your first playlist above, then add songs from the player
              bar.
            </p>
          </motion.div>
        )}
      </div>

      <PlaylistDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        playlistId={selectedPlaylistId || ""}
      />
    </div>
  );
}
