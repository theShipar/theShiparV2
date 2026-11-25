import "./gallery.css"

import { VibeGallery } from "./vibe-gallery"

export const metadata = {
  title: "VibeCodes",
  alternates: { canonical: "/vibecodes" },
}

export default function VibeCodesPage() {
  return <VibeGallery />
}
