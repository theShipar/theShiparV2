"use client"

import { ArrowUpRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import covers from "@/features/component-gallery/components.json"

export function CoverGallery() {
  const [active, select] = useState(1)
  const drag = useRef<{ id: number; x: number } | null>(null)
  const dragged = useRef(false)

  const gallery = useRef<HTMLElement>(null)
  useEffect(() => {
    function navigate(event: KeyboardEvent) {
      if (
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.defaultPrevented
      )
        return
      if (
        event.target !== document.body &&
        !gallery.current?.contains(event.target as Node)
      )
        return
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
      event.preventDefault()
      const direction = event.key === "ArrowRight" ? 1 : -1
      select((index) =>
        Math.max(0, Math.min(covers.length - 1, index + direction))
      )
    }
    window.addEventListener("keydown", navigate)
    return () => window.removeEventListener("keydown", navigate)
  }, [])

  return (
    <section
      ref={gallery}
      aria-label="Components cover gallery"
      className="[container-type:inline-size] relative flex h-[calc(100svh-11rem)] min-h-72 touch-pan-y items-center justify-center overflow-hidden bg-[radial-gradient(var(--pattern-foreground)_1px,transparent_0)] bg-size-[10px_10px] bg-center [--pattern-foreground:var(--color-zinc-950)]/5 sm:h-[calc(100svh-14rem)] dark:[--pattern-foreground:var(--color-white)]/5"
      onPointerDown={(event) => {
        if (!event.isPrimary || event.button !== 0) return
        dragged.current = false
        if ((event.target as Element).closest("a")) return
        drag.current = { id: event.pointerId, x: event.clientX }
        ;(event.target as Element).setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        const gesture = drag.current
        if (!gesture || gesture.id !== event.pointerId) return
        const step = Math.max(34, event.currentTarget.clientWidth / 9)
        const delta = Math.trunc((gesture.x - event.clientX) / step)
        if (!delta) return
        dragged.current = true
        gesture.x -= delta * step
        select((index) =>
          Math.max(0, Math.min(covers.length - 1, index + delta))
        )
      }}
      onLostPointerCapture={() => {
        drag.current = null
      }}
    >
      {covers.map(({ name, slug }, i) => {
        const video = `/component-videos/${encodeURIComponent(name)}.mp4`
        const offset = i - active
        const depth = Math.abs(offset)
        return (
          <div
            key={name}
            className="absolute top-[39%] aspect-square w-[min(69cqw,48svh)] -translate-y-1/2 cursor-pointer transition-[transform,opacity] duration-500 ease-out motion-reduce:transition-none sm:top-[40%] sm:w-[min(54cqw,46svh)]"
            style={{
              zIndex: covers.length - depth,
              transform: `perspective(850px) translateX(calc(${Math.sign(offset) * (depth ? 82 + (depth - 1) * 57 : 0)}% + ${offset * 40}px)) rotateY(${-Math.sign(offset) * Math.min(depth * 26, 55)}deg) rotateZ(${Math.sign(offset) * Math.min(depth * 7, 15)}deg) scale(${depth ? 0.57 / (1 + (depth - 1) * 0.18) : 1})`,
            }}
          >
            <button
              className="block size-full cursor-grab active:cursor-grabbing"
              aria-label={name}
              aria-pressed={i === active}
              onFocus={(event) => {
                if (event.currentTarget.matches(":focus-visible")) select(i)
              }}
              onClick={(event) => {
                if (!event.detail || !dragged.current) select(i)
              }}
            >
              <span
                onPointerMove={(event) => {
                  if (depth || event.pointerType !== "mouse") return
                  const rect =
                    event.currentTarget.parentElement!.getBoundingClientRect()
                  event.currentTarget.style.setProperty(
                    "--rx",
                    (0.5 - (event.clientY - rect.top) / rect.height) * 34 +
                      "deg"
                  )
                  event.currentTarget.style.setProperty(
                    "--ry",
                    ((event.clientX - rect.left) / rect.width - 0.5) * 40 +
                      "deg"
                  )
                }}
                onPointerLeave={(event) => {
                  event.currentTarget.style.removeProperty("--rx")
                  event.currentTarget.style.removeProperty("--ry")
                }}
                className="relative block size-full overflow-hidden rounded-[5px] transition-transform duration-150 after:pointer-events-none after:absolute after:inset-0 after:rounded-[5px] after:border after:border-white/5 motion-reduce:transform-none!"
                style={{
                  transform: depth
                    ? undefined
                    : "perspective(540px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg))",
                  backdropFilter: depth ? "blur(10px)" : undefined,
                }}
              >
                <video
                  src={video}
                  muted
                  autoPlay
                  loop
                  playsInline
                  aria-hidden="true"
                  style={{ opacity: depth ? 0.6 : 1 }}
                  className="size-full bg-black object-contain transition-opacity duration-500"
                />
              </span>
            </button>
            <div
              aria-hidden={depth !== 0}
              className={`absolute inset-x-0 top-full flex justify-center pt-4 transition-opacity duration-300 motion-reduce:transition-none ${depth ? "pointer-events-none opacity-0" : "opacity-100"}`}
            >
              <a
                href={`/components/${slug}`}
                tabIndex={depth ? -1 : 0}
                className="group inline-flex items-center gap-2 font-medium underline-offset-4 hover:underline focus-visible:underline"
              >
                {name}
                <span className="grid size-5 place-items-center rounded-full bg-foreground text-background">
                  <ArrowUpRight
                    aria-hidden="true"
                    size={14}
                    className="transition-transform duration-200 group-hover:rotate-45 group-focus-visible:rotate-45 motion-reduce:transition-none"
                  />
                </span>
              </a>
            </div>
          </div>
        )
      })}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 aspect-[782/60] backdrop-blur-[0.9cqw]"
        style={{ clipPath: "url(#coming-soon-backdrop)" }}
      />
      <svg
        viewBox="0 0 782 60"
        role="img"
        aria-label="More coming soon"
        className="pointer-events-none absolute inset-x-0 bottom-0 w-full font-sans text-zinc-950 select-none dark:text-white"
      >
        <defs>
          <linearGradient id="coming-soon-fill" x2="0" y2="1">
            <stop stopColor="currentColor" stopOpacity=".14" />
            <stop offset="1" stopColor="#999" stopOpacity="0" />
          </linearGradient>
          <text
            id="coming-soon-letters"
            x="391"
            y="59"
            textAnchor="middle"
            textLength="782"
            lengthAdjust="spacingAndGlyphs"
            fontSize="75.136"
            fontWeight="500"
          >
            MORE COMING SOON
          </text>
          <clipPath id="coming-soon-backdrop" clipPathUnits="objectBoundingBox">
            <use
              href="#coming-soon-letters"
              transform="scale(0.0012787724 0.016666667)"
            />
          </clipPath>
        </defs>
        <use href="#coming-soon-letters" fill="url(#coming-soon-fill)" />
      </svg>
    </section>
  )
}
