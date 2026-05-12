"use client";

import Image from "next/image";
import { Play, Disc3, Music, Pencil } from "lucide-react";
import type { SongItem } from "@/src/features/graphql/queries/songs";

export default function TrackRow({
  song,
  index,
  isActive,
  isPlaying,
  onSelect,
  onEdit,
}: {
  song: SongItem;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
  onEdit?: (songId: string) => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full grid grid-cols-[2rem_1fr_5rem] sm:grid-cols-[2.5rem_2fr_1fr_5rem]
        gap-4 px-5 py-3 items-center text-left group ms-transition
        hover:bg-ms-bg-elevated
        ${isActive ? "bg-ms-accent-subtle" : ""}
      `}
    >
      <span className="text-sm tabular-nums flex items-center justify-center">
        {isActive && isPlaying ? (
          <Disc3
            size={16}
            className="text-ms-accent animate-spin"
            style={{ animationDuration: "3s" }}
          />
        ) : (
          <>
            <span className="text-ms-text-tertiary group-hover:hidden">
              {index + 1}
            </span>
            <Play
              size={14}
              className="text-ms-text-primary hidden group-hover:block"
            />
          </>
        )}
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
          <span
            className={`block truncate text-sm font-medium ${
              isActive ? "text-ms-accent" : "text-ms-text-primary"
            }`}
          >
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

      <span className="text-right text-sm text-ms-text-tertiary tabular-nums flex items-center justify-end gap-2">
        {song.isEditable && onEdit ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(song.id);
            }}
            className="cursor-pointer rounded-lg p-1.5 hover:bg-ms-accent/20 text-ms-accent hover:text-ms-accent-hover ms-transition"
            aria-label="Edit song"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
        ) : null}
        <span>
          {song.duration
            ? `${Math.floor(song.duration / 60)}:${Math.floor(
                song.duration % 60,
              )
                .toString()
                .padStart(2, "0")}`
            : "--:--"}
        </span>
      </span>
    </button>
  );
}
