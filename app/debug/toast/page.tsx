"use client";

import { notify } from "@/src/libs/toast";

export default function ToastTestPage() {
  return (
    <div className="min-h-screen bg-ms-bg-base p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-ms-text-primary mb-2">
            🎉 Toast Test
          </h1>
          <p className="text-ms-text-secondary text-sm">
            Click buttons to test toast notifications
          </p>
        </div>

        {/* Success Toasts */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-success">✅ Success</h2>
          <div className="space-y-2">
            <button
              onClick={() =>
                notify.success(
                  "Operation successful",
                  "Your action completed successfully",
                )
              }
              className="w-full bg-ms-success/20 text-ms-success font-semibold py-3 rounded-xl hover:bg-ms-success/30 ms-transition"
            >
              Success (with description)
            </button>
            <button
              onClick={() => notify.success("Done!")}
              className="w-full bg-ms-success/20 text-ms-success font-semibold py-3 rounded-xl hover:bg-ms-success/30 ms-transition"
            >
              Success (title only)
            </button>
          </div>
        </div>

        {/* Error Toasts */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-error">❌ Error</h2>
          <div className="space-y-2">
            <button
              onClick={() =>
                notify.error(
                  "Operation failed",
                  "Something went wrong. Please try again",
                )
              }
              className="w-full bg-ms-error/20 text-ms-error font-semibold py-3 rounded-xl hover:bg-ms-error/30 ms-transition"
            >
              Error (with description)
            </button>
            <button
              onClick={() => notify.error("Error")}
              className="w-full bg-ms-error/20 text-ms-error font-semibold py-3 rounded-xl hover:bg-ms-error/30 ms-transition"
            >
              Error (title only)
            </button>
          </div>
        </div>

        {/* Warning Toasts */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-warning">⚠️ Warning</h2>
          <div className="space-y-2">
            <button
              onClick={() =>
                notify.warning(
                  "Be careful",
                  "This action may have consequences",
                )
              }
              className="w-full bg-ms-warning/20 text-ms-warning font-semibold py-3 rounded-xl hover:bg-ms-warning/30 ms-transition"
            >
              Warning (with description)
            </button>
            <button
              onClick={() => notify.warning("Warning")}
              className="w-full bg-ms-warning/20 text-ms-warning font-semibold py-3 rounded-xl hover:bg-ms-warning/30 ms-transition"
            >
              Warning (title only)
            </button>
          </div>
        </div>

        {/* Info Toasts */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-accent">ℹ️ Info</h2>
          <div className="space-y-2">
            <button
              onClick={() =>
                notify.info(
                  "Did you know?",
                  "You can use toast notifications anywhere",
                )
              }
              className="w-full bg-ms-accent/20 text-ms-accent font-semibold py-3 rounded-xl hover:bg-ms-accent/30 ms-transition"
            >
              Info (with description)
            </button>
            <button
              onClick={() => notify.info("Info")}
              className="w-full bg-ms-accent/20 text-ms-accent font-semibold py-3 rounded-xl hover:bg-ms-accent/30 ms-transition"
            >
              Info (title only)
            </button>
          </div>
        </div>

        {/* Loading Toast */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-text-primary">
            ⏳ Loading
          </h2>
          <div className="space-y-2">
            <button
              onClick={() => {
                const toastId = notify.loading("Processing...", "Please wait");
                setTimeout(() => {
                  notify.success("Done!", "Processing completed");
                  notify.dismiss(toastId);
                }, 3000);
              }}
              className="w-full bg-ms-bg-elevated text-ms-text-primary font-semibold py-3 rounded-xl hover:bg-ms-bg-elevated/80 ms-transition"
            >
              Loading (auto-dismiss after 3s)
            </button>
          </div>
        </div>

        {/* Multiple Toasts */}
        <div className="bg-ms-bg-raised rounded-lg p-6 border border-ms-border-default space-y-3">
          <h2 className="text-lg font-semibold text-ms-text-primary">
            🎲 Multiple
          </h2>
          <button
            onClick={() => {
              notify.success("Success #1", "First notification");
              notify.warning("Warning #2", "Second notification");
              notify.info("Info #3", "Third notification");
              notify.error("Error #4", "Fourth notification");
            }}
            className="w-full bg-ms-accent text-ms-accent-text font-semibold py-3 rounded-xl hover:bg-ms-accent-hover ms-transition"
          >
            Show 4 Different Toasts
          </button>
        </div>

        {/* Info Box */}
        <div className="bg-ms-accent/10 rounded-lg p-6 border border-ms-accent/20 space-y-2">
          <h3 className="font-semibold text-ms-accent">
            ℹ️ How to Use in Code
          </h3>
          <pre className="bg-ms-bg-raised text-ms-text-primary text-xs p-3 rounded overflow-x-auto">
            {`import { notify } from "@/src/libs/toast";

// Success
notify.success("Title", "Description");

// Error
notify.error("Title", "Description");

// Warning
notify.warning("Title", "Description");

// Info
notify.info("Title", "Description");

// Loading
const toastId = notify.loading("Title");
// ... later ...
notify.dismiss(toastId);

// Promise
notify.promise(
  myPromise,
  {
    loading: "Loading...",
    success: "Done!",
    error: "Failed!",
  }
);`}
          </pre>
        </div>
      </div>
    </div>
  );
}
