"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
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
      aria-labelledby="install-title"
      className="pwa-install border-t border-border bg-muted/40"
    >
      <div className="site-container flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-xl">
          <h2 id="install-title" className="font-display text-xl">
            A little closer to great hair.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Add HairnThere to your home screen for an easy way back to
            Elisabeth’s services and your family planner. An internet connection
            is needed to use the site.
          </p>
          {!canInstall && (
            <details className="mt-3 text-sm text-muted-foreground">
              <summary className="cursor-pointer py-2 underline underline-offset-4">
                How to install
              </summary>
              <p className="mt-2 leading-6">
                On Android, open Chrome’s menu, choose “Add to home screen” and
                then “Install” if offered. On iPhone, open this site in Safari,
                tap Share, then “Add to Home Screen”. Available options depend
                on your browser.
              </p>
            </details>
          )}
          <p role="status" className="mt-2 text-sm text-muted-foreground">
            {message}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {canInstall && (
            <Button
              type="button"
              size="lg"
              className="min-h-11"
              onClick={install}
            >
              <Download aria-hidden="true" /> Install HairnThere
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="min-h-11"
            onClick={dismiss}
          >
            Not now
          </Button>
        </div>
      </div>
    </aside>
  );
}
