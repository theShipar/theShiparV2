"use client"

import { gsap } from "gsap"
import { useEffect, useRef, useState } from "react"

const projects = [
  {
    name: "Packaging Automation",
    src: "/vibecodes/packaging.mp4",
    poster: "/vibecodes/frame-1.jpg",
    ratio: 1.6,
    live: "https://packaging-automation.vercel.app/production",
  },
  {
    name: "Portos",
    src: "/vibecodes/portos.mp4",
    poster: "/vibecodes/portos.jpg",
    ratio: 1848 / 1080,
    live: "https://portos-os.vercel.app/ops/earth",
  },
]

export function VibeGallery() {
  const rail = useRef<HTMLDivElement>(null)
  const stack = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [current, setCurrent] = useState(0)
  const [opened, setOpened] = useState<number | null>(null)
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [failed, setFailed] = useState(false)
  function select(slot: number) {
    const el = rail.current!
    el.scrollTo({
      [el.clientWidth < 768 ? "left" : "top"]:
        slot * el.clientWidth * (el.clientWidth < 768 ? 0.82 : 0.24),
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    })
  }

  useEffect(() => {
    const el = rail.current!
    const cards = Array.from(stack.current!.children) as HTMLElement[]
    let width = 0
    const motion = { position: 0 }
    let tween: gsap.core.Tween | undefined
    function update() {
      const mobile = el.clientWidth < 768
      const axis = mobile ? "scrollLeft" : "scrollTop"
      const step = el.clientWidth * (mobile ? 0.82 : 0.24)
      if (!step) return
      const resized = width !== el.clientWidth
      width = el.clientWidth
      if (resized) el[axis] = motion.position * step
      const target = gsap.utils.clamp(0, 1, el[axis] / step)
      tween?.kill()
      tween = gsap.to(motion, {
        position: target,
        duration:
          resized || matchMedia("(prefers-reduced-motion: reduce)").matches
            ? 0
            : 0.24,
        ease: "back.out(0.65)",
        onUpdate: draw,
      })
    }
    function draw() {
      const mobile = width < 768
      const position = motion.position
      const gap = Math.max(8, width * 0.009)
      const cardWidth = mobile
        ? width * 0.84
        : Math.min(width * 0.63, el.clientHeight * 1.25)
      const t = gsap.utils.clamp(0, 1, position)
      const widths = [1 - t, t].map(
        (focus) => cardWidth * (0.65 + 0.35 * focus)
      )
      const extents = widths.map((w, i) => (mobile ? w : w / projects[i].ratio))
      const stride = (extents[0] + extents[1]) / 2 + gap
      const center = (mobile ? width : el.clientHeight) / 2
      cards.forEach((card, i) => {
        const y = center + (i - position) * stride - extents[i] / 2
        card.style.width = widths[i] + "px"
        card.style.aspectRatio = String(projects[i].ratio)
        card.style.transform = mobile
          ? `translate(${y}px, -50%)`
          : `translate(-50%, ${y}px)`
      })
      setCurrent(Math.round(position))
    }
    const resize = new ResizeObserver(update)
    resize.observe(el)
    el.addEventListener("scroll", update)
    let settle: ReturnType<typeof setTimeout>
    function snap() {
      clearTimeout(settle)
      settle = setTimeout(() => {
        const mobile = width < 768
        const step = width * (mobile ? 0.82 : 0.24)
        select(Math.round((mobile ? el.scrollLeft : el.scrollTop) / step))
      }, 150)
    }
    el.addEventListener("scroll", snap)
    update()
    return () => {
      tween?.kill()
      clearTimeout(settle)
      el.removeEventListener("scroll", snap)
      resize.disconnect()
      el.removeEventListener("scroll", update)
    }
  }, [])
  useEffect(() => {
    if (opened !== null) dialog.current?.showModal()
  }, [opened])
  const active = current
  return (
    <section className="vibe-stage" aria-label="VibeCodes projects">
      <div
        className="vibe-rail"
        ref={rail}
        data-lenis-prevent
        tabIndex={0}
        aria-label="Scroll through projects"
        onKeyDown={(e) => {
          if (
            ["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)
          ) {
            e.preventDefault()
            select(
              current + (["ArrowDown", "ArrowRight"].includes(e.key) ? 1 : -1)
            )
          }
        }}
      >
        <div className="vibe-window" ref={stack}>
          {projects.map((p, i) => (
            <button
              key={i}
              className="vibe-slide"
              aria-label={"View " + p.name}
              tabIndex={i === current ? 0 : -1}
              aria-hidden={i !== current || undefined}
              onClick={() => {
                if (i === current) setOpened(i)
                else select(i)
              }}
              onPointerMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect()
                e.currentTarget.style.setProperty(
                  "--x",
                  e.clientX - r.left + "px"
                )
                e.currentTarget.style.setProperty(
                  "--y",
                  e.clientY - r.top + "px"
                )
              }}
              data-active={i === current}
            >
              <span className="vibe-number">({i + 1})</span>
              <span
                className="vibe-media"
                style={{ backgroundImage: "url(" + p.poster + ")" }}
              >
                {i === current && opened === null && (
                  <video
                    src={p.src}
                    poster={p.poster}
                    muted
                    loop
                    autoPlay
                    playsInline
                    onLoadedMetadata={(e) => {
                      e.currentTarget.currentTime = 0
                    }}
                  />
                )}
              </span>
              <span className="vibe-caption">{p.name}</span>
              <span className="vibe-cursor">View</span>
            </button>
          ))}
        </div>
        <div className="vibe-travel" aria-hidden="true" />
      </div>
      <nav className="vibe-index" aria-label="Choose project">
        {projects.map((p, i) => (
          <button
            key={p.name}
            aria-current={active === i ? "true" : undefined}
            onClick={() => select(i)}
          >
            {p.name}
          </button>
        ))}
      </nav>
      <dialog
        ref={dialog}
        className="interaction-viewer"
        aria-label="Project video"
        onClose={() => {
          setOpened(null)
          setReady(false)
          setFailed(false)
          setProgress(0)
        }}
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close()
        }}
      >
        {opened !== null && (
          <>
            {!ready && !failed && (
              <div className="grid h-28 w-56 place-items-center">
                <span className="particle-count" role="status">
                  {progress}%
                </span>
              </div>
            )}
            {failed && <p role="alert">Video could not load.</p>}
            {(ready || failed) && (
              <>
                {" "}
                <button
                  type="button"
                  onClick={() => dialog.current?.close()}
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
                <a
                  href={projects[opened].live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-full left-0 mb-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background"
                >
                  View live ↗
                </a>
              </>
            )}
            <video
              aria-label={projects[opened].name}
              src={projects[opened].src}
              muted
              loop
              style={{ display: ready ? "block" : "none" }}
              onCanPlayThrough={() => setReady(true)}
              onError={() => setFailed(true)}
              onProgress={({ currentTarget: v }) => {
                if (v.buffered.length && v.duration)
                  setProgress(
                    Math.round(
                      (100 * v.buffered.end(v.buffered.length - 1)) / v.duration
                    )
                  )
              }}
              autoPlay
              playsInline
              onLoadedMetadata={(e) => {
                e.currentTarget.currentTime = 0
              }}
            />
          </>
        )}
      </dialog>
    </section>
  )
}
