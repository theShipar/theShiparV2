import { getTableOfContents } from "fumadocs-core/content/toc"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { BlogPosting as PageSchema, WithContext } from "schema-dts"

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/base/ui/tooltip"
import { Icons } from "@/components/icons"
import { InlineTOC } from "@/components/inline-toc"
import { MDX } from "@/components/mdx"
import { Button } from "@/components/ui/button"
import { Kbd } from "@/components/ui/kbd"
import { Tag } from "@/components/ui/tag"
import { Prose } from "@/components/ui/typography"
import { SITE_INFO, X_USERNAME } from "@/config/site"
import { PostKeyboardShortcuts } from "@/features/blog/components/post-keyboard-shortcuts"
import { LLMCopyButtonWithViewOptions } from "@/features/blog/components/post-page-actions"
import { PostShareMenu } from "@/features/blog/components/post-share-menu"
import {
  findNeighbour,
  getAllDocs,
  getDocBySlug,
} from "@/features/doc/data/documents"
import type { Doc } from "@/features/doc/types/document"
import { USER } from "@/features/portfolio/data/user"
import { cn } from "@/lib/utils"

export const revalidate = false
export const dynamic = "force-static"
export const dynamicParams = false

export async function generateStaticParams() {
  const docs = getAllDocs()
  return docs.map((doc) => ({ slug: doc.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)

  if (!doc) {
    return notFound()
  }

  const { title, description, image, createdAt, updatedAt } = doc.metadata

  const postUrl = getDocUrl(doc)
  const ogImage =
    image ||
    `/og/simple?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`

  return {
    title,
    description,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      url: postUrl,
      type: "article",
      publishedTime: new Date(createdAt).toISOString(),
      modifiedTime: new Date(updatedAt).toISOString(),
      images: {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    },
    twitter: {
      card: "summary_large_image",
      site: X_USERNAME,
      creator: X_USERNAME,
      images: [ogImage],
    },
  }
}

function getPageJsonLd(doc: Doc): WithContext<PageSchema> {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: doc.metadata.title,
    description: doc.metadata.description,
    image:
      doc.metadata.image ||
      `/og/simple?title=${encodeURIComponent(doc.metadata.title)}&description=${encodeURIComponent(doc.metadata.description)}`,
    url: `${SITE_INFO.url}${getDocUrl(doc)}`,
    datePublished: new Date(doc.metadata.createdAt).toISOString(),
    dateModified: new Date(doc.metadata.updatedAt).toISOString(),
    author: {
      "@type": "Person",
      name: USER.displayName,
      identifier: USER.username,
      image: USER.avatar,
    },
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string
  }>
}) {
  const slug = (await params).slug
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  const toc = getTableOfContents(doc.content)

  const allDocs = getAllDocs()
  const { previous, next } = findNeighbour(allDocs, slug)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getPageJsonLd(doc)).replace(/</g, "\\u003c"),
        }}
      />

      <PostKeyboardShortcuts
        basePath="/projects"
        previous={previous}
        next={next}
      />

      <div className="flex items-center justify-between p-2 pl-4">
        <Button
          className="h-7 gap-2 border-none px-0 font-mono text-muted-foreground hover:text-foreground"
          variant="link"
          size="sm"
          asChild
        >
          <Link href="/projects">
            <ArrowLeftIcon />
            Projects
          </Link>
        </Button>

        <div className="flex items-center gap-2">
          <LLMCopyButtonWithViewOptions
            markdownUrl={`${getDocUrl(doc)}.mdx`}
            isComponent={doc.metadata.category === "components"}
          />

          <PostShareMenu title={doc.metadata.title} url={getDocUrl(doc)} />

          {previous && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="size-7 border-none"
                    variant="secondary"
                    size="icon-sm"
                    asChild
                  >
                    <Link href={`/projects/${previous.slug}`}>
                      <ArrowLeftIcon />
                      <span className="sr-only">Previous</span>
                    </Link>
                  </Button>
                }
              />
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Previous Project
                  <Kbd>
                    <ArrowLeftIcon />
                  </Kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          )}

          {next && (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    className="size-7 border-none"
                    variant="secondary"
                    size="icon-sm"
                    asChild
                  >
                    <Link href={`/projects/${next.slug}`}>
                      <span className="sr-only">Next</span>
                      <ArrowRightIcon />
                    </Link>
                  </Button>
                }
              />
              <TooltipContent className="pr-2 pl-3">
                <div className="flex items-center gap-3">
                  Next Project
                  <Kbd>
                    <ArrowRightIcon />
                  </Kbd>
                </div>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </div>

      <div className="screen-line-before screen-line-after">
        <div
          className={cn(
            "h-8",
            "before:absolute before:-left-[100vw] before:-z-1 before:h-full before:w-[200vw]",
            "before:bg-[repeating-linear-gradient(315deg,var(--pattern-foreground)_0,var(--pattern-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--pattern-foreground:var(--color-edge)]/56"
          )}
        />
      </div>

      <Prose className="px-4">
        <h1 className="screen-line-after text-3xl font-semibold tracking-tight">
          {doc.metadata.title}
        </h1>

        <p className="text-xl text-muted-foreground">
          {doc.metadata.description}
        </p>

        {(doc.metadata.tags || doc.metadata.category) && (
          <div className="flex flex-wrap gap-2 py-4">
            {doc.metadata.tags?.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            {typeof doc.metadata.category === "string" ? (
              <Tag>{doc.metadata.category}</Tag>
            ) : (
              doc.metadata.category?.map((cat) => <Tag key={cat}>{cat}</Tag>)
            )}
          </div>
        )}

        {doc.metadata.image && (
          <div className="my-8">
            <Image
              src={doc.metadata.image}
              alt={doc.metadata.title}
              width={1200}
              height={630}
              className="rounded-lg border shadow-sm"
              unoptimized
            />
          </div>
        )}

        {doc.metadata.figmaLink && (
          <div className="my-8">
            <Button variant="outline" size="sm" asChild>
              <a
                href={doc.metadata.figmaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <Icons.figma className="size-4" />
                View Figma
              </a>
            </Button>
          </div>
        )}

        <InlineTOC items={toc} />

        <div>
          <MDX code={doc.content} />
        </div>
      </Prose>

      <div className="screen-line-before h-4 w-full" />
    </>
  )
}

function getDocUrl(doc: Doc) {
  return `/projects/${doc.slug}`
}
