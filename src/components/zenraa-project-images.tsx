"use client"

import Image from "next/image"

export function ZenraaProjectImages() {
  return (
    <section
      aria-label="Zenraa landing page design"
      className="w-full overflow-hidden select-none [-webkit-touch-callout:none]"
      onContextMenu={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
      onCopy={(event) => event.preventDefault()}
    >
      {[1, 2, 3, 4, 5].map((slice) => (
        <Image
          key={slice}
          src={`/project-images/zenraa/${slice}.webp`}
          alt={`Zenraa landing page — section ${slice} of 5`}
          width={1920}
          height={slice === 5 ? 641 : 1920}
          sizes="(min-width: 768px) 768px, calc(100vw - 18px)"
          quality={100}
          loading={slice === 1 ? "eager" : "lazy"}
          draggable={false}
          className="pointer-events-none m-0 block h-auto w-full rounded-none border-0 p-0"
        />
      ))}
    </section>
  )
}
