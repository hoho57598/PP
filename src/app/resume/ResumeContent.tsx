"use client";
import { motion } from "framer-motion";
import { Resume } from "@/lib/data";

function TimelineSection({
  title,
  items,
  delay,
}: {
  title: string;
  items: { period: string; title: string; company: string; description: string }[];
  delay: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="mb-20"
    >
      <h2 className="font-heading text-sm uppercase tracking-[0.2em] text-mint mb-8">
        {title}
      </h2>
      <div>
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.1 + i * 0.1 }}
            className="group grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 py-8 transition-colors"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              {item.period}
            </span>
            <div>
              <h3 className="font-heading font-semibold text-lg mb-1">
                {item.title}
              </h3>
              <p className="text-mint text-sm mb-2">{item.company}</p>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}

export default function ResumeContent({ resume }: { resume: Resume }) {
  return (
    <div className="pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h1 className="font-heading text-4xl md:text-6xl font-bold mb-6">
            Resume
          </h1>
          <p className="text-lg max-w-2xl" style={{ color: "var(--muted)" }}>
            {resume.intro}
          </p>
        </motion.div>

        <TimelineSection
          title="Experience"
          items={resume.experience}
          delay={0.2}
        />
        <TimelineSection
          title="Education"
          items={resume.education}
          delay={0.4}
        />

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="font-heading text-sm uppercase tracking-[0.2em] text-mint mb-8">
            Skills
          </h2>
          <div className="flex flex-wrap gap-3">
            {resume.skills.map((skill, i) => (
              <motion.span
                key={skill.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + i * 0.05 }}
                className="px-4 py-2 rounded-full text-sm font-medium transition-transform hover:scale-105"
                style={{
                  border: `1px solid ${skill.color}40`,
                  color: skill.color,
                }}
              >
                {skill.name}
              </motion.span>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
