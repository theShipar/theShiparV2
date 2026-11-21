"use client"

import { gsap } from "gsap"
import { useEffect, useRef, useState } from "react"

const clipCount = 19
const minZoom = 0.78
const maxZoom = 2.2
const clamp = gsap.utils.clamp
type Point = { x: number; y: number }

export function InteractionGallery() {
  const surface = useRef<HTMLCanvasElement>(null)
  const viewer = useRef<HTMLDialogElement>(null)
  const [source, setSource] = useState("")
  const [progress, setProgress] = useState(1)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    if (!source) return
    const video = viewer.current!.querySelector("video")!
    const request = new XMLHttpRequest()
    let objectUrl = ""
    request.open("GET", source)
    request.responseType = "blob"
    request.onprogress = (event) => {
      if (event.lengthComputable && event.total > 0) {
        setProgress(
          Math.max(
            1,
            Math.min(99, Math.floor((100 * event.loaded) / event.total))
          )
        )
      }
    }
    request.onerror = () => setFailed(true)
    request.onload = () => {
      if (request.status !== 200) {
        setFailed(true)
        return
      }
      setProgress(100)
      objectUrl = URL.createObjectURL(request.response)
      video.src = objectUrl
    }
    request.send()
    return () => {
      request.abort()
      video.pause()
      video.removeAttribute("src")
      video.load()
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [source])

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
    let hoverFill = ""
    let border = "",
      background = ""

    function colors() {
      const style = getComputedStyle(canvas)
      border = style.color
      hoverFill = style.getPropertyValue("--tile-hover").trim()
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
      const ratio = Math.min(devicePixelRatio, 2)
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      ctx!.imageSmoothingQuality = "high"
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

    const tiles: {
      x: number
      y: number
      w: number
      h: number
      index: number
    }[] = []
    let tap: Point | null = null
    const order = Array.from({ length: clipCount }, (_, i) => i)
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[order[i], order[j]] = [order[j], order[i]]
    }
    let hover: Point | null = null
    const clearHover = () => {
      hover = null
    }
    const bend = (x: number, y: number) =>
      height / 2 + (y - height / 2) * curvature(x / width)

    const curvature = (fraction: number) => 1 + 0.038 * (2 * fraction - 1) ** 2
    function openAt(x: number, y: number) {
      const flatY = height / 2 + (y - height / 2) / curvature(x / width)
      const tile = tiles.find(
        (t) => x >= t.x && x < t.x + t.w && flatY >= t.y && flatY < t.y + t.h
      )
      if (!tile || !viewer.current) return
      setReady(false)
      setFailed(false)
      setProgress(1)
      setSource(
        `/interaction-design/full/${String(tile.index + 1).padStart(2, "0")}.mp4`
      )
      videos.forEach((v) => v.pause())
      viewer.current.showModal()
    }
    function draw(time: number, delta: number) {
      if (
        viewer.current?.open ||
        !visible ||
        document.hidden ||
        !width ||
        !height
      )
        return
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
      tiles.length = 0
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
          const hoverY = hover
            ? height / 2 + (hover.y - height / 2) / curvature(hover.x / width)
            : 0
          const highlighted =
            hover &&
            hover.x >= x &&
            hover.x < x + w &&
            hoverY >= y &&
            hoverY < y + h
          ctx!.beginPath()
          ctx!.moveTo(x, bend(x, y))
          ctx!.lineTo(x + w, bend(x + w, y))
          ctx!.lineTo(x + w, bend(x + w, y + h))
          ctx!.lineTo(x, bend(x, y + h))
          ctx!.closePath()
          if (highlighted) {
            ctx!.fillStyle = hoverFill
            ctx!.fill()
          }
          ctx!.strokeStyle = border
          ctx!.stroke()
          const index =
            order[(((col + 7 * row) % clipCount) + clipCount) % clipCount]
          tiles.push({ x, y, w, h, index })
          used.add(index)
          const v = player(index)
          if (v.readyState < 2 || !v.videoWidth) continue
          const fit = 0.84 * Math.min(w / v.videoWidth, h / v.videoHeight)
          const dw = v.videoWidth * fit,
            dh = v.videoHeight * fit
          const cx = x + w / 2,
            cy = y + h / 2
          ctx!.save()
          ctx!.translate(cx, bend(cx, cy))
          ctx!.transform(
            1,
            (bend(x + w, cy) - bend(x, cy)) / w,
            0,
            curvature(cx / width),
            0,
            0
          )
          ctx!.drawImage(v, -dw / 2, -dh / 2, dw, dh)
          ctx!.restore()
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
      tap = pointers.size === 1 ? { x: e.clientX, y: e.clientY } : null
      canvas.setPointerCapture(e.pointerId)
      velocity = { x: 0, y: 0 }
      lastMove = e.timeStamp
    }
    function move(e: PointerEvent) {
      hover =
        e.pointerType === "mouse" && !e.buttons
          ? { x: e.offsetX, y: e.offsetY }
          : null
      const old = pointers.get(e.pointerId)
      if (!old) return
      const point = { x: e.clientX, y: e.clientY }
      if (tap && Math.hypot(point.x - tap.x, point.y - tap.y) > 6) tap = null
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
      if (tap && e.type === "pointerup") {
        const rect = canvas.getBoundingClientRect()
        openAt(e.clientX - rect.left, e.clientY - rect.top)
      }
      tap = null
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
      if (e.key === "Enter") openAt(width / 2, height / 2)
      else if (["=", "+", "-"].includes(e.key))
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
    canvas.addEventListener("pointerleave", clearHover)
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
      canvas.removeEventListener("pointerleave", clearHover)
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
    <>
      <canvas
        ref={surface}
        data-lenis-prevent
        tabIndex={0}
        aria-label="Interaction Design video gallery. Drag or use arrow keys to pan. Pinch, scroll the mouse wheel, or use plus and minus to zoom. Press Enter to open the center tile."
        className="interaction-gallery block w-full cursor-grab touch-none bg-background text-edge active:cursor-grabbing"
      />
      <dialog
        ref={viewer}
        className="interaction-viewer"
        aria-label="Interaction video"
        onClick={(event) => {
          if (!ready && event.target === event.currentTarget)
            event.currentTarget.close()
        }}
        onClose={() => {
          setSource("")
          surface.current?.focus()
        }}
      >
        <video
          muted
          autoPlay
          playsInline
          loop
          style={{ display: ready && !failed ? "block" : "none" }}
          onCanPlay={() => setReady(true)}
          onError={() => setFailed(true)}
        />
        {(!ready || failed) && (
          <div className="grid h-28 w-56 place-items-center">
            {failed ? (
              <span role="alert">Video could not load.</span>
            ) : (
              <span
                className="particle-count"
                role="progressbar"
                aria-label="Loading video"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {progress}%
              </span>
            )}
          </div>
        )}
        {(ready || failed) && (
          <button
            type="button"
            onClick={() => viewer.current?.close()}
            aria-label="Close video"
            className="absolute right-0 bottom-full mb-2 grid size-12 place-items-center rounded-full bg-black/50 text-[28px] leading-none text-white backdrop-blur-lg dark:bg-white/50 dark:text-black"
          >
            <svg
              aria-hidden="true"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <path d="m5 5 14 14M19 5 5 19" />
            </svg>
          </button>
        )}
      </dialog>
    </>
  )
}
