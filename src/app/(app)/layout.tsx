import dynamic from "next/dynamic"
import { Suspense } from "react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { StickyWhatsAppButton } from "@/components/sticky-whatsapp-button"
import { getAllDocs } from "@/features/doc/data/documents"

const ScrollToTop = dynamic(() =>
  import("@/components/scroll-to-top").then((mod) => mod.ScrollToTop)
)

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="max-w-screen overflow-x-hidden px-2">{children}</main>
      <SiteFooter />
      <Suspense fallback={null}>
        <StickyWhatsAppButton
          projects={getAllDocs().map((doc) => ({
            slug: doc.slug,
            figmaLink: doc.metadata.figmaLink,
          }))}
        />
      </Suspense>
      <ScrollToTop />
    </>
  )
}
