"use client";
import { useState } from "react";

/**
 * Convert any Figma share URL into the official embed URL.
 * https://www.figma.com/design/FILEKEY/...  →
 * https://www.figma.com/embed?embed_host=share&url=ENCODED_URL
 */
function toEmbedUrl(figmaUrl: string): string {
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(
    figmaUrl
  )}`;
}

export default function FigmaEmbed({
  url,
  title,
}: {
  url: string;
  title?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const embedUrl = toEmbedUrl(url);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-xs uppercase tracking-wider"
          style={{ color: "var(--muted)" }}
        >
          Figma Design
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-mint hover:underline"
        >
          Figma에서 열기 ↗
        </a>
      </div>

      <div
        className="relative w-full rounded-xl overflow-hidden"
        style={{
          aspectRatio: "16 / 10",
          border: "1px solid var(--border)",
          background: "var(--card)",
        }}
      >
        {!loaded && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm"
            style={{ color: "var(--muted)" }}
          >
            Figma 로딩 중...
          </div>
        )}
        <iframe
          src={embedUrl}
          title={title ?? "Figma embed"}
          className="absolute inset-0 w-full h-full"
          allowFullScreen
          onLoad={() => setLoaded(true)}
          style={{ border: 0 }}
        />
      </div>
    </div>
  );
}
