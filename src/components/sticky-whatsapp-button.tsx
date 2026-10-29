"use client"

import { ArrowRight, Funnel } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Icons } from "@/components/icons"
import { ProjectCategoryFilter } from "@/features/blog/components/project-category-filter"

import { Button } from "./ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"

export function StickyWhatsAppButton({
  projects,
}: {
  projects: { slug: string; figmaLink?: string }[]
}) {
  const pathname = usePathname()
  const isListing = pathname === "/projects"
  const project = projects.find((p) => pathname === "/projects/" + p.slug)
  const [filterOpen, setFilterOpen] = useState(false)
  const actionClass =
    "h-[45px] min-w-0 flex-1 gap-1 rounded-2xl bg-white px-2 text-[clamp(11px,3.4vw,14px)] font-medium text-[#09090b] hover:bg-white/90"

  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDifference = Math.abs(currentScrollY - lastScrollY.current)

      // Only toggle visibility if scroll difference is significant enough to prevent flickering
      if (scrollDifference > 10) {
        if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
          // Scrolling down
          setIsVisible(false)
        } else {
          // Scrolling up
          setIsVisible(true)
        }
      }
      lastScrollY.current = currentScrollY

      // Reset inactivity timer
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        // Optional: Hide after long inactivity if you want, but user asked for "not touching screen"
        // Let's keep it visible at rest for now as it's more standard.
      }, 3000)
    }

    const handleInteraction = () => {
      setIsVisible(true)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("touchstart", handleInteraction, { passive: true })
    window.addEventListener("mousemove", handleInteraction, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("touchstart", handleInteraction)
      window.removeEventListener("mousemove", handleInteraction)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
            mass: 0.8,
          }}
          className="mobile-project-actions fixed bottom-0 left-0 z-50 w-full p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:hidden"
        >
          <div className="mx-auto flex w-full max-w-[353px] gap-0.5 rounded-[18px] bg-white/10 p-0.5 shadow-lg backdrop-blur-[5px]">
            <Button
              asChild
              size="lg"
              className={
                (project ? "w-[45px] flex-none " : "flex-[1.4] ") +
                "group h-[45px] min-w-0 gap-1.5 rounded-2xl border border-white/20 bg-[#25D366] px-2 text-[clamp(11px,3.6vw,14px)] font-bold text-white transition-all hover:bg-[#25D366]/90 active:scale-[0.97] min-[375px]:gap-2.5 min-[375px]:px-3"
              }
            >
              <a
                href="https://wa.me/+8801307607014"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dm me on WhatsApp"
                className="flex items-center justify-center"
              >
                <Icons.whatsapp className="size-5.5 transition-transform group-hover:scale-110" />
                {!project && <span>Dm me on WhatsApp</span>}
              </a>
            </Button>
            {project?.figmaLink && (
              <Button asChild className={actionClass}>
                <a
                  href={project.figmaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View in Figma{" "}
                  <ArrowRight className="size-4 shrink-0" aria-hidden="true" />
                </a>
              </Button>
            )}
            {isListing ? (
              <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
                <SheetTrigger asChild>
                  <Button className={actionClass + " gap-2"}>
                    <span>Filter Projects</span>
                    <Funnel className="size-4 shrink-0" aria-hidden="true" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="bottom"
                  className="max-h-[80dvh] overflow-y-auto rounded-t-3xl pb-[calc(1rem+env(safe-area-inset-bottom))]"
                >
                  <SheetHeader>
                    <SheetTitle>Filter Projects</SheetTitle>
                    <SheetDescription>
                      Select a category to explore my work.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="px-4">
                    <ProjectCategoryFilter
                      picker
                      onSelect={() => setFilterOpen(false)}
                    />
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <Button asChild className={actionClass}>
                <Link href="/projects">
                  All Projects{" "}
                  {!project && (
                    <ArrowRight
                      className="size-4 shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
