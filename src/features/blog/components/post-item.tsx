import { ExternalLink, Figma } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { SITE_INFO } from "@/config/site"
import type { Doc } from "@/features/doc/types/document"
import { cn } from "@/lib/utils"

export function PostItem({
  post,
  shouldPreloadImage,
}: {
  post: Doc
  shouldPreloadImage?: boolean
}) {
  return (
    <div
      className={cn(
        "group flex flex-col gap-2 p-2",
        "max-sm:screen-line-before max-sm:screen-line-after",
        "sm:nth-[2n+1]:screen-line-before sm:nth-[2n+1]:screen-line-after"
      )}
    >
      {post.metadata.image && (
        <Link href={`/projects/${post.slug}`} className="block">
          <div className="relative select-none [&_img]:aspect-1200/630 [&_img]:rounded-xl">
            <Image
              src={post.metadata.image}
              alt={post.metadata.title}
              width={1200}
              height={630}
              quality={100}
              priority={shouldPreloadImage}
              unoptimized
            />

            <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-black/10 ring-inset dark:ring-white/10" />
          </div>
        </Link>
      )}

      <div className="flex flex-col gap-2 p-2">
        <div className="flex flex-col gap-1">
          <Link href={`/projects/${post.slug}`} className="hover:underline">
            <h3 className="text-lg leading-snug font-medium text-balance">
              {post.metadata.title}
              {post.metadata.new && (
                <span className="ml-2 inline-block size-2 -translate-y-px rounded-full bg-info">
                  <span className="sr-only">New</span>
                </span>
              )}
            </h3>
          </Link>
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {post.metadata.description}
        </p>

        {post.metadata.category && (
          <div className="flex flex-wrap gap-1.5">
            {(Array.isArray(post.metadata.category)
              ? post.metadata.category
              : [post.metadata.category]
            ).map((cat) => (
              <span
                key={cat}
                className="inline-flex items-center rounded-md border border-edge bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground capitalize"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        <div className="mt-2 flex flex-wrap gap-2">
          {post.metadata.figmaLink && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 px-3 text-xs"
              asChild
            >
              <a
                href={post.metadata.figmaLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Figma className="size-3.5" />
                View in Figma
              </a>
            </Button>
          )}
          {post.metadata.liveLink && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-2 px-3 text-xs"
              asChild
            >
              <a
                href={post.metadata.liveLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="size-3.5" />
                View Live
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
