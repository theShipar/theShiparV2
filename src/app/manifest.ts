import type { MetadataRoute } from "next"

import { SITE_INFO } from "@/config/site"

export default function manifest(): MetadataRoute.Manifest {
  return {
    short_name: SITE_INFO.name,
    name: SITE_INFO.name,
    description: SITE_INFO.description,
    icons: [
      {
        src: "/portfolio-previews/shipar-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/portfolio-previews/shipar-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/portfolio-previews/shipar-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
    id: "/?utm_source=pwa",
    start_url: "/?utm_source=pwa",
    display: "standalone",
    scope: "/",
    screenshots: [
      {
        src: "/portfolio-previews/projects-mobile.webp",
        type: "image/webp",
        sizes: "440x956",
        form_factor: "narrow",
        label: "Abtahi Shipar’s design projects",
      },
      {
        src: "/portfolio-previews/components-mobile.webp",
        type: "image/webp",
        sizes: "440x956",
        form_factor: "narrow",
        label: "Interactive component gallery",
      },
      {
        src: "/portfolio-previews/projects-desktop.webp",
        type: "image/webp",
        sizes: "1440x900",
        form_factor: "wide",
        label: "Abtahi Shipar’s desktop project gallery",
      },
    ],
  }
}
