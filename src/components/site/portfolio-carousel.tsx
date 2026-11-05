"use client";

import { useState, type ReactNode } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import styles from "./instagram-gallery.module.css";

/** Server-rendered portfolio content with shadcn/Embla navigation. */
export function PortfolioCarousel({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  const [api, setApi] = useState<CarouselApi>();
  return (
    <Carousel
      opts={{ align: "start", duration: 0 }}
      setApi={setApi}
      className={styles.carousel}
      data-ready={Boolean(api)}
      aria-label="Elisabeth’s hair portfolio"
      aria-describedby="portfolio-help"
      tabIndex={0}
    >
      <div className={styles.controls}>
        <span id="portfolio-help">Elisabeth’s work · {count} posts</span>
        <CarouselPrevious className="static inset-auto m-0 size-11 rounded-sm" />
        <CarouselNext className="static inset-auto m-0 size-11 rounded-sm" />
      </div>
      <CarouselContent className={styles.track}>{children}</CarouselContent>
    </Carousel>
  );
}
