"use client"

import { useState } from "react"

import { Markdown } from "@/components/markdown"
import { Button } from "@/components/ui/button"
import { ProseMono } from "@/components/ui/typography"
import { USER } from "@/features/portfolio/data/user"

import { Panel, PanelContent, PanelHeader, PanelTitle } from "./panel"

export function About() {
  const [isExpanded, setIsExpanded] = useState(false)

  // Split text into paragraphs
  const paragraphs = USER.about.split("\n\n")
  const firstParagraph = paragraphs[0]
  const remainingParagraphs = paragraphs.slice(1).join("\n\n")

  return (
    <Panel id="about">
      <PanelHeader>
        <PanelTitle>About</PanelTitle>
      </PanelHeader>

      <PanelContent className="space-y-4">
        <ProseMono>
          <Markdown>{firstParagraph}</Markdown>
          {isExpanded && remainingParagraphs && (
            <div className="mt-4">
              <Markdown>{remainingParagraphs}</Markdown>
            </div>
          )}
        </ProseMono>

        {remainingParagraphs && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 font-mono text-xs font-medium text-muted-foreground hover:text-foreground"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "See less" : "See more"}
          </Button>
        )}
      </PanelContent>
    </Panel>
  )
}
