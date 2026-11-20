"use client"

import { gsap } from "gsap"
import { useEffect, useRef } from "react"

const clipCount = 19
const minZoom = 0.78
const maxZoom = 2.2
const clamp = gsap.utils.clamp
type Point = { x: number; y: number }

export function InteractionGallery() {
  const surface = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = surface.current!
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const reduced = matchMedia("(prefers-reduced-motion: reduce)")
    const videos = new Map<number, HTMLVideoElement>()
    const pointers = new Map<number, Point>()
    const camera = { x: 0, y: 0, zoom: 1 }
    const target = { ...camera }
    let width = 1,
      height = 1,
      base = 1
    let visible = true,
      previousFrame = 0,
      lastMove = 0
    let velocity = { x: 0, y: 0 }
    let settle: ReturnType<typeof setTimeout>
    let border = "",
      background = ""

    function colors() {
      const style = getComputedStyle(canvas)
      border = style.color
      background = style.backgroundColor
    }
    const theme = new MutationObserver(colors)
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    colors()
    function resize() {
      width = canvas.clientWidth
      height = canvas.clientHeight
      const ratio = Math.min(devicePixelRatio, 1.5)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0)
      base = clamp(185, 345, width / 4)
    }
    const observer = new ResizeObserver(resize)
    observer.observe(canvas)
    resize()

    function player(index: number) {
      let video = videos.get(index)
      if (!video) {
        video = document.createElement("video")
        video.muted = true
        video.loop = true
        video.playsInline = true
        video.src = `/interaction-design/${String(index + 1).padStart(2, "0")}.mp4`
        videos.set(index, video)
      }
      if (video.paused && !video.error) void video.play().catch(() => {})
      return video
    }

    // Compress the outer columns and rows gently, keeping adjacent tile edges shared.
    function project(value: number, span: number) {
      const n = (2 * value) / span - 1
      return (span * (1 + n - 0.035 * Math.pow(clamp(-1, 1, n), 3))) / 2
    }

    function draw(time: number, delta: number) {
      if (!visible || document.hidden || !width || !height) return
      const blend = reduced.matches
        ? 1
        : 1 - Math.exp(-Math.min(delta, 64) / 48)
      const moving =
        Math.abs(camera.x - target.x) +
          Math.abs(camera.y - target.y) +
          Math.abs(camera.zoom - target.zoom) >
        0.0001
      if (!moving && time - previousFrame < 1 / 30) return
      previousFrame = time
      for (const key of ["x", "y", "zoom"] as const)
        camera[key] += (target[key] - camera[key]) * blend
      const size = base * camera.zoom
      const left = camera.x - width / (2 * size),
        top = camera.y - height / (2 * size)
      const used = new Set<number>()
      ctx!.fillStyle = background
      ctx!.fillRect(0, 0, width, height)
      for (
        let row = Math.floor(top - (height * 0.02) / size);
        row < top + (height * 1.02) / size;
        row++
      ) {
        const y = project((row - top) * size, height)
        const h = project((row + 1 - top) * size, height) - y
        for (
          let col = Math.floor(left - (width * 0.02) / size);
          col < left + (width * 1.02) / size;
          col++
        ) {
          const x = project((col - left) * size, width)
          const w = project((col + 1 - left) * size, width) - x
          ctx!.strokeStyle = border
          ctx!.strokeRect(x, y, w, h)
          const index = (((col + 7 * row) % clipCount) + clipCount) % clipCount
          used.add(index)
          const v = player(index)
          if (v.readyState < 2 || !v.videoWidth) continue
          const fit = 0.84 * Math.min(w / v.videoWidth, h / v.videoHeight)
          const dw = v.videoWidth * fit,
            dh = v.videoHeight * fit
          ctx!.drawImage(v, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh)
        }
      }
      videos.forEach((video, index) => {
        if (!used.has(index) && !video.paused) video.pause()
      })
    }
    gsap.ticker.add(draw)
    function pauseHidden() {
      if (!visible || document.hidden) videos.forEach((video) => video.pause())
    }
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      pauseHidden()
    })
    intersection.observe(canvas)
    document.addEventListener("visibilitychange", pauseHidden)

    function zoom(factor: number, point: Point) {
      const rect = canvas.getBoundingClientRect()
      const raw = target.zoom * factor
      const limit = clamp(minZoom, maxZoom, raw)
      const next =
        limit + (reduced.matches ? 0 : clamp(-0.06, 0.12, (raw - limit) * 0.28))
      const shift = (1 / target.zoom - 1 / next) / base
      target.x += (point.x - rect.left - width / 2) * shift
      target.y += (point.y - rect.top - height / 2) * shift
      target.zoom = next
      clearTimeout(settle)
      settle = setTimeout(() => {
        target.zoom = clamp(minZoom, maxZoom, target.zoom)
      }, 120)
    }
    function pan(dx: number, dy: number) {
      target.x += dx / (base * target.zoom)
      target.y += dy / (base * target.zoom)
    }
    function down(e: PointerEvent) {
      if (e.button !== 0) return
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY })
      canvas.setPointerCapture(e.pointerId)
      velocity = { x: 0, y: 0 }
      lastMove = e.timeStamp
    }
    function move(e: PointerEvent) {
      const old = pointers.get(e.pointerId)
      if (!old) return
      const point = { x: e.clientX, y: e.clientY }
      pointers.set(e.pointerId, point)
      const dx = old.x - point.x,
        dy = old.y - point.y
      if (pointers.size === 2) {
        const other = Array.from(pointers.entries()).find(
          ([id]) => id !== e.pointerId
        )![1]
        const before = Math.hypot(old.x - other.x, old.y - other.y)
        pan(dx / 2, dy / 2)
        if (before > 4)
          zoom(Math.hypot(point.x - other.x, point.y - other.y) / before, {
            x: (point.x + other.x) / 2,
            y: (point.y + other.y) / 2,
          })
        velocity = { x: 0, y: 0 }
      } else if (pointers.size === 1) {
        pan(dx, dy)
        const dt = Math.max(8, e.timeStamp - lastMove)
        velocity = { x: dx / dt, y: dy / dt }
      }
      lastMove = e.timeStamp
    }
    function end(e: PointerEvent) {
      if (!pointers.delete(e.pointerId)) return
      if (
        !pointers.size &&
        e.type === "pointerup" &&
        e.timeStamp - lastMove < 80 &&
        !reduced.matches
      )
        pan(
          clamp(-160, 160, velocity.x * 80),
          clamp(-160, 160, velocity.y * 80)
        )
      velocity = { x: 0, y: 0 }
    }
    function wheel(e: WheelEvent) {
      e.preventDefault()
      // Browsers expose both devices as wheel events. Coarse vertical steps
      // usually indicate a mouse wheel; horizontal and fine deltas indicate a trackpad.
      const mouse =
        e.deltaMode !== 0 ||
        (!e.deltaX && Number.isInteger(e.deltaY) && Math.abs(e.deltaY) >= 48)
      if (e.ctrlKey || mouse)
        zoom(
          Math.exp(
            -clamp(-160, 160, e.deltaY * (e.deltaMode === 1 ? 16 : 1)) *
              (e.ctrlKey ? 0.009 : 0.003)
          ),
          { x: e.clientX, y: e.clientY }
        )
      else pan(e.deltaX, e.deltaY)
    }
    function key(e: KeyboardEvent) {
      const rect = canvas.getBoundingClientRect()
      if (["=", "+", "-"].includes(e.key))
        zoom(e.key === "-" ? 0.85 : 1.18, {
          x: rect.left + width / 2,
          y: rect.top + height / 2,
        })
      else if (e.key === "ArrowLeft") pan(-base / 2, 0)
      else if (e.key === "ArrowRight") pan(base / 2, 0)
      else if (e.key === "ArrowUp") pan(0, -base / 2)
      else if (e.key === "ArrowDown") pan(0, base / 2)
      else return
      e.preventDefault()
    }
    canvas.addEventListener("pointerdown", down)
    canvas.addEventListener("pointermove", move)
    canvas.addEventListener("pointerup", end)
    canvas.addEventListener("lostpointercapture", end)
    canvas.addEventListener("wheel", wheel, { passive: false })
    canvas.addEventListener("keydown", key)
    return () => {
      clearTimeout(settle)
      gsap.ticker.remove(draw)
      observer.disconnect()
      intersection.disconnect()
      theme.disconnect()
      document.removeEventListener("visibilitychange", pauseHidden)
      canvas.removeEventListener("pointerdown", down)
      canvas.removeEventListener("pointermove", move)
      canvas.removeEventListener("pointerup", end)
      canvas.removeEventListener("lostpointercapture", end)
      canvas.removeEventListener("wheel", wheel)
      canvas.removeEventListener("keydown", key)
      videos.forEach((v) => {
        v.pause()
        v.removeAttribute("src")
        v.load()
      })
    }
  }, [])
  return (
    <canvas
      ref={surface}
      data-lenis-prevent
      tabIndex={0}
      aria-label="Interaction Design video gallery. Drag or use arrow keys to pan. Pinch, scroll the mouse wheel, or use plus and minus to zoom."
      className="interaction-gallery block w-full cursor-grab touch-none bg-background text-edge active:cursor-grabbing"
    />
  )
}
