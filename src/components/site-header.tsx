"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRef, useState } from "react"

import { DesktopNav } from "@/components/desktop-nav"
import { Icons } from "@/components/icons"
import { MAIN_NAV } from "@/config/site"
import { cn } from "@/lib/utils"

import { ThemeToggle } from "./theme-toggle"
import { Button } from "./ui/button"

export function SiteHeader({
  width = "default",
}: {
  width?: "default" | "wide"
}) {
  const pathname = usePathname()
  const [menuPath, setMenuPath] = useState<string | null>(null)
  const open = menuPath === pathname
  const trigger = useRef<HTMLButtonElement>(null)
  const wideListing =
    pathname === "/projects" || pathname === "/interaction-design"
  return (
    <header
      data-menu-open={open}
      onKeyDown={(event) => {
        if (open && event.key === "Escape") {
          setMenuPath(null)
          trigger.current?.focus()
        }
      }}
      className={cn(
        "sticky top-0 z-50 max-w-screen overflow-x-hidden bg-background px-2 pt-2"
        // "data-[affix=true]:shadow-[0_0_16px_0_black]/8 dark:data-[affix=true]:shadow-[0_0_16px_0_black]",
        // "not-dark:data-[affix=true]:**:data-header-container:after:bg-border",
        // "transition-shadow duration-300"
      )}
    >
      <div
        data-slot="site-header-container"
        data-width={wideListing ? "projects" : width}
        className="screen-line-before screen-line-after mx-auto flex h-12 items-center justify-between gap-2 border-x border-edge px-2 transition-[max-width] duration-500 ease-in-out after:z-1 after:transition-[background-color] data-[width=projects]:max-w-7xl data-[width=wide]:container motion-reduce:transition-none sm:gap-4 data-[width=default]:md:max-w-3xl"
        data-header-container
      >
        <Link
          className="transition-[scale] ease-out active:scale-[0.98] has-data-[visible=false]:pointer-events-none"
          href="/"
          aria-label="Home"
        >
          <span className="font-bold tracking-tight">TheShipar</span>
        </Link>

        <div className="flex-1" />

        <div className="flex items-center gap-4">
          <DesktopNav items={MAIN_NAV} />
          <Button
            asChild
            size="sm"
            className="group hidden h-8 gap-2 bg-[#25D366] px-3 text-xs font-semibold text-white hover:bg-[#25D366]/90 sm:flex"
          >
            <a
              href="http://wa.me/+8801307607014"
              aria-label="DM me on WhatsApp"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.whatsapp className="size-3.5" />
              <span
                className="flex items-center whitespace-nowrap"
                aria-hidden="true"
              >
                DM me
                <span className="inline-grid grid-cols-[1fr] opacity-100 transition-[grid-template-columns,opacity] duration-300 ease-in-out motion-reduce:transition-none md:grid-cols-[0fr] md:opacity-0 md:group-hover:grid-cols-[1fr] md:group-hover:opacity-100 md:group-focus-visible:grid-cols-[1fr] md:group-focus-visible:opacity-100">
                  <span className="overflow-hidden">
                    <span className="pl-1">on WhatsApp</span>
                  </span>
                </span>
              </span>
            </a>
          </Button>
        </div>

        <div className="flex items-center md:-ml-2">
          <ThemeToggle />
          <Button
            ref={trigger}
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            onClick={() => setMenuPath(open ? null : pathname)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d={open ? "M5 5l14 14M19 5L5 19" : "M3 8h18M3 16h18"} />
            </svg>
          </Button>
        </div>
      </div>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        inert={!open}
      >
        <div className="overflow-hidden">
          <nav
            id="mobile-navigation"
            aria-label="Mobile navigation"
            className="flex flex-col items-end border-x border-b border-edge p-6 text-right text-[22px] leading-[42px]"
          >
            {MAIN_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuPath(null)}
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
