"use client";
import { motion } from "framer-motion";
import { Play, Zap, Music, Users, Upload, LogOut } from "lucide-react";
import { useAuth } from "@/src/stores/use-auth";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleUpload = () => {
    router.push("/upload");
  };

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="flex flex-col flex-1 bg-black text-white">
        {/* User Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="font-bold text-lg">{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={handleUpload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-shadow"
              >
                <Upload size={18} />
                Upload Music
              </motion.button>

              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">
              Welcome back,{" "}
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {user.username}
              </span>
              !
            </h1>
            <p className="text-xl text-gray-400 mb-12">
              Ready to share your music with the world?
            </p>

            <motion.button
              onClick={handleUpload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:shadow-xl transition-shadow text-lg"
            >
              Start Uploading
            </motion.button>
          </motion.div>
        </section>

        {/* Quick Stats */}
        <section className="px-8 py-20 bg-white/5 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              { label: "Uploaded", value: "0" },
              { label: "Followers", value: "0" },
              { label: "Plays", value: "0" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="text-center p-6 bg-white/5 border border-white/10 rounded-2xl"
              >
                <p className="text-4xl font-bold text-purple-400 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-400">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    );
  }

  // If not logged in, show marketing page
  return (
    <div className="flex flex-col flex-1 bg-black text-white">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <Play size={40} fill="white" className="text-white ml-1" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              MelodyStream
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10">
            Stream, upload, and discover music like never before. A modern
            platform built with cutting-edge technology.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:shadow-xl transition-shadow"
            >
              Get Started
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-20 bg-white/5 backdrop-blur-xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Powerful Features
        </motion.h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Music size={32} />,
              title: "Stream Quality",
              desc: "Crystal-clear audio with adaptive bitrate streaming",
            },
            {
              icon: <Zap size={32} />,
              title: "Lightning Fast",
              desc: "Optimized for speed and performance across all devices",
            },
            {
              icon: <Users size={32} />,
              title: "Community",
              desc: "Discover artists and share your favorite tracks",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className="text-purple-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to dive in?</h2>
          <p className="text-lg mb-8 text-white/80">
            Join thousands of music lovers and creators on MelodyStream
          </p>
          <motion.a
            href="/login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-white text-black font-bold rounded-2xl hover:shadow-xl transition-shadow"
          >
            Sign Up Now
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}
