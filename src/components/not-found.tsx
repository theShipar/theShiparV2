import { ArrowRight } from "lucide-react"
import Link from "next/link"

import { Icons } from "@/components/icons"
import { NotFoundProjects } from "@/components/not-found-projects"
import { getAllDocs } from "@/features/doc/data/documents"
import { cn } from "@/lib/utils"

export function NotFound({ className }: { className?: string }) {
  const projects = getAllDocs()
  return (
    <section
      data-not-found
      className={cn(
        "relative flex min-h-[calc(100svh-5.5rem)] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_top,var(--muted),transparent_65%)] py-8 pb-32",
        className
      )}
    >
      <NotFoundProjects
        projects={projects.map((project) => ({ ...project, content: "" }))}
      />
      <div className="mx-auto max-w-xl px-6 pt-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tighter sm:text-7xl">
          404 <span className="text-muted-foreground">Error</span>
        </h1>
        <h2 className="mt-6 text-xl font-medium tracking-tight text-balance sm:text-3xl">
          The problem isn’t you. It’s the flow.
        </h2>
        <p className="mt-3 text-sm text-muted-foreground sm:text-base">
          Let’s get you back to where you belong.
        </p>
      </div>
      <nav
        aria-label="Page recovery"
        className="fixed inset-x-0 bottom-0 z-50 p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))]"
      >
        <div className="mx-auto flex max-w-[380px] gap-0.5 rounded-[18px] bg-foreground/10 p-0.5 backdrop-blur-md">
          <a
            href="https://wa.me/+8801307607014"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 min-w-0 flex-[1.4] items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-2 text-[clamp(11px,3.4vw,14px)] font-bold text-white"
          >
            <Icons.whatsapp className="size-5 shrink-0" />
            Dm me on WhatsApp
          </a>
          <Link
            href="/"
            className="flex h-12 min-w-0 flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-2 text-[clamp(11px,3.4vw,14px)] font-medium text-[#09090b]"
          >
            Go to Home
            <ArrowRight className="size-4 shrink-0" />
          </Link>
        </div>
      </nav>
    </section>
  )
}
