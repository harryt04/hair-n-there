"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

/** Load nearby slides, with native lazy images when JavaScript is unavailable. */
export function PortfolioImage(props: ImageProps) {
  const target = useRef<HTMLSpanElement>(null);
  const [nearby, setNearby] = useState(false);

  useEffect(() => {
    if (!target.current) return;
    if (!("IntersectionObserver" in window)) {
      // Older browsers still receive every portfolio photo.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNearby(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setNearby(true);
        observer.disconnect();
      },
      { rootMargin: "200px" },
    );
    observer.observe(target.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <span ref={target} className="absolute inset-0" aria-hidden="true" />
      {nearby && <Image {...props} alt={props.alt} />}
      <noscript>
        <Image {...props} alt={props.alt} />
      </noscript>
    </>
  );
}
