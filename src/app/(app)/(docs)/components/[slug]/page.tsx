import { ArrowLeft, ExternalLink } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { CopyButton } from "@/components/copy-button"
import components from "@/features/component-gallery/components.json"
import { SourcePanel } from "@/features/component-gallery/source-panel"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return components.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  return {
    title: components.find((item) => item.slug === slug)?.name,
    alternates: { canonical: `/components/${slug}` },
  }
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params
  const item = components.find((component) => component.slug === slug)
  if (!item) notFound()
  const otp = slug === "otp-input-v1"
  return (
    <article>
      <nav
        aria-label="Component navigation"
        className="border-t border-edge p-4 sm:p-6"
      >
        <Link
          href="/components"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft size={15} />
          Back to components
        </Link>
      </nav>
      <video
        className="pointer-events-none block aspect-square w-full bg-black object-contain select-none"
        src={`/component-videos/${encodeURIComponent(item.name)}.mp4`}
        aria-label={item.name + " preview"}
        muted
        playsInline
        autoPlay
        loop
        disablePictureInPicture
        disableRemotePlayback
      />
      <header className="flex flex-wrap items-center justify-between gap-3 border-y border-edge p-4 sm:p-6">
        <h1 className="text-3xl font-semibold tracking-tight">
          {otp ? "Modern OTP Input V1" : item.name}
        </h1>
        <a
          href={item.live}
          target="_blank"
          rel="noreferrer"
          className="group inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:bg-foreground/85 focus-visible:outline-2 active:scale-95"
        >
          View live{" "}
          <ExternalLink
            size={15}
            className="motion-safe:transition-transform motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
          />
        </a>
      </header>
      <section className="border-t border-edge p-4 sm:p-6">
        <label htmlFor="clone-url" className="font-medium">
          Clone repository
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-md border border-edge bg-muted/30 p-1 pl-3">
          <input
            id="clone-url"
            readOnly
            value={item.repo}
            className="min-w-0 flex-1 bg-transparent font-mono text-xs"
          />
          <CopyButton text={item.repo} aria-label="Copy clone URL" />
        </div>
      </section>
      {otp ? (
        <SourcePanel />
      ) : (
        <p className="border-t border-edge p-4 text-sm text-muted-foreground sm:p-6">
          Prompt and code coming soon.
        </p>
      )}
    </article>
  )
}
