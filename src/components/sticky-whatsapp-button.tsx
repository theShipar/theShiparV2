"use client"

import { AnimatePresence, motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Icons } from "@/components/icons"

import { Button } from "./ui/button"

export function StickyWhatsAppButton() {
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
          className="fixed bottom-0 left-0 z-50 w-full p-4 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:hidden"
        >
          <Button
            asChild
            size="lg"
            className="group h-13 w-full gap-2.5 rounded-2xl border border-white/20 bg-[#25D366] text-[0.9375rem] font-bold text-white shadow-[0_8px_32px_rgba(37,211,102,0.4)] transition-all hover:bg-[#25D366]/90 active:scale-[0.97]"
          >
            <a
              href="https://wa.me/+8801307607014"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <Icons.whatsapp className="size-5.5 drop-shadow-sm transition-transform group-hover:scale-110" />
              <span>DM me in WhatsApp</span>
            </a>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
