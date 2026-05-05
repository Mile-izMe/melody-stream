"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/use-auth";
import {
  Upload as UploadIcon,
  Music,
  CheckCircle,
  AlertCircle,
  X,
  Headphones,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith("audio/")) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Vui lòng chọn một tệp âm thanh (mp3, wav, v.v.)");
        setFile(null);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("audio", file);
    formData.append("title", title);
    formData.append("artist", artist);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Không thể tải bài hát lên");
      }

      setSuccess(true);
      setTimeout(() => router.push("/"), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Sonic Studio</h1>
        <p className="text-gray-400">
          Upload your latest masterpieces to the MelodyStream cloud.
        </p>
      </header>

      <form onSubmit={handleUpload} className="space-y-8">
        <div className="bg-white/5 backdrop-blur-xl p-10 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

          <div className="space-y-8">
            {/* Drop Zone */}
            <div
              className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center space-y-6 ${
                file
                  ? "border-purple-500 bg-purple-500/5"
                  : "border-white/10 hover:border-purple-400/50 bg-white/5"
              }`}
            >
              <input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
              />
              <div
                className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all ${
                  file
                    ? "bg-purple-500 text-white shadow-xl shadow-purple-500/20"
                    : "bg-white/5 text-gray-500 border border-white/10"
                }`}
              >
                {file ? <CheckCircle size={40} /> : <UploadIcon size={40} />}
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">
                  {file ? file.name : "Choose audio file"}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  MP3, WAV, or AAC (Max 10MB)
                </p>
              </div>
              {file && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setFile(null);
                  }}
                  className="absolute top-4 right-4 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all z-30"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                  Track Title
                </label>
                <div className="relative">
                  <Music
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-purple-500 focus:bg-white/10 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-white"
                    placeholder="Enter track title"
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
                  Artist Name
                </label>
                <div className="relative">
                  <Headphones
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                    size={18}
                  />
                  <input
                    type="text"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-purple-500 focus:bg-white/10 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-white"
                    placeholder="Enter artist name"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full mt-10 bg-white text-black font-bold py-5 rounded-2xl shadow-xl hover:scale-[1.01] active:scale-95 disabled:opacity-30 disabled:scale-100 flex items-center justify-center space-x-3 transition-all"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-black"></div>
                <span className="uppercase tracking-widest text-sm">
                  Uploading Sonic Data...
                </span>
              </>
            ) : (
              <>
                <UploadIcon size={20} />
                <span className="uppercase tracking-widest text-sm">
                  Publish to MelodyStream
                </span>
              </>
            )}
          </button>
        </div>
      </form>

      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-white text-black font-bold px-8 py-4 rounded-3xl shadow-2xl border border-white/20 flex items-center space-x-4 z-[60]"
          >
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white">
              <CheckCircle size={18} />
            </div>
            <span>Track Published! Redirecting...</span>
          </motion.div>
        )}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-32 left-1/2 -translate-x-1/2 bg-red-500 text-white font-bold px-8 py-4 rounded-3xl shadow-2xl flex items-center space-x-4 z-[60]"
          >
            <AlertCircle size={24} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
