"use client";

import { useState } from "react";
import { Check, Copy, Download, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { business } from "@/data/business";
import { WebsiteQr } from "./website-qr";
import styles from "./card.module.css";

const website = business.cardDestination;

export function CardActions() {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(website);
      setCopied(true);
      setMessage("Services link copied.");
    } catch {
      setCopied(false);
      setMessage(
        "Couldn’t copy. You can select the link above, or open it to share from your browser.",
      );
    }
  }
  return (
    <>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
        <Sheet>
          <SheetTrigger render={<Button className="h-10 px-4 text-xs" />}>
            <Maximize aria-hidden="true" /> Fill screen
          </SheetTrigger>
          <SheetContent
            className={styles.presenter}
            style={{
              inset: 0,
              width: "100%",
              maxWidth: "none",
              height: "100dvh",
              transform: "none",
            }}
          >
            <div className="pr-10">
              <SheetTitle className="font-sans text-sm font-semibold">
                Scan to explore hair services
              </SheetTitle>
              <SheetDescription className="sr-only">
                Point your phone camera at this QR code to open the HairnThere
                services page. Close this view to return to the digital card.
              </SheetDescription>
            </div>
            <div className={styles.stage}>
              <WebsiteQr className={styles.qr} />
            </div>
            <p className="text-center text-xs font-medium">
              {business.cardWebsiteLabel} · Great Hair Travels.
            </p>
          </SheetContent>
        </Sheet>
        <Button
          variant="outline"
          className="h-10 px-3 text-xs"
          onClick={copyLink}
        >
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}{" "}
          Copy link
        </Button>
        <Button
          variant="ghost"
          nativeButton={false}
          render={
            <a href="/card/hairnthere-qr.png" download="HairnThere-QR.png" />
          }
          className="h-10 px-3 text-xs"
        >
          <Download aria-hidden="true" /> QR image
        </Button>
      </div>
      <p className="sr-only" role="status">
        {message}
      </p>
      {message.startsWith("Couldn’t") && (
        <p className="mt-2 text-xs text-muted-foreground">{message}</p>
      )}
      <noscript>
        <p className="mt-2 text-xs text-muted-foreground">
          You can scan the code, download the QR image, or open the website
          directly.
        </p>
      </noscript>
    </>
  );
}
