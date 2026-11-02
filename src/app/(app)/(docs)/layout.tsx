"use client"

import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const isProjects = usePathname() === "/projects"
  return (
    <div
      className={cn(
        "mx-auto border-x border-edge transition-[max-width] duration-500 ease-in-out motion-reduce:transition-none",
        isProjects ? "max-w-7xl" : "md:max-w-3xl"
      )}
    >
      <div
        className={cn(
          "screen-line-after h-8",
          "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
          "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"
        )}
      />

      {children}
    </div>
  )
}
