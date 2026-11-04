"use client";

import { useEffect, useRef, type ReactNode } from "react";
import styles from "./scenic.module.css";

type Road = {
  svg: SVGSVGElement;
  path: SVGPathElement;
  car: SVGGElement;
  length: number;
  visible: boolean;
};

/** One coordinator for all decorative bands; content and navigation use normal page scrolling. */
export function JourneyRoads({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!root.current) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const roads: Road[] = Array.from(
      root.current.querySelectorAll<SVGSVGElement>("[data-journey-road]"),
    ).flatMap((svg) => {
      const path = svg.querySelector<SVGPathElement>("[data-route]");
      const car = svg.querySelector<SVGGElement>("[data-car]");
      return path && car
        ? [{ svg, path, car, length: path.getTotalLength(), visible: false }]
        : [];
    });
    let frame = 0;
    const draw = () => {
      frame = 0;
      const viewport = window.innerHeight;
      // Read geometry together before applying any transforms.
      const positions = roads
        .filter((road) => road.visible || reduced.matches)
        .map((road) => {
          const rect = road.svg.getBoundingClientRect();
          const progress = reduced.matches
            ? 0
            : Math.max(
                0,
                Math.min(1, (viewport - rect.top) / (viewport + rect.height)),
              );
          const distance = progress * road.length;
          const point = road.path.getPointAtLength(distance);
          const before = road.path.getPointAtLength(Math.max(0, distance - 2));
          const after = road.path.getPointAtLength(
            Math.min(road.length, distance + 2),
          );
          const rotation = reduced.matches
            ? -12
            : Math.max(
                -24,
                Math.min(
                  24,
                  (Math.atan2(after.y - before.y, after.x - before.x) * 180) /
                    Math.PI,
                ),
              );
          return { road, point, rotation };
        });
      for (const { road, point, rotation } of positions) {
        const mobile = road.svg.classList.contains(styles.mobileRoad);
        road.car.setAttribute(
          "transform",
          `translate(${point.x} ${point.y}) rotate(${rotation})${mobile ? " scale(.58)" : ""}`,
        );
      }
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(draw);
    };
    const onScroll = () => {
      if (!reduced.matches && roads.some((road) => road.visible)) schedule();
    };
    const measure = () => {
      for (const road of roads) road.length = road.path.getTotalLength();
      schedule();
    };
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const road = roads.find(
            (candidate) => candidate.svg === entry.target,
          );
          if (road) road.visible = entry.isIntersecting;
        }
        schedule();
      },
      { rootMargin: "100px 0px" },
    );
    for (const road of roads) observer.observe(road.svg);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure, { passive: true });
    reduced.addEventListener("change", schedule);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      reduced.removeEventListener("change", schedule);
      cancelAnimationFrame(frame);
    };
  }, []);
  return <div ref={root}>{children}</div>;
}
