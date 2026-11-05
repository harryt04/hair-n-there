"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Wagon } from "./wagon";
import styles from "./journey-roads.module.css";

// One uninterrupted route, independent of the content's section boundaries.
const route =
  "M90 0C160 250 20 500 90 750S160 1250 90 1500S20 2000 90 2250S160 2750 90 3000";

export function JourneyRoads({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const road = useRef<SVGPathElement>(null);
  const vehicle = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = root.current;
    const path = road.current;
    const car = vehicle.current;
    if (!container || !path || !car) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Cache the route samples and layout. Scroll frames only read scrollY.
    const length = path.getTotalLength();
    const points = Array.from({ length: 601 }, (_, index) =>
      path.getPointAtLength((index / 600) * length),
    );
    let top = 0;
    let height = 0;
    let width = 0;
    let viewport = 0;
    let routeWidth = 0;
    let frame = 0;
    let disposed = false;

    const draw = () => {
      frame = 0;
      if (disposed) return;
      if (reduced.matches) {
        delete container.dataset.moving;
        car.style.removeProperty("transform");
        return;
      }
      container.dataset.moving = "true";
      const scroll = window.scrollY;
      // In the final viewport, ease toward the route's parking spot.
      const arrival = Math.max(
        0,
        Math.min(1, 1 - (top + height - viewport - scroll) / viewport),
      );
      const y = Math.max(
        64,
        Math.min(
          height - 64,
          scroll + viewport * 0.44 - top + arrival * (viewport * 0.56 - 64),
        ),
      );
      const routeY = (y / height) * 3000;
      let low = 0;
      let high = points.length - 1;
      while (high - low > 1) {
        const middle = Math.floor((low + high) / 2);
        if (points[middle].y < routeY) low = middle;
        else high = middle;
      }
      const before = points[low];
      const after = points[high];
      const fraction = Math.max(
        0,
        Math.min(1, (routeY - before.y) / (after.y - before.y)),
      );
      const x =
        width / 2 +
        ((before.x + (after.x - before.x) * fraction) / 180 - 0.5) * routeWidth;
      // Keep the side-view artwork upright; only a small lean follows each bend.
      const lean = Math.max(
        -5,
        Math.min(5, ((after.x - before.x) / (after.y - before.y)) * 20),
      );
      car.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${lean}deg)`;
    };
    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(draw);
    };
    const measure = () => {
      const bounds = container.getBoundingClientRect();
      top = bounds.top + window.scrollY;
      height = bounds.height;
      width = container.querySelector<HTMLElement>(
        "[data-journey-lane]",
      )!.offsetWidth;
      routeWidth = Math.max(0, width - car.offsetWidth - 8);
      viewport = window.innerHeight;
      schedule();
    };
    const onScroll = () => {
      if (!reduced.matches) schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    window.addEventListener("pageshow", measure);
    reduced.addEventListener("change", schedule);
    document.fonts.ready.then(() => {
      if (!disposed) measure();
    });
    measure();
    return () => {
      disposed = true;
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", measure);
      reduced.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
      delete container.dataset.moving;
    };
  }, []);

  return (
    <div ref={root} className={styles.journey}>
      <div className={styles.lane} data-journey-lane aria-hidden="true">
        <svg
          className={styles.road}
          viewBox="0 0 180 3000"
          preserveAspectRatio="none"
          focusable="false"
        >
          <path
            d={route}
            className={styles.shoulder}
            vectorEffect="non-scaling-stroke"
          />
          <path
            ref={road}
            d={route}
            className={styles.dashes}
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <div ref={vehicle} className={styles.vehicle}>
          <svg viewBox="-55 -50 110 85" focusable="false">
            <Wagon />
          </svg>
        </div>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
}
