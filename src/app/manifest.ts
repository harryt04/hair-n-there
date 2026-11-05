import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HairnThere",
    short_name: "HairnThere",
    description: "Great Hair Travels.",
    id: "/",
    scope: "/",
    lang: "en-US",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7F2",
    theme_color: "#4B2E4F",
    prefer_related_applications: false,
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/brand/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
