"use client"

import { useState } from "react"

import { CopyButton } from "@/components/copy-button"

import source from "./otp-source.json"

const code = source.files
  .map((file) => `FILE: ${file.name}\n\n${file.code}`)
  .join("\n\n")
const contents = {
  Code: code,
  Prompt: source.prompt,
  Both: source.prompt + "\n\n" + code,
}
const modes = ["Code", "Prompt", "Both"] as const

export function SourcePanel() {
  const [mode, setMode] = useState<(typeof modes)[number]>("Both")
  return (
    <section aria-label="Prompt and code" className="border-t border-edge">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:px-6">
        <fieldset className="flex rounded-md border border-edge bg-muted/40 p-1">
          <legend className="sr-only">Content to display and copy</legend>
          {modes.map((option) => (
            <label
              key={option}
              className="cursor-pointer rounded px-3 py-1 text-sm text-muted-foreground has-checked:bg-background has-checked:text-foreground has-checked:shadow-sm has-focus-visible:ring-2"
            >
              <input
                type="radio"
                name="source-mode"
                className="sr-only"
                checked={mode === option}
                onChange={() => setMode(option)}
              />
              {option}
            </label>
          ))}
        </fieldset>
        <CopyButton
          key={mode}
          size="sm"
          text={contents[mode]}
          aria-label={`Copy ${mode.toLowerCase()}`}
        >
          Copy
        </CopyButton>
      </div>
      {mode !== "Code" && (
        <div className="space-y-3 border-t border-edge p-4 sm:p-6">
          <h2 className="font-medium">Implementation prompt</h2>
          <p className="text-sm leading-relaxed whitespace-pre-line">
            {source.prompt}
          </p>
        </div>
      )}
      {mode !== "Prompt" &&
        source.files.map((file) => (
          <div key={file.name} className="border-t border-edge">
            <h3 className="bg-muted/40 px-4 py-2 font-mono text-sm">
              {file.name}
            </h3>
            <pre className="max-h-80 overflow-auto p-4 text-xs leading-6">
              <code>{file.code}</code>
            </pre>
          </div>
        ))}
    </section>
  )
}
