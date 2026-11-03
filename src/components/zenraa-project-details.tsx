import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Tag } from "@/components/ui/tag"
import { ZenraaProjectImages } from "@/components/zenraa-project-images"
import type { Doc } from "@/features/doc/types/document"

function StripedGap() {
  return (
    <div
      aria-hidden="true"
      className="screen-line-before screen-line-after h-8 w-full bg-[repeating-linear-gradient(315deg,var(--color-edge)_0,var(--color-edge)_1px,transparent_0,transparent_50%)] bg-size-[10px_10px]"
    />
  )
}

export function ZenraaProjectDetails({ doc }: { doc: Doc }) {
  const categories =
    typeof doc.metadata.category === "string"
      ? [doc.metadata.category]
      : (doc.metadata.category ?? [])
  return (
    <>
      <section aria-labelledby="zenraa-title" className="space-y-4 p-4 sm:p-6">
        <h1 id="zenraa-title" className="text-3xl font-semibold tracking-tight">
          {doc.metadata.title}
        </h1>
        <p className="text-base text-muted-foreground sm:text-lg">
          {doc.metadata.description}
        </p>
      </section>
      <section
        aria-label="Project categories"
        className="screen-line-before flex flex-wrap gap-2 p-4 sm:px-6"
      >
        {[...(doc.metadata.tags ?? []), ...categories].map((category) => (
          <Tag key={category}>{category}</Tag>
        ))}
      </section>
      {doc.metadata.figmaLink && (
        <section
          aria-label="Project design file"
          className="screen-line-before screen-line-after p-4 sm:px-6"
        >
          <Button
            asChild
            className="gap-2 bg-white text-black no-underline hover:bg-zinc-100 hover:no-underline"
          >
            <a
              href={doc.metadata.figmaLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icons.figma className="size-4 text-black" />
              View Figma File
            </a>
          </Button>
        </section>
      )}
      <StripedGap />
      <ZenraaProjectImages />
      <StripedGap />
    </>
  )
}
