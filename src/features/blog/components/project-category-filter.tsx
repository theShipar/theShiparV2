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
  { label: "E-commerce", value: "e-commerce" },
  { label: "Shopify", value: "shopify" },
  { label: "Webflow Template", value: "webflow template" },
  { label: "WordPress", value: "wordpress" },
  { label: "Concept Design", value: "concept design" },
]

export function ProjectCategoryFilter() {
  const { category: currentCategory, setCategory } = useSearchQuery()

  return (
    <div className="no-scrollbar flex flex-wrap gap-2 overflow-x-auto border-b border-edge px-2 py-3">
      {CATEGORIES.map((category) => {
        const isActive = (currentCategory || "all") === category.value
        const isConceptDesign = category.value === "concept design"

        return (
          <button
            key={category.value}
            onClick={() => setCategory(category.value)}
            className={cn(
              "relative rounded-full border px-3 py-1 text-xs font-medium whitespace-nowrap transition-all",
              isActive
                ? "border-foreground bg-foreground text-background"
                : isConceptDesign
                  ? "border-transparent bg-background text-foreground hover:opacity-80"
                  : "border-edge bg-background text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            {!isActive && isConceptDesign && (
              <span className="absolute inset-0 -z-1 rounded-full bg-linear-to-r from-blue-500 via-purple-500 to-pink-500 p-px">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-background" />
              </span>
            )}
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
