"use client"

import { useRef } from "react"

import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particles-typography"
import { cn } from "@/lib/utils"

export function ProfileCover() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={cn(
        "aspect-2/1 border-x border-edge select-none sm:aspect-3/1",
        "flex items-center justify-center text-black dark:text-white",
        "screen-line-before screen-line-after before:-top-px after:-bottom-px",
        "bg-white/0.75 bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 dark:bg-black/0.75 dark:[--pattern-foreground:var(--color-white)]/5"
      )}
    >
      <div
        id="js-cover-mark"
        className="flex h-full w-full items-center justify-center"
      >
        <CursorDrivenParticleTypography
          text="TheShipar"
          fontSize={120}
          particleDensity={4}
          dispersionStrength={25}
          className="h-full min-h-0"
        />
      </div>
    </div>
  )
}
