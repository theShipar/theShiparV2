"use client"

import { X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Dialog as DialogPrimitive } from "radix-ui"

import {
  Dialog,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { USER } from "@/features/portfolio/data/user"

import { AvatarElectricEffect } from "./avatar-electric-effect"

const ORIGINAL = "/images/abtahi-shipar-original.jpg"

export function ProfilePortrait() {
  return (
    <Dialog>
      <AvatarElectricEffect>
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label="View Abtahi Shipar's original portrait"
            className="group relative block size-30 overflow-hidden rounded-full ring-1 ring-border ring-offset-2 ring-offset-background outline-offset-4 focus-visible:outline-2 focus-visible:outline-ring sm:size-40"
          >
            <Image
              src={USER.avatar}
              alt="Illustrated portrait of Abtahi Shipar"
              fill
              sizes="(min-width: 640px) 160px, 120px"
              quality={100}
              priority
              className="object-cover"
            />
            <Image
              src={ORIGINAL}
              alt=""
              fill
              sizes="(min-width: 640px) 160px, 120px"
              quality={100}
              priority
              className="scale-[1.025] object-cover opacity-0 blur-[2px] grayscale transition-[filter,opacity,transform] duration-700 ease-in-out group-hover:scale-100 group-hover:opacity-100 group-hover:blur-none group-hover:grayscale-0 group-focus-visible:scale-100 group-focus-visible:opacity-100 group-focus-visible:blur-none group-focus-visible:grayscale-0 motion-reduce:transition-none"
            />
          </button>
        </DialogTrigger>
      </AvatarElectricEffect>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md duration-300 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 motion-reduce:animate-none" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 overflow-y-auto px-5 pt-20 pb-8 duration-300 outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 motion-reduce:animate-none"
          onClick={(event) => {
            if (event.target === event.currentTarget)
              event.currentTarget
                .querySelector<HTMLButtonElement>("[data-portrait-close]")
                ?.click()
          }}
        >
          <DialogPrimitive.Close
            data-portrait-close
            className="absolute top-5 right-5 flex size-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:top-8 sm:right-8"
            aria-label="Close portrait"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
          <DialogTitle className="sr-only">
            Abtahi Shipar&apos;s portrait
          </DialogTitle>
          <Image
            src={ORIGINAL}
            alt="Abtahi Shipar standing beside a railing"
            width={968}
            height={968}
            sizes="(max-width: 640px) 100vw, 680px"
            quality={100}
            className="max-h-[calc(100dvh-14rem)] min-h-0 w-auto max-w-full rounded-xl object-contain"
          />
          <DialogDescription className="shrink-0 text-center text-base text-white/90">
            Are you checking me out! 👀
            <br />
            <DialogPrimitive.Close asChild>
              <Link
                href="/projects"
                className="mt-2 inline-block text-sm text-white/70 underline underline-offset-4 transition-colors hover:text-white"
              >
                Check my works here →
              </Link>
            </DialogPrimitive.Close>
          </DialogDescription>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </Dialog>
  )
}
