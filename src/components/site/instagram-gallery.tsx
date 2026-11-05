import Image from "next/image";
import { ArrowUpRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstagramLink } from "@/components/site/instagram-link";
import { business } from "@/data/business";
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
        Follow Elisabeth’s next chapter. These images are stock inspiration, not
        her work; approved portfolio photos are still to come.
      </p>
      <div className={styles.grid}>
        {gallery.map((image, index) => (
          <figure
            key={image.id}
            className={index === 0 ? styles.featured : undefined}
          >
            <InstagramLink
              href={business.instagramUrl}
              className={styles.photo}
              aria-label={`Visit @hairnthere on Instagram. ${image.label}: stock inspiration, not Elisabeth’s work.`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={
                  index === 0
                    ? "(max-width: 767px) calc(100vw - 40px), (max-width: 1279px) 58vw, 690px"
                    : "(max-width: 767px) calc(50vw - 26px), (max-width: 1279px) 38vw, 450px"
                }
                loading={index === 0 ? "eager" : "lazy"}
                className={styles.image}
              />
            </InstagramLink>
            <figcaption>
              <span>0{index + 1}</span>
              <span>Stock inspiration</span>
              <ArrowUpRight aria-hidden="true" />
            </figcaption>
          </figure>
        ))}
      </div>
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
