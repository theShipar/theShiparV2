"use client"

import { usePathname } from "next/navigation"

import { Nav } from "@/components/nav"
import type { NavItem } from "@/types/nav"

export function DesktopNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname()

  return (
    <Nav
      className="gap-5 max-md:hidden [&_a]:py-3 [&_a]:text-xs [&_a]:whitespace-nowrap"
      items={items}
      activeId={pathname}
    />
  )
}
