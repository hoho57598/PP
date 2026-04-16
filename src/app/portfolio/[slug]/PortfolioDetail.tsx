"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Project } from "@/lib/data";
import Lightbox from "@/components/Lightbox";
import FigmaEmbed from "@/components/FigmaEmbed";

export default function PortfolioDetail({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: Project | null;
  next: Project | null;
}) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <div className="pt-16">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full aspect-[21/9] relative overflow-hidden"
        style={{
          background: project.thumbnail
            ? `url(${project.thumbnail}) center/cover`
            : project.gradient,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-white"
          >
            {project.title}
          </motion.h1>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/#work"
            className="text-sm text-mint hover:underline mb-8 inline-block"
          >
            &larr; Back to Work
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div>
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "var(--muted)" }}
              >
                Year
              </p>
              <p className="font-medium">{project.year}</p>
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "var(--muted)" }}
              >
                Role
              </p>
              <p className="font-medium">{project.role}</p>
            </div>
            <div>
              <p
                className="text-xs uppercase tracking-wider mb-2"
                style={{ color: "var(--muted)" }}
              >
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-1 rounded-full"
                    style={{
                      border: "1px solid var(--border)",
                      color: "var(--muted)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p
            className="text-lg leading-relaxed mb-16"
            style={{ color: "var(--muted)" }}
          >
            {project.detail}
          </p>

          {/* Figma embed if URL is provided */}
          {project.figmaUrl && (
            <div className="mb-16">
              <FigmaEmbed url={project.figmaUrl} title={project.title} />
            </div>
          )}

          {/* Project images — full width vertical scroll */}
          {project.images.length > 0 ? (
            <div className="flex flex-col gap-4">
              {project.images.map((url, i) => (
                <div
                  key={i}
                  className="w-full rounded-xl overflow-hidden cursor-grow"
                  style={{ border: "1px solid var(--border)" }}
                  onClick={() => setLightboxIdx(i)}
                >
                  <img
                    src={url}
                    alt={`${project.title} ${i + 1}`}
                    className="w-full h-auto"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  className="aspect-[4/3] rounded-xl flex items-center justify-center"
                  style={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    className="text-sm"
                    style={{ color: "var(--muted)" }}
                  >
                    Image {n}
                  </span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Prev / Next */}
        <div
          className="flex justify-between mt-20 pt-8"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {prev ? (
            <Link href={`/portfolio/${prev.slug}`} className="group">
              <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>
                &larr; Previous
              </p>
              <p className="font-heading font-medium group-hover:text-mint transition-colors">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/portfolio/${next.slug}`}
              className="group text-right"
            >
              <p className="text-xs mb-1" style={{ color: "var(--muted)" }}>
                Next &rarr;
              </p>
              <p className="font-heading font-medium group-hover:text-mint transition-colors">
                {next.title}
              </p>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && project.images.length > 0 && (
          <Lightbox
            images={project.images}
            initialIndex={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
