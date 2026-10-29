"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

import { useSearchQuery } from "../hooks/use-search-query"

export const CATEGORIES = [
  { label: "All", value: "all" },
  { label: "App Design", value: "app design" },
  { label: "SaaS", value: "saas" },
  { label: "Landing Page", value: "landing page" },
  { label: "Website Redesign", value: "website redesign" },
  { label: "B2B", value: "b2b" },
  { label: "AI Platform", value: "ai platform" },
  { label: "Fintech", value: "fintech" },
  { label: "HealthTech", value: "healthtech" },
  { label: "EdTech", value: "edtech" },
  { label: "Game Design", value: "game design" },
  { label: "CyberSecurity", value: "cybersecurity" },
  { label: "E-commerce", value: "e-commerce" },
  { label: "Shopify", value: "shopify" },
  { label: "Webflow Template", value: "webflow template" },
  { label: "WordPress", value: "wordpress" },
  { label: "Marine Industry", value: "marine industry" },
  { label: "Automobile Industry", value: "automobile industry" },
  { label: "Mental Wellbeing", value: "mental wellbeing" },
  { label: "Fitness", value: "fitness" },
  { label: "ERP", value: "erp" },
  { label: "Concept Design", value: "concept design" },
]

export function ProjectCategoryFilter({
  picker = false,
  onSelect,
}: {
  picker?: boolean
  onSelect?: () => void
}) {
  const { category: currentCategory, setCategory } = useSearchQuery()
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (picker || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return
    const el = ref.current
    if (!el) return
    let frame = 0,
      last = 0,
      pauseUntil = 0
    const pause = () => {
      pauseUntil = performance.now() + 4000
    }
    const tick = (time: number) => {
      const delta = last ? Math.min(time - last, 50) : 0
      last = time
      if (
        time > pauseUntil &&
        !el.matches(":hover") &&
        !el.contains(document.activeElement)
      ) {
        el.scrollLeft += delta * 0.025
        if (el.scrollLeft >= el.scrollWidth / 2)
          el.scrollLeft -= el.scrollWidth / 2
      }
      frame = requestAnimationFrame(tick)
    }
    el.addEventListener("touchstart", pause, { passive: true })
    el.addEventListener("wheel", pause, { passive: true })
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener("touchstart", pause)
      el.removeEventListener("wheel", pause)
    }
  }, [picker])
  return (
    <div
      ref={ref}
      aria-label="Project categories"
      className={
        picker
          ? "flex flex-wrap gap-2"
          : "no-scrollbar flex overflow-x-auto border-b border-edge py-3"
      }
    >
      {(picker ? [0] : [0, 1]).map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1 ? true : undefined}
          className={picker ? "contents" : "flex shrink-0 gap-2 px-1"}
        >
          {CATEGORIES.map((category) => (
            <button
              key={category.value}
              tabIndex={copy === 1 ? -1 : 0}
              aria-pressed={currentCategory === category.value}
              onClick={() => {
                void setCategory(category.value)
                onSelect?.()
              }}
              className={cn(
                "shrink-0 rounded-full border px-3 py-2 text-xs font-medium whitespace-nowrap",
                currentCategory === category.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-edge bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {category.label}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
