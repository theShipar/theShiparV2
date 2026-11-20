import type { Metadata } from "next"

import { CoverGallery } from "@/components/cover-gallery"

export const metadata: Metadata = {
  title: "Components",
  description: "Interactive cover gallery.",
  alternates: { canonical: "/components" },
}

export default function ComponentsPage() {
  return <CoverGallery />
}
