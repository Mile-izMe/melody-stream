"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/use-auth-store";
import { requestSongPresignUrl } from "@/src/features/graphql/mutations/song/song-presign-url";
import { requestSongSaveMetadata } from "@/src/features/graphql/mutations/song/song-save-metadata";
import {
  Upload as UploadIcon,
  Music,
  CheckCircle,
  AlertCircle,
  X,
  Headphones,
  ArrowLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("audio/")) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Please select an audio file (MP3, WAV, etc.)");
        setFile(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile?.type.startsWith("audio/")) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please drop an audio file");
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setError("");

    try {
      const presignResponse = await requestSongPresignUrl(
        { contentType: file.type, fileName: file.name },
        user.token,
      );

      const presignData = presignResponse.songPresignUrl.data;

      const uploadResponse = await fetch(presignData.url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadResponse.ok) throw new Error("Upload to storage failed");

      await requestSongSaveMetadata(
        {
          userId: user.id,
          key: presignData.key,
          title,
          artist,
        },
        user.token,
      );

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-ms-text-secondary hover:text-ms-text-primary ms-transition mb-4"
        >
          <ArrowLeft size={14} />
          Back to Library
        </Link>
        <h1 className="text-2xl font-bold tracking-tight mb-1">
          Upload Track
        </h1>
        <p className="text-sm text-ms-text-secondary">
          Add a new track to your MelodyStream library.
        </p>
      </div>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Drop zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`
            relative rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center ms-transition
            ${
              file
                ? "border-ms-accent bg-ms-accent-subtle"
                : dragOver
                  ? "border-ms-accent bg-ms-accent-subtle"
                  : "border-ms-border-strong bg-ms-bg-raised hover:border-ms-text-tertiary"
            }
          `}
        >
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            aria-label="Choose audio file"
          />

          <div
            className={`size-14 rounded-xl flex items-center justify-center mb-4 ms-transition ${
              file
                ? "bg-ms-accent text-ms-bg-deep"
                : "bg-ms-bg-elevated text-ms-text-tertiary"
            }`}
          >
            {file ? <CheckCircle size={28} /> : <UploadIcon size={28} />}
          </div>

          <p className="text-sm font-medium text-ms-text-primary mb-1">
            {file ? file.name : "Drop an audio file here, or click to browse"}
          </p>
          <p className="text-xs text-ms-text-tertiary">
            MP3, WAV, or AAC
          </p>

          {file && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setFile(null);
              }}
              className="absolute top-3 right-3 p-1.5 rounded-lg bg-ms-bg-elevated text-ms-text-secondary hover:text-ms-text-primary ms-transition z-20"
              aria-label="Remove file"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Metadata fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="track-title"
              className="text-xs font-semibold text-ms-text-secondary"
            >
              Track Title
            </label>
            <div className="relative">
              <Music
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ms-text-tertiary"
                size={16}
              />
              <input
                id="track-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ms-bg-elevated border border-ms-border-default focus:border-ms-accent rounded-xl outline-none text-sm text-ms-text-primary placeholder:text-ms-text-tertiary ms-transition"
                placeholder="Track title"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label
              htmlFor="track-artist"
              className="text-xs font-semibold text-ms-text-secondary"
            >
              Artist Name
            </label>
            <div className="relative">
              <Headphones
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ms-text-tertiary"
                size={16}
              />
              <input
                id="track-artist"
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ms-bg-elevated border border-ms-border-default focus:border-ms-accent rounded-xl outline-none text-sm text-ms-text-primary placeholder:text-ms-text-tertiary ms-transition"
                placeholder="Artist name"
                required
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={uploading || !file}
          className="w-full bg-ms-accent text-ms-bg-deep font-semibold py-3.5 rounded-xl hover:bg-ms-accent-hover active:scale-[0.98] disabled:opacity-30 disabled:active:scale-100 flex items-center justify-center gap-2 ms-transition"
        >
          {uploading ? (
            <>
              <div className="size-4 border-2 border-ms-bg-deep/30 border-t-ms-bg-deep rounded-full animate-spin" />
              <span className="text-sm">Uploading...</span>
            </>
          ) : (
            <>
              <UploadIcon size={16} />
              <span className="text-sm">Publish Track</span>
            </>
          )}
        </button>
      </form>

      {/* Toast notifications */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-ms-bg-elevated text-ms-text-primary font-medium px-6 py-3.5 rounded-xl shadow-2xl border border-ms-border-default flex items-center gap-3 z-[60]"
          >
            <CheckCircle size={18} className="text-ms-success shrink-0" />
            <span className="text-sm">Track uploaded. Processing HLS stream...</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-ms-error text-ms-text-primary font-medium px-6 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 z-[60]"
          >
            <AlertCircle size={18} className="shrink-0" />
            <span className="text-sm">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
