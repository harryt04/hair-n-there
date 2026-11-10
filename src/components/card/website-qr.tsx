import Image from "next/image";
import { business } from "@/data/business";

/** Includes a four-module white quiet zone. Never crop, tint or overlay the QR. */
export function WebsiteQr({ className }: { className?: string }) {
  return (
    <Image
      src="/card/hairnthere-qr.svg"
      width={370}
      height={370}
      unoptimized
      loading="eager"
      fetchPriority="high"
      alt={`Scan to visit HairnThere at ${business.cardWebsiteLabel}`}
      className={className}
    />
  );
}
