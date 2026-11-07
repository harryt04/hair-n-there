import Image from "next/image";
import { ArrowUpRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstagramLink } from "@/components/site/instagram-link";
import { business } from "@/data/business";
import { CarouselItem } from "@/components/ui/carousel";
import { PortfolioCarousel } from "./portfolio-carousel";
import { gallery } from "@/data/gallery";
import styles from "./instagram-gallery.module.css";

/** First-party images stay visible without an Instagram embed, cookie prompt, or JS. */
export function InstagramGallery() {
  return (
    <section
      id="instagram"
      className={`site-container ${styles.gallery}`}
      aria-labelledby="instagram-heading"
    >
      <div className={styles.heading}>
        <div>
          <p className="eyebrow">01 / On Instagram</p>
          <h2 id="instagram-heading">
            <InstagramLink href={business.instagramUrl}>
              @hairnthere <ArrowUpRight aria-hidden="true" />
            </InstagramLink>
          </h2>
        </div>
        <Button
          nativeButton={false}
          render={<InstagramLink href={business.instagramUrl} />}
          variant="outline"
          className="h-11 gap-2 rounded-sm px-3 text-xs"
          aria-label="Open @hairnthere on Instagram"
        >
          <Camera aria-hidden="true" />{" "}
          <span className="hidden sm:inline">Open Instagram</span>
        </Button>
      </div>
      <p className={styles.notice}>
        Hair by Elisabeth, from her @justbeyou_hair portfolio. Follow her next
        chapter at @hairnthere. Swipe or use the arrows to explore.
      </p>
      <PortfolioCarousel count={gallery.length}>
        {gallery.map((image, index) => (
          <CarouselItem
            key={image.id}
            className={styles.slide}
            aria-label={`${index + 1} of ${gallery.length}: ${image.label}`}
          >
            <figure>
              <InstagramLink
                href={image.sourceUrl}
                className={styles.photo}
                aria-label={`View ${image.label} on Elisabeth’s original Instagram post${image.kind === "reel" ? " (reel)" : ""}.`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  // Account for object-fit: contain inside the 4:5 frame.
                  sizes={`(max-width: 767px) ${82 * Math.min(1, image.width / image.height / 0.8)}vw, (max-width: 904px) ${42 * Math.min(1, image.width / image.height / 0.8)}vw, ${380 * Math.min(1, image.width / image.height / 0.8)}px`}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  className={styles.image}
                />
              </InstagramLink>
              <figcaption>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{image.label}</span>
                <ArrowUpRight aria-hidden="true" />
              </figcaption>
              <p className={styles.caption}>{image.caption}</p>
              <p className={styles.mediaType}>
                {image.kind === "reel"
                  ? "Reel cover · watch on Instagram"
                  : `${image.photoCount} photos · view original post`}
              </p>
            </figure>
          </CarouselItem>
        ))}
      </PortfolioCarousel>
      <div className={styles.footer}>
        <p>Mountain roots. Your kind of beautiful.</p>
        <InstagramLink
          href={business.instagramUrl}
          className="inline-flex items-center gap-2 text-xs font-medium text-primary hover:underline"
        >
          Follow @hairnthere{" "}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </InstagramLink>
      </div>
    </section>
  );
}
