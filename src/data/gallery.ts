import inventory from "./instagram-posts.json";

/** Elisabeth's work from her prior account; original captions remain in the inventory. */
export const gallery = inventory.posts
  .filter((post) => post.websiteSelected && post.assets[0]?.src)
  .map((post) => ({
    id: post.id,
    src: post.assets[0].src!,
    width: "width" in post.assets[0] ? (post.assets[0].width ?? 4) : 4,
    height: "height" in post.assets[0] ? (post.assets[0].height ?? 5) : 5,
    alt: post.alt,
    label: post.label,
    sourceUrl: post.sourceUrl,
    caption: post.originalCaption,
    kind: post.kind,
    photoCount: post.assets.length,
  }));
