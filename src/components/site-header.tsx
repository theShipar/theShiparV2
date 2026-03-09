import dynamic from "next/dynamic"
import Link from "next/link"

import { DesktopNav } from "@/components/desktop-nav"
import { Icons } from "@/components/icons"
import { NavItemGitHub } from "@/components/nav-item-github"
import { MAIN_NAV } from "@/config/site"
import { cn } from "@/lib/utils"

import { SiteHeaderMark } from "./site-header-mark"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"

const MobileNav = dynamic(() =>
  import("@/components/mobile-nav-v2").then((mod) => mod.MobileNavV2)
)

export function SiteHeader({
  width = "default",
}: {
  width?: "default" | "wide"
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2"
        // "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]",
        // "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
        // "transition-shadow duration-300"
      )}
    >
      <div
        data-slot="site-header-container"
        data-width={width}
        className="screen-line-before screen-line-after mx-auto flex h-12 items-center justify-between gap-2 border-x border-edge px-2 after:z-1 after:transition-[background-color] data-[width=wide]:container sm:gap-4 data-[width=default]:md:max-w-3xl"
        data-header-container
      >
        <Link
          className="transition-[scale] ease-out active:scale-[0.98] has-data-[visible=false]:pointer-events-none"
          href="/"
          aria-label="Home"
        >
          <SiteHeaderMark />
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <DesktopNav items={MAIN_NAV} />
          <Button
            asChild
            size="sm"
            className="hidden h-8 gap-2 bg-[#25D366] px-3 text-xs font-semibold text-white hover:bg-[#25D366]/90 sm:flex"
          >
            <a
              href="http://wa.me/+8801307607014"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.whatsapp className="size-3.5" />
              DM me in Whatsapp
            </a>
          </Button>
        </div>

        <div className="flex items-center">
          <Button
            className="gap-1.5 border-none pr-1.5 pl-2"
            variant="ghost"
            size="sm"
            asChild
          >
            <a
              href="https://figma.com/@theshipar"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.figma className="size-3.5 -translate-y-px" />
              <span className="text-[0.8125rem] text-muted-foreground tabular-nums">
                124
              </span>
            </a>
          </Button>
          <Separator
            orientation="vertical"
            className="mx-2 data-vertical:h-4 data-vertical:self-center"
          />
          <ThemeToggle />
          <MobileNav items={MAIN_NAV} />
        </div>
      </div>
    </header>
  )
}
