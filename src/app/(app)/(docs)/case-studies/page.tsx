import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "Case Studies",
  description: "Case studies — coming soon.",
  alternates: { canonical: "/case-studies" },
}

export default function CaseStudiesPage() {
  return <ComingSoon title="Case Studies" />
}
