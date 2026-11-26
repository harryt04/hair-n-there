"use client";

import { type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselViewport,
} from "@/components/ui/carousel";
import styles from "./instagram-gallery.module.css";

export function PortfolioCarousel({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  return (
    <Carousel aria-label="Instagram posts" slidesPerPage="auto" dragFree>
      <div className={styles.controls}>
        <span id="portfolio-help">
          {count} {count === 1 ? "post" : "posts"} · Swipe or scroll sideways to
          explore
        </span>
        <CarouselPrevious
          className="size-11 rounded-sm"
          aria-label="Previous Instagram posts"
          aria-controls="instagram-posts"
        >
          <ArrowLeft aria-hidden="true" />
        </CarouselPrevious>
        <CarouselNext
          className="size-11 rounded-sm"
          aria-label="Next Instagram posts"
          aria-controls="instagram-posts"
        >
          <ArrowRight aria-hidden="true" />
        </CarouselNext>
      </div>
      <CarouselViewport
        id="instagram-posts"
        className={styles.track}
        role="region"
        aria-label="Posts from @hairnthere"
        aria-describedby="portfolio-help"
        tabIndex={0}
      >
        <CarouselContent className={styles.content} aria-live="off">
          {children}
        </CarouselContent>
      </CarouselViewport>
    </Carousel>
  );
}

export function PortfolioSlide({ children }: { children: ReactNode }) {
  return (
    <CarouselItem
      className={styles.slide}
      render={(props) => (
        // Keep the whole portfolio available in reading order, including off-screen links.
        <figure
          {...props}
          inert={false}
          role={undefined}
          aria-hidden={undefined}
          aria-label={undefined}
          aria-roledescription={undefined}
        />
      )}
    >
      {children}
    </CarouselItem>
  );
}
