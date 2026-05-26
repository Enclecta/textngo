import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TextnGo - AI Text Formatter and Cleaner",
    short_name: "TextnGo",
    description:
      "AI text formatter, cleaner, grammar fixer, rewriter, and resume optimizer.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#6d28d9",
    orientation: "portrait",
    lang: "en",
    categories: ["productivity", "business", "utilities"],
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
