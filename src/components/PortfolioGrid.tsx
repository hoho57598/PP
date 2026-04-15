"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Project } from "@/lib/data";

function TiltCard({
  project,
  large,
}: {
  project: Project;
  large: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("");

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTransform(
      `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale3d(1.02,1.02,1.02)`
    );
  };

  const onLeave = () => setTransform("");

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        transform: transform || "perspective(800px) rotateX(0) rotateY(0)",
        transition: transform ? "none" : "transform 0.5s ease",
      }}
    >
      <Link href={`/portfolio/${project.slug}`}>
        <div className="group relative overflow-hidden rounded-2xl cursor-grow">
          <div
            className={`${large ? "aspect-[16/9]" : "aspect-[16/10]"} w-full transition-transform duration-500 group-hover:scale-105`}
            style={{
              background: project.thumbnail
                ? `url(${project.thumbnail}) center/cover`
                : project.gradient,
            }}
          >
            {!project.thumbnail && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-heading text-3xl md:text-5xl font-bold text-white/20 select-none">
                  {project.title}
                </span>
              </div>
            )}
          </div>

          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 flex items-end p-8">
            <div className="translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
              <h3 className="font-heading text-xl md:text-2xl font-bold text-white mb-2">
                {project.title}
              </h3>
              <p className="text-white/70 text-sm mb-3">
                {project.description}
              </p>
              <div className="flex gap-2 flex-wrap">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 rounded-full bg-white/10 text-white/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function PortfolioGrid({
  projects,
}: {
  projects: Project[];
}) {
  const allTags = Array.from(new Set(projects.flatMap((p) => p.tags)));
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? projects.filter((p) => p.tags.includes(activeTag))
    : projects;

  return (
    <section id="work" className="py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Selected Work
          </h2>
          <p style={{ color: "var(--muted)" }}>작업물 모음</p>
        </motion.div>

        {/* Tag filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap gap-2 mb-10"
        >
          <button
            onClick={() => setActiveTag(null)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
            style={{
              background: activeTag === null ? "#20FFA6" : "transparent",
              color: activeTag === null ? "#000" : "var(--muted)",
              border:
                activeTag === null
                  ? "1px solid #20FFA6"
                  : "1px solid var(--border)",
            }}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(activeTag === tag ? null : tag)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer"
              style={{
                background: activeTag === tag ? "#20FFA6" : "transparent",
                color: activeTag === tag ? "#000" : "var(--muted)",
                border:
                  activeTag === tag
                    ? "1px solid #20FFA6"
                    : "1px solid var(--border)",
              }}
            >
              {tag}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((project, i) => (
            <motion.div
              key={project.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={i === 0 && !activeTag ? "md:col-span-2" : ""}
              layout
            >
              <TiltCard project={project} large={i === 0 && !activeTag} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
