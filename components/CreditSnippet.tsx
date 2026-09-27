"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

interface Props {
  title: string
  pageUrl: string
  imageUrl: string
}

export default function CreditSnippet({ title, pageUrl, imageUrl }: Props) {
  const [tab, setTab] = useState<"embed" | "text">("embed")
  const [copied, setCopied] = useState(false)

  const safeTitle = title.replace(/"/g, "&quot;").replace(/</g, "&lt;")
  const snippets = {
    embed: `<a href="${pageUrl}"><img src="${imageUrl}?tr=w-1200,q-80" alt="${safeTitle} wallpaper" loading="lazy" style="max-width:100%;height:auto"></a>\n<p>Wallpaper: <a href="${pageUrl}">${safeTitle}</a> from <a href="https://www.wallpaperz.in">Wallpaperz</a></p>`,
    text: `Wallpaper: <a href="${pageUrl}">${safeTitle}</a> from <a href="https://www.wallpaperz.in">Wallpaperz</a>`,
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippets[tab])
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      // clipboard blocked (insecure context / permissions); the textarea stays selectable
    }
  }

  return (
    <div className="border rounded-lg p-4 text-sm">
      <h2 className="font-semibold text-base">Using it in a post or video?</h2>
      <p className="mt-1 text-muted-foreground">It&apos;s free to use. A credit link helps us keep making these.</p>
      <div className="mt-3 inline-flex rounded-full bg-muted p-0.5 text-xs" role="tablist">
        {(["embed", "text"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => { setTab(t); setCopied(false) }}
            className={`rounded-full px-3 py-1 font-medium transition-colors ${tab === t ? "bg-background shadow-sm" : "text-muted-foreground"}`}
          >
            {t === "embed" ? "Embed image" : "Text credit"}
          </button>
        ))}
      </div>
      <textarea
        readOnly
        value={snippets[tab]}
        rows={tab === "embed" ? 4 : 2}
        onFocus={(e) => e.currentTarget.select()}
        className="mt-3 w-full resize-none rounded-md border bg-muted/40 p-2 font-mono text-[11px] leading-relaxed text-muted-foreground"
        aria-label="Credit HTML"
      />
      <button
        type="button"
        onClick={copy}
        className="mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copied" : "Copy HTML"}
      </button>
    </div>
  )
}
