import "./gallery.css"

import { InteractionGallery } from "@/components/interaction-gallery"

export const metadata = {
  title: "Interaction Design",
  alternates: { canonical: "/interaction-design" },
}

export default function InteractionDesignPage() {
  return <InteractionGallery />
}
