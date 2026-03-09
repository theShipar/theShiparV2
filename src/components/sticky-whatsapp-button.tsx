"use client"

import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"

import { Button } from "./ui/button"

export function StickyWhatsAppButton() {
  return (
    <div className="fixed bottom-0 left-0 z-50 w-full p-4 sm:hidden">
      <Button
        asChild
        size="lg"
        className="h-12 w-full gap-2 rounded-xl bg-[#25D366] text-sm font-semibold text-white shadow-[0_-4px_16px_rgba(0,0,0,0.1)] hover:bg-[#25D366]/90"
      >
        <a
          href="http://wa.me/+8801307607014"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Icons.whatsapp className="size-5" />
          DM me in Whatsapp
        </a>
      </Button>
    </div>
  )
}
