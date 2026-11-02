import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "Components",
  description: "Components — coming soon.",
  alternates: { canonical: "/components" },
}

export default function ComponentsPage() {
  return <ComingSoon title="Components" />
}
