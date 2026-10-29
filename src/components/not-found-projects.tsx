"use client"

import { Pause, Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import Marquee from "react-fast-marquee"

import { Button } from "@/components/ui/button"
import type { Doc } from "@/features/doc/types/document"

export function NotFoundProjects({ projects }: { projects: Doc[] }) {
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(true)
  const [focused, setFocused] = useState(false)
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener("change", update)
    return () => query.removeEventListener("change", update)
  }, [])
  const rows = [
    projects.filter((_, index) => index % 2 === 0),
    projects.filter((_, index) => index % 2 === 1),
  ]
  return (
    <div
      className="w-full space-y-3 py-4"
      role="region"
      aria-label="Explore portfolio projects"
      aria-roledescription="carousel"
      onFocusCapture={() => setFocused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false)
      }}
    >
      <div className="flex justify-end px-5">
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={paused ? "Play carousel" : "Pause carousel"}
          aria-pressed={paused}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play /> : <Pause />}
        </Button>
      </div>
      {rows.map((row, index) => (
        <Marquee
          key={index}
          direction={index === 0 ? "right" : "left"}
          speed={32}
          gradient={false}
          play={!paused && !reducedMotion && !focused}
          pauseOnHover
          pauseOnClick
          autoFill
        >
          {row.map((project) => (
            <Link
              key={project.slug}
              href={"/projects/" + project.slug}
              aria-label={"View " + project.metadata.title}
              className="mx-1.5 block w-[220px] overflow-hidden rounded-[10px] outline-offset-2 transition-opacity hover:opacity-85 focus-visible:outline-2 focus-visible:outline-ring sm:mx-2 sm:w-[320px]"
            >
              <Image
                src={project.metadata.image || ""}
                alt={project.metadata.title}
                width={1200}
                height={630}
                unoptimized
                className="aspect-1200/630 w-full rounded-[10px] object-cover"
              />
            </Link>
          ))}
        </Marquee>
      ))}
    </div>
  )
}
