"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useMediaQuery } from "@/hooks/use-media-query"
import { haptic } from "@/lib/haptic"
import type { NavItem } from "@/types/nav"

export function MobileNavV2({ items }: { items: NavItem[] }) {
  const immersive = usePathname() === "/interaction-design"
  const [open, setOpen] = useState(false)

  const isDesktop = useMediaQuery("(min-width: 48rem)") // sm breakpoint

  const toggleMenuButton = (
    <Button
      data-gallery-menu={immersive || undefined}
      className="group flex touch-manipulation flex-col gap-1 border-none md:hidden data-open:bg-accent"
      variant="ghost"
      size="icon-sm"
      onClick={() => haptic()}
    >
      <span
        aria-hidden="true"
        className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]:translate-y-0.75 group-data-[state=open]:rotate-45"
      />
      <span
        aria-hidden="true"
        className="flex h-0.5 w-4 transform rounded-[1px] bg-foreground transition-transform group-data-[state=open]:-translate-y-0.75 group-data-[state=open]:-rotate-45"
      />
      <span className="sr-only">Toggle Menu</span>
    </Button>
  )

  if (isDesktop) {
    return toggleMenuButton
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{toggleMenuButton}</PopoverTrigger>

      <PopoverContent
        align={immersive ? "end" : "center"}
        className={
          immersive
            ? "w-max rounded-none bg-transparent p-0 text-white shadow-none ring-0"
            : "h-(--radix-popper-available-height) w-(--radix-popper-available-width) rounded-none bg-background px-2 py-0 shadow-none ring-0 data-open:animate-none"
        }
        alignOffset={immersive ? -4 : 0}
        avoidCollisions={!immersive}
        sideOffset={immersive ? 46 : 8}
      >
        <div
          className={
            immersive
              ? "flex flex-col items-end gap-3 text-right [text-shadow:0_1px_5px_rgba(0,0,0,.95)]"
              : "flex h-full flex-col items-center justify-center gap-4 border-x border-edge mask-b-from-80% mask-b-to-100% px-2 py-6"
          }
        >
          {items.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={
                immersive
                  ? "text-[22px] leading-[30px] font-normal"
                  : "text-2xl font-medium"
              }
              onClick={() => setOpen(false)}
            >
              {link.title}
            </Link>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
