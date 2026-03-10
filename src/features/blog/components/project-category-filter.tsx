"use client"

import { cn } from "@/lib/utils"

import { useSearchQuery } from "../hooks/use-search-query"

const CATEGORIES = [
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
]

export function ProjectCategoryFilter() {
  const { category: currentCategory, setCategory } = useSearchQuery()

  return (
    <div className="no-scrollbar flex flex-wrap gap-2 overflow-x-auto border-b border-edge px-2 py-3">
      {CATEGORIES.map((category) => {
        const isActive = (currentCategory || "all") === category.value
        return (
          <button
            key={category.value}
            onClick={() => setCategory(category.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-colors",
              isActive
                ? "border-foreground bg-foreground text-background"
                : "border-edge bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
