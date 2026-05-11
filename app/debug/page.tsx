"use client";

import Link from "next/link";

export default function DebugPage() {
  return (
    <div className="min-h-screen bg-ms-bg-base p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-ms-text-primary mb-2">
            🐛 Debug Center
          </h1>
          <p className="text-ms-text-secondary">
            Test và kiểm tra các tính năng của ứng dụng
          </p>
        </div>

        {/* Debug Pages */}
        <div className="space-y-4">
          {/* Token Debug */}
          <Link
            href="/debug/token"
            className="block bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default hover:border-ms-accent hover:shadow-lg ms-transition cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ms-text-primary group-hover:text-ms-accent ms-transition">
                  🔐 Token Refresh
                </h2>
                <p className="text-sm text-ms-text-secondary mt-1">
                  Monitor JWT token status, expiry time, and test automatic
                  refresh
                </p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <ul className="text-xs text-ms-text-tertiary mt-3 space-y-1">
              <li>✓ View current access token status</li>
              <li>✓ See token expiry countdown</li>
              <li>✓ Manually trigger refresh</li>
              <li>✓ Track refresh logs</li>
            </ul>
          </Link>

          {/* Toast Test */}
          <Link
            href="/debug/toast"
            className="block bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default hover:border-ms-accent hover:shadow-lg ms-transition cursor-pointer group"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ms-text-primary group-hover:text-ms-accent ms-transition">
                  🎉 Toast Notifications
                </h2>
                <p className="text-sm text-ms-text-secondary mt-1">
                  Test all toast notification types: success, error, warning,
                  info, loading
                </p>
              </div>
              <span className="text-2xl">→</span>
            </div>
            <ul className="text-xs text-ms-text-tertiary mt-3 space-y-1">
              <li>✓ Success notifications</li>
              <li>✓ Error notifications</li>
              <li>✓ Warning notifications</li>
              <li>✓ Info & loading states</li>
            </ul>
          </Link>
        </div>

        {/* Info */}
        <div className="bg-ms-accent/10 rounded-lg p-6 border border-ms-accent/20 space-y-3">
          <h3 className="font-semibold text-ms-accent">ℹ️ Debug Pages</h3>
          <p className="text-sm text-ms-text-secondary">
            Debug pages giúp bạn kiểm tra các tính năng trong quá trình phát
            triển.
            <br />
            <strong>⚠️ Lưu ý:</strong> Chỉ sử dụng trong development, không
            deploy lên production!
          </p>
          <div className="bg-ms-bg-raised rounded p-3 border border-ms-border-default">
            <p className="text-xs text-ms-text-tertiary font-mono">
              Truy cập: http://localhost:3000/debug
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex gap-2 flex-wrap">
          <a
            href="/"
            className="text-sm text-ms-accent hover:text-ms-accent-hover ms-transition"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
