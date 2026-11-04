import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HairnThere",
    short_name: "HairnThere",
    description: "Great Hair Travels.",
    start_url: "/",
    display: "standalone",
    background_color: "#FBF7F2",
    theme_color: "#4B2E4F",
    icons: [
      { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
