import Image from "next/image";
import { Suspense } from "react";
import { connection } from "next/server";
import { ArrowUpRight, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstagramLink } from "@/components/site/instagram-link";
import { business } from "@/data/business";
import { PortfolioCarousel, PortfolioSlide } from "./portfolio-carousel";
import { getInstagramFeed } from "@/lib/instagram";
import styles from "./instagram-gallery.module.css";

/** Public posts are server rendered without Instagram embed scripts. */
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
          // Keep the visible "Open Instagram" text inside the accessible name (WCAG 2.5.3).
          aria-label="Open Instagram for @hairnthere"
        >
          <Camera aria-hidden="true" />{" "}
          <span className="hidden sm:inline">Open Instagram</span>
        </Button>
      </div>
      <Suspense fallback={<GalleryEmpty state="loading" />}>
        <InstagramPosts />
      </Suspense>
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

function GalleryEmpty({
  state,
}: {
  state: "loading" | "empty" | "unconfigured" | "unavailable";
}) {
  return (
    <div className={styles.empty}>
      <Camera className={styles.emptyIcon} aria-hidden="true" />
      <p className="eyebrow">A new chapter</p>
      <h3>
        {state === "empty"
          ? "The first post is still to come."
          : "Good hair has a new home."}
      </h3>
      <p>
        {state === "unavailable"
          ? "We couldn’t load the latest posts right now. Visit @hairnthere on Instagram for updates."
          : "Follow @hairnthere for fresh looks, little transformations, and life behind the chair with Elisabeth."}
      </p>
      <InstagramLink href={business.instagramUrl} className={styles.emptyLink}>
        Follow along on Instagram <ArrowUpRight aria-hidden="true" />
      </InstagramLink>
    </div>
  );
}

async function InstagramPosts() {
  // Runtime credentials stay out of prerendering; the surrounding page stays static.
  await connection();
  const feed = await getInstagramFeed();
  if (feed.status !== "ready") return <GalleryEmpty state={feed.status} />;
  return (
    <>
      <p className={styles.notice}>
        The latest from Elisabeth at @hairnthere. Open a post to see more on
        Instagram.
      </p>
      <PortfolioCarousel count={feed.posts.length}>
        {feed.posts.map((post, index) => (
          <PortfolioSlide key={post.id}>
            <InstagramLink
              href={post.url}
              className={styles.photo}
              aria-label={`Open Instagram ${post.video ? "reel" : "post"} ${index + 1} from @hairnthere`}
            >
              <Image
                src={post.src}
                alt={
                  post.caption
                    ? post.caption.slice(0, 180)
                    : `Instagram ${post.video ? "reel cover" : "photo"} from @hairnthere`
                }
                fill
                unoptimized
                loading="lazy"
                referrerPolicy="no-referrer"
                sizes="(max-width: 767px) 82vw, 380px"
                className={styles.image}
              />
            </InstagramLink>
            <figcaption>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>
                {post.video ? "Reel cover · watch on Instagram" : "@hairnthere"}
              </span>
              <ArrowUpRight aria-hidden="true" />
            </figcaption>
            {post.caption && <p className={styles.caption}>{post.caption}</p>}
          </PortfolioSlide>
        ))}
      </PortfolioCarousel>
    </>
  );
}
