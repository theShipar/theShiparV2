"use client"

import { useWebHaptics } from "web-haptics/react"

import type { CopyButtonProps } from "@/components/ui/copy-button-primitive"
import { CopyButton as CopyButtonPrimitive } from "@/components/ui/copy-button-primitive"
import type { Event } from "@/lib/events"
import { trackEvent } from "@/lib/events"

export function CopyButton({
  size = "icon-sm",
  event,
  ...props
}: CopyButtonProps & {
  event?: Event["name"]
}) {
  const { trigger } = useWebHaptics({ debug: true })

  return (
    <CopyButtonPrimitive
      variant="secondary"
      size={size}
      onCopySuccess={(copiedValue) => {
        trigger("success")
        if (event) {
          trackEvent({
            name: event,
            properties: {
              code: copiedValue,
            },
          })
        }
      }}
      onCopyError={() => trigger("error")}
      {...props}
    />
  )
}
