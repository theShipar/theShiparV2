"use client"

import { useHotkeys } from "react-hotkeys-hook"
import { toast } from "sonner"
import { useWebHaptics } from "web-haptics/react"

import { CopyButton } from "@/components/copy-button"
import { Icons } from "@/components/icons"
import { useIsClient } from "@/hooks/use-is-client"
import { trackEvent } from "@/lib/events"
import { copyToClipboardWithEvent } from "@/utils/copy"
import { decodePhoneNumber, formatPhoneNumber } from "@/utils/string"

import {
  IntroItem,
  IntroItemContent,
  IntroItemIcon,
  IntroItemLink,
} from "./intro-item"

type PhoneItemProps = {
  phoneNumber: string
}

export function PhoneItem({ phoneNumber }: PhoneItemProps) {
  const isClient = useIsClient()
  const phoneNumberDecoded = decodePhoneNumber(phoneNumber)
  const phoneNumberFormatted = formatPhoneNumber(phoneNumberDecoded)

  useHotkeys("shift+p", () => {
    copyToClipboardWithEvent(phoneNumberDecoded, {
      name: "copy_phone_number",
      properties: {
        method: "keyboard",
        key: "shift+p",
      },
    })
    toast.success("Phone number copied")
  })

  const { trigger } = useWebHaptics({ debug: true })

  return (
    <IntroItem className="group">
      <IntroItemIcon>
        <Icons.whatsapp />
      </IntroItemIcon>

      <IntroItemContent>
        <IntroItemLink
          href={isClient ? `https://wa.me/${phoneNumberDecoded}` : "#"}
          aria-label={
            isClient
              ? `Chat on WhatsApp with ${phoneNumberFormatted}`
              : "WhatsApp contact"
          }
        >
          {isClient ? phoneNumberFormatted : "[WhatsApp protected]"}
        </IntroItemLink>
      </IntroItemContent>

      <div className="-translate-x-3 opacity-0 transition-opacity ease-out group-hover:opacity-100">
        <CopyButton
          className="rounded-md border-none text-muted-foreground [&_svg:not([class*='size-'])]:size-3.5"
          variant="ghost"
          size="icon-xs"
          text={isClient ? phoneNumberDecoded : "[Phone protected]"}
          onCopySuccess={() => {
            trigger("success")
            trackEvent({
              name: "copy_phone_number",
              properties: {
                method: "button",
              },
            })
          }}
          onCopyError={() => trigger("error")}
        />
      </div>
    </IntroItem>
  )
}
