import "server-only";
import { cacheLife } from "next/cache";
import { z } from "zod";

const mediaSchema = z.object({
  id: z.string(),
  username: z.string(),
  media_type: z.enum(["IMAGE", "VIDEO", "CAROUSEL_ALBUM"]),
  media_url: z.string().optional(),
  thumbnail_url: z.string().optional(),
  permalink: z.string(),
  caption: z.string().optional(),
});

export type InstagramPost = {
  id: string;
  src: string;
  url: string;
  caption: string;
  video: boolean;
};
export type InstagramFeed = {
  status: "ready" | "empty" | "unavailable" | "unconfigured";
  posts: InstagramPost[];
};

function safeUrl(value: string | undefined, media: boolean): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const hosts = media ? ["cdninstagram.com", "fbcdn.net"] : ["instagram.com"];
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      !hosts.some(
        (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
      )
    )
      return null;
    if (!media && !/^\/(p|reel|tv)\/[\w-]+\/?$/.test(url.pathname)) return null;
    return url.href;
  } catch {
    return null;
  }
}

/** Only public @hairnthere media leaves this server-only cached function. */
export async function getInstagramFeed(): Promise<InstagramFeed> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return { status: "unconfigured", posts: [] };

  try {
    const url = new URL("https://graph.instagram.com/v25.0/me/media");
    url.searchParams.set(
      "fields",
      "id,username,caption,media_type,media_url,thumbnail_url,permalink",
    );
    url.searchParams.set("limit", "24");
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(5000),
      redirect: "error",
    });
    if (!response.ok) return { status: "unavailable", posts: [] };
    const payload = z
      .object({ data: z.array(z.unknown()) })
      .parse(await response.json());
    const posts: InstagramPost[] = [];
    for (const item of payload.data.slice(0, 24)) {
      const result = mediaSchema.safeParse(item);
      if (!result.success) continue;
      const post = result.data;
      // A token for the historical account must never repopulate this gallery.
      if (post.username.toLowerCase() !== "hairnthere") continue;
      const src = safeUrl(
        post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url,
        true,
      );
      const permalink = safeUrl(post.permalink, false);
      if (!src || !permalink || posts.some((entry) => entry.id === post.id))
        continue;
      posts.push({
        id: post.id,
        src,
        url: permalink,
        caption: post.caption?.slice(0, 2200) ?? "",
        video: post.media_type === "VIDEO",
      });
    }
    return {
      status: posts.length
        ? "ready"
        : payload.data.length
          ? "unavailable"
          : "empty",
      posts,
    };
  } catch {
    // Never log provider errors, response bodies, or credentials.
    return { status: "unavailable", posts: [] };
  }
}
