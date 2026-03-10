import { RssIcon } from "lucide-react"
import Link from "next/link"

import { SITE_INFO, SOURCE_CODE_GITHUB_URL } from "@/config/site"
import { cn } from "@/lib/utils"

import { Icons } from "./icons"

export function SiteFooter({
  width = "default",
}: {
  width?: "default" | "wide"
}) {
  return (
    <footer className="max-w-screen overflow-x-hidden px-2">
      <div
        data-width={width}
        className="screen-line-before mx-auto border-x border-edge pt-4 data-[width=wide]:container data-[width=default]:md:max-w-3xl"
      >
        <p className="mb-4 px-4 text-center font-mono text-sm text-balance text-muted-foreground">
          “Design is not just what it looks like and feels like. Design is how
          it works.” – Steve Jobs
        </p>

        <div className="screen-line-before flex flex-wrap justify-center gap-2 py-3 font-mono text-xs text-muted-foreground sm:hidden">
          <Link
            className="font-medium transition-[color] hover:text-foreground"
            href="/resume"
          >
            Resume
          </Link>

          <span className="opacity-50">•</span>

          <Link
            className="font-medium transition-[color] hover:text-foreground"
            href="/projects"
          >
            Projects
          </Link>

          <span className="opacity-50">•</span>

          <a
            className="font-medium transition-[color] hover:text-foreground"
            href="https://www.behance.net/theshipar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Behance
          </a>

          <span className="opacity-50">•</span>

          <a
            className="font-medium transition-[color] hover:text-foreground"
            href="https://github.com/theshipar"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>

          <span className="opacity-50">•</span>

          <a
            className="font-medium transition-[color] hover:text-foreground"
            href="https://facebook.com/theshipar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Facebook
          </a>

          <span className="opacity-50">•</span>

          <a
            className="font-medium transition-[color] hover:text-foreground"
            href="https://instagram.com/theshipar"
            target="_blank"
            rel="noopener noreferrer"
          >
            Instagram
          </a>
        </div>

        <div className="screen-line-before screen-line-after flex w-full before:z-1 after:z-1">
          <div className="mx-auto flex flex-wrap items-center justify-center gap-3 border-x border-edge bg-background px-4">
            <Link
              className="flex font-mono text-xs font-medium text-muted-foreground transition-[color] hover:text-foreground"
              href="/resume"
            >
              Resume
            </Link>

            <Separator />

            <Link
              className="flex font-mono text-xs font-medium text-muted-foreground transition-[color] hover:text-foreground"
              href="/projects"
            >
              Projects
            </Link>

            <Separator />

            <a
              className="flex font-mono text-xs font-medium text-muted-foreground transition-[color] hover:text-foreground"
              href="https://www.behance.net/theshipar"
              target="_blank"
              rel="noopener noreferrer"
            >
              Behance
            </a>

            <Separator />

            <a
              className="flex font-mono text-xs font-medium text-muted-foreground transition-[color] hover:text-foreground"
              href="https://github.com/theshipar"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>

            <Separator />

            <a
              className="flex font-mono text-xs font-medium text-muted-foreground transition-[color] hover:text-foreground"
              href="https://facebook.com/theshipar"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>

            <Separator />

            <a
              className="flex font-mono text-xs font-medium text-muted-foreground transition-[color] hover:text-foreground"
              href="https://instagram.com/theshipar"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="pb-[env(safe-area-inset-bottom,0px)]">
        <div className="flex h-2" />
      </div>
    </footer>
  )
}

function Separator({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("flex h-11 w-px bg-edge", className)} {...props} />
}
