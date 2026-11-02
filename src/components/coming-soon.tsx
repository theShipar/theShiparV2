"use client"

import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particles-typography"

export function ComingSoon({ title }: { title: string }) {
  return (
    <section className="flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center pb-24 [--pattern-foreground:var(--color-zinc-950)]/5 dark:[--pattern-foreground:var(--color-white)]/5">
      <h1 className="font-mono text-sm text-muted-foreground">{title}</h1>
      <div className="h-52 w-full sm:h-72" aria-hidden="true">
        <CursorDrivenParticleTypography
          text="Coming soon"
          fontSize={100}
          particleDensity={4}
          dispersionStrength={25}
          className="h-full min-h-0 mix-blend-difference"
        />
      </div>
      <p className="sr-only">Coming soon</p>
    </section>
  )
}
