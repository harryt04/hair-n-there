"use client";

import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type InstallPromptEvent = Event & {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "hairnthere-install-dismissed";

export function PwaSupport() {
  const pendingPrompt = useRef<InstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)");
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISS_KEY) === "true";
    } catch {
      // Installation stays available if browser storage is restricted.
    }
    // These browser-only preferences cannot be known during server rendering.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHidden(
      dismissed ||
        standalone.matches ||
        (navigator as Navigator & { standalone?: boolean }).standalone === true,
    );

    const onPrompt = (event: Event) => {
      event.preventDefault();
      pendingPrompt.current = event as InstallPromptEvent;
      setCanInstall(true);
    };
    const onInstalled = () => {
      pendingPrompt.current = null;
      setCanInstall(false);
      setHidden(true);
    };
    const onDisplayChange = (event: MediaQueryListEvent) => {
      if (event.matches) onInstalled();
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    standalone.addEventListener("change", onDisplayChange);

    if (
      process.env.NODE_ENV === "production" &&
      window.isSecureContext &&
      "serviceWorker" in navigator
    ) {
      void navigator.serviceWorker
        .register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => {
          // Online browsing and installation remain usable if offline setup fails.
        });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
      standalone.removeEventListener("change", onDisplayChange);
    };
  }, []);

  async function install() {
    const prompt = pendingPrompt.current;
    if (!prompt) return;
    // Each browser event can only be used once, even if the user cancels.
    pendingPrompt.current = null;
    setCanInstall(false);
    try {
      await prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === "accepted") setHidden(true);
      else setMessage("You can install later from your browser’s menu.");
    } catch {
      setMessage(
        "Use your browser’s menu to add HairnThere to your home screen.",
      );
    }
  }

  function dismiss() {
    setHidden(true);
    try {
      sessionStorage.setItem(DISMISS_KEY, "true");
    } catch {
      // Dismissal still works for this page if storage is unavailable.
    }
  }

  if (hidden) return null;

  return (
    <aside
      aria-label="Save HairnThere"
      className="pwa-install border-t border-border"
    >
      <div className="site-container flex items-start justify-between gap-4 py-3">
        {canInstall ? (
          <Button
            type="button"
            variant="ghost"
            onClick={install}
            className="h-11 px-0 text-xs"
          >
            <Download aria-hidden="true" /> Add HairnThere to your home screen
          </Button>
        ) : (
          <details className="max-w-lg text-xs text-muted-foreground">
            <summary className="cursor-pointer py-3">
              Save HairnThere to your home screen
            </summary>
            <p className="pb-3 leading-6">
              On Android, use your browser’s “Add to home screen” menu. On
              iPhone, open this site in Safari, tap Share, then “Add to Home
              Screen”. An internet connection is needed to send inquiries.
            </p>
          </details>
        )}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={dismiss}
          className="size-11 shrink-0"
          aria-label="Dismiss home-screen suggestion"
        >
          <X aria-hidden="true" />
        </Button>
      </div>
      {message && (
        <p
          role="status"
          className="site-container pb-3 text-xs text-muted-foreground"
        >
          {message}
        </p>
      )}
    </aside>
  );
}
