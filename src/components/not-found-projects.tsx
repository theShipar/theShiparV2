"use client"
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { PostItem } from "@/features/blog/components/post-item"
import type { Doc } from "@/features/doc/types/document"

export function NotFoundProjects({ projects }: { projects: Doc[] }) {
  const viewport = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  useEffect(() => {
    const el = viewport.current
    if (!el) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")
    let frame = 0,
      last = 0,
      until = 0
    const hold = () => {
      until = performance.now() + 5000
    }
    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 50) : 0
      last = now
      if (
        !paused &&
        !reduced.matches &&
        now > until &&
        !el.matches(":hover") &&
        !el.contains(document.activeElement)
      ) {
        el.scrollLeft += dt * 0.035
        if (el.scrollLeft >= el.scrollWidth / 2)
          el.scrollLeft -= el.scrollWidth / 2
      }
      frame = requestAnimationFrame(tick)
    }
    el.addEventListener("touchstart", hold, { passive: true })
    el.addEventListener("wheel", hold, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("touchstart", hold)
      el.removeEventListener("wheel", hold)
    }
  }, [paused])
  const move = (direction: number) => {
    setPaused(true)
    const el = viewport.current
    if (!el) return
    if (direction < 0 && el.scrollLeft === 0) el.scrollLeft = el.scrollWidth / 2
    el.scrollBy({
      left: direction * Math.min(360, window.innerWidth - 40),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    })
  }
  return (
    <div
      className="w-full py-4"
      role="region"
      aria-label="Explore portfolio projects"
      aria-roledescription="carousel"
    >
      <div className="mx-auto mb-4 flex max-w-3xl items-center justify-between gap-3 px-5">
        <p className="font-mono text-xs text-muted-foreground">
          A different path. The same good work.
        </p>
        <div className="flex gap-1">
          <Button
            size="icon-sm"
            variant="outline"
            aria-label="Previous project"
            onClick={() => move(-1)}
          >
            <ArrowLeft />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={paused ? "Play carousel" : "Pause carousel"}
            onClick={() => setPaused(!paused)}
          >
            {paused ? <Play /> : <Pause />}
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label="Next project"
            onClick={() => move(1)}
          >
            <ArrowRight />
          </Button>
        </div>
      </div>
      <div
        ref={viewport}
        className="no-scrollbar flex overflow-x-auto py-3"
        tabIndex={0}
        aria-label="Swipe or scroll to browse projects"
      >
        {[0, 1].map((copy) => (
          <div
            key={copy}
            className="flex shrink-0 items-start gap-4 px-2"
            inert={copy === 1 ? true : undefined}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {projects.map((project) => (
              <div
                key={project.slug}
                className="w-[min(340px,calc(100vw-40px))] shrink-0 rounded-2xl border border-edge bg-background transition-colors hover:border-foreground/30"
              >
                <PostItem post={project} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
