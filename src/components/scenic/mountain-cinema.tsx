"use client";

import { useEffect, useRef } from "react";
import { CinemaLandscape, OutbackArtwork } from "./cinema-art";
import { useCinemaVisit } from "./cinema-visit";
import styles from "./mountain-cinema.module.css";

const route = "M180 254Q310 222 520 255T820 267";
const clamp = (value: number) => Math.min(1, Math.max(0, value));

/** Decorative Mountain Cinema; the complete page works with a parked car and no JS. */
export function MountainCinema() {
  const variant = useCinemaVisit();
  const root = useRef<HTMLDivElement>(null);
  const path = useRef<SVGPathElement>(null);
  const car = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const banner = root.current;
    const road = path.current;
    const vehicle = car.current;
    if (!banner || !road || !vehicle) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const length = road.getTotalLength();
    const points = Array.from({ length: 401 }, (_, index) => {
      const point = road.getPointAtLength((length * index) / 400);
      return { x: point.x, y: point.y };
    });
    const layers = ["far", "near", "neighborhood"].map((layer) =>
      banner.querySelector<SVGGElement>(`[data-layer="${layer}"]`),
    );
    const wheels = vehicle.querySelectorAll<SVGGElement>("[data-wheel]");
    const orb = banner.querySelector<SVGEllipseElement>("[data-orb]");
    let maximum = 1;
    let width = 0;
    let height = 0;
    let carHeight = 0;
    let frame = 0;
    let disposed = false;

    const draw = () => {
      frame = 0;
      if (disposed) return;
      const progress = reduced.matches ? 0 : clamp(window.scrollY / maximum);
      const sample = progress * 400;
      const index = Math.min(399, Math.floor(sample));
      const fraction = sample - index;
      const before = points[index];
      const after = points[index + 1];
      const x = ((before.x + (after.x - before.x) * fraction) / 1000) * width;
      const y =
        ((before.y + (after.y - before.y) * fraction) / 300) * height -
        (48 / 180) * carHeight;
      const slope =
        (Math.atan2(
          ((after.y - before.y) * height) / 300,
          ((after.x - before.x) * width) / 1000,
        ) *
          180) /
        Math.PI;
      const lean =
        variant === "night-shift" ? 0 : Math.max(-4, Math.min(4, slope));
      vehicle.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%) rotate(${lean}deg)`;
      layers.forEach((layer, index) =>
        layer?.setAttribute(
          "transform",
          `translate(${-progress * [70, 150, 180][index]} 0)`,
        ),
      );
      wheels.forEach((wheel) =>
        wheel.setAttribute("transform", `rotate(${progress * 1080})`),
      );
    };
    const schedule = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(draw);
    };
    const measure = () => {
      const bounds = banner.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      carHeight = Number.parseFloat(getComputedStyle(vehicle).height);
      maximum = Math.max(
        1,
        document.documentElement.scrollHeight - innerHeight,
      );
      if (orb) {
        orb.setAttribute("rx", String(((height * 0.13) / width) * 1000));
        orb.setAttribute("ry", "39");
      }
      banner.dataset.measured = "true";
      schedule();
    };
    const onScroll = () => {
      if (!reduced.matches) schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    observer.observe(banner);
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
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pageshow", measure);
      reduced.removeEventListener("change", schedule);
      delete banner.dataset.measured;
      vehicle.style.removeProperty("transform");
    };
  }, [variant]);

  return (
    <div
      ref={root}
      className={styles.banner}
      data-cinema-variant={variant}
      aria-hidden="true"
    >
      <svg
        className={styles.landscape}
        viewBox="0 0 1000 300"
        preserveAspectRatio="none"
        focusable="false"
      >
        <CinemaLandscape variant={variant} />
        <path
          d="M-200 279Q220 206 520 255T1200 258"
          fill="none"
          stroke="var(--cinema-road)"
          strokeWidth="28"
        />
        <path
          ref={path}
          d={route}
          fill="none"
          stroke="var(--cinema-stripe)"
          strokeWidth="1.6"
          strokeDasharray="10 13"
        />
      </svg>
      <svg
        ref={car}
        className={styles.car}
        viewBox="-135 -95 270 180"
        focusable="false"
      >
        <OutbackArtwork variant={variant} />
      </svg>
      <span className={styles.caption}>
        {variant === "alpine-local"
          ? "Suncrest / Mountain roots. Personal hair."
          : variant === "night-shift"
            ? "Last chair. Next chapter."
            : "Powder days / Great Hair Travels."}
      </span>
    </div>
  );
}
