"use client"

import { X } from "lucide-react"
import Image from "next/image"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useState } from "react"

import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const SOURCE = "/images/Abtahi Shipar - UI UX Designer - CV.jpg"

export function ResumeViewer() {
  const [zoom, setZoom] = useState(1)
  const [point, setPoint] = useState({ x: 50, y: 0 })
  return (
    <Dialog
      onOpenChange={() => {
        setZoom(1)
        setPoint({ x: 50, y: 0 })
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="block w-full cursor-zoom-in overflow-hidden rounded-xl outline-offset-4 focus-visible:outline-2"
          aria-label="Open resume in full screen"
        >
          <Image
            src={SOURCE}
            alt="Abtahi Shipar - UI/UX Designer CV"
            width={1200}
            height={1697}
            className="h-auto w-full"
            priority
            unoptimized
          />
        </button>
      </DialogTrigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex flex-col px-4 pt-5 pb-20 duration-300 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none">
          <DialogPrimitive.Close
            aria-label="Close resume"
            className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-black/40 text-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-white sm:top-6 sm:right-8"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
          <DialogTitle className="sr-only">Resume</DialogTitle>
          <DialogDescription className="sr-only">
            Desktop: move over the resume to magnify. On mobile, use Zoom in,
            then drag to explore.
          </DialogDescription>
          <div
            role="group"
            aria-label="Resume zoom controls"
            className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-10 flex -translate-x-1/2 items-center gap-0.5 rounded-full bg-black/70 p-1 text-xs text-white shadow-lg backdrop-blur-xl [&_button]:min-h-8 [&_button]:min-w-8 [&_button]:rounded-full [&_button]:border-0 [&_button]:px-2 [&_button]:py-1 [&_button]:whitespace-nowrap [&_button:disabled]:opacity-35 [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-white [&_button:hover]:bg-white/15"
          >
            <button
              className="rounded-lg border px-3 py-2"
              onClick={() => setZoom((value) => Math.max(1, value - 1))}
              disabled={zoom === 1}
              aria-label="Zoom out"
            >
              −
            </button>
            <button
              className="rounded-lg border px-3 py-2"
              onClick={() => setZoom((value) => Math.min(4, value + 1))}
              disabled={zoom === 4}
            >
              Zoom in +
            </button>
            <button
              className="rounded-lg border px-3 py-2"
              onClick={() => {
                setZoom(1)
                setPoint({ x: 50, y: 0 })
              }}
            >
              Fit image
            </button>
            <span
              className="min-w-10 px-1 text-center text-[11px] text-white/70"
              aria-live="polite"
            >
              {zoom * 100}%
            </span>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
            <div
              className="relative h-full max-w-full touch-none overflow-hidden"
              style={{
                aspectRatio: "1200 / 1697",
                cursor: zoom > 1 ? "move" : "zoom-in",
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === "mouse") setZoom(2)
              }}
              onPointerLeave={(event) => {
                if (event.pointerType === "mouse") setZoom(1)
              }}
              onPointerDown={(event) =>
                event.currentTarget.setPointerCapture(event.pointerId)
              }
              onPointerMove={(event) => {
                if (event.pointerType !== "mouse" && !event.buttons) return
                const rect = event.currentTarget.getBoundingClientRect()
                setPoint({
                  x: Math.max(
                    0,
                    Math.min(
                      100,
                      ((event.clientX - rect.left) / rect.width) * 100
                    )
                  ),
                  y: Math.max(
                    0,
                    Math.min(
                      100,
                      ((event.clientY - rect.top) / rect.height) * 100
                    )
                  ),
                })
              }}
            >
              <Image
                src={SOURCE}
                alt="Abtahi Shipar's full resume"
                width={1200}
                height={1697}
                unoptimized
                draggable={false}
                className="h-full w-full object-fill transition-transform duration-150 ease-out select-none motion-reduce:transition-none"
                style={{
                  transform: `scale(${zoom})`,
                  transformOrigin: `${point.x}% ${point.y}%`,
                }}
              />
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
