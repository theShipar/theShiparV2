"use client"

import "lenis/dist/lenis.css"

import Lenis from "lenis"
import { useEffect } from "react"

export function SmoothScroll() {
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)")
    let scroll: Lenis | undefined
    function configure() {
      scroll?.destroy()
      if (!preference.matches)
        scroll = new Lenis({
          autoRaf: true,
          anchors: true,
          allowNestedScroll: true,
          lerp: 0.12,
        })
    }
    configure()
    preference.addEventListener("change", configure)
    return () => {
      preference.removeEventListener("change", configure)
      scroll?.destroy()
    }
  }, [])
  return null
}
