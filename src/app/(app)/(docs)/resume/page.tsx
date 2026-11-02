import { DownloadIcon } from "lucide-react"
import type { Metadata } from "next"

import { Button } from "@/components/base/ui/button"
import { ResumeViewer } from "@/components/resume-viewer"

export const metadata: Metadata = {
  title: "Resume",
  description: "Abtahi Shipar - UI/UX Designer Resume",
  alternates: {
    canonical: "/resume",
  },
}

export default function ResumePage() {
  const resumeUrl =
    "https://drive.google.com/file/d/1bDSisIBtE_ctcqICU4KepMYI4eAlv5QC/view?usp=sharing"

  return (
    <div className="min-h-svh">
      <div className="screen-line-after px-4">
        <h1 className="text-3xl leading-none font-semibold tracking-tight">
          Resume
        </h1>
      </div>

      <div className="p-4">
        <p className="font-mono text-sm text-balance text-muted-foreground">
          View and download my latest resume.
        </p>
      </div>

      <div className="screen-line-before screen-line-after p-4">
        <div className="mx-auto max-w-2xl space-y-4">
          <ResumeViewer />

          <Button
            className="h-12 w-full gap-2 rounded-xl"
            render={
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            <DownloadIcon className="size-4" />
            Download Resume
          </Button>
        </div>
      </div>
    </div>
  )
}
