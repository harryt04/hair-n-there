"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./instagram-gallery.module.css";

/** Native overflow keeps touch, trackpad, scrollbar and no-JS access intact. */
export function PortfolioCarousel({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const update = () => {
      setEdges({
        start: element.scrollLeft <= 1,
        end:
          element.scrollLeft + element.clientWidth >= element.scrollWidth - 1,
      });
      setReady(true);
    };
    update();
    element.addEventListener("scroll", update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", update);
      observer.disconnect();
    };
  }, [count]);
  const move = (direction: number) =>
    track.current?.scrollBy({
      left: direction * track.current.clientWidth * 0.85,
      behavior: "auto",
    });
  return (
    <div className={styles.carousel} data-ready={ready}>
      <div className={styles.controls}>
        <span id="portfolio-help">
          {count} {count === 1 ? "post" : "posts"} · Swipe or scroll sideways to
          explore
        </span>
        <Button
          variant="outline"
          className="size-11 rounded-sm"
          aria-label="Previous Instagram posts"
          aria-controls="instagram-posts"
          disabled={edges.start}
          onClick={() => move(-1)}
        >
          <ArrowLeft aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          className="size-11 rounded-sm"
          aria-label="Next Instagram posts"
          aria-controls="instagram-posts"
          disabled={edges.end}
          onClick={() => move(1)}
        >
          <ArrowRight aria-hidden="true" />
        </Button>
      </div>
      <div
        ref={track}
        id="instagram-posts"
        className={styles.track}
        role="region"
        aria-label="Posts from @hairnthere"
        aria-describedby="portfolio-help"
        tabIndex={0}
      >
        {children}
      </div>
    </div>
  );
}
