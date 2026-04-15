"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

const milestones = [
  {
    year: "2019",
    title: "첫 발걸음",
    desc: "디자인 커리어 시작",
    icon: "🌱",
    color: "#94FF42",
  },
  {
    year: "2020",
    title: "첫 프로젝트",
    desc: "실무 프로젝트 투입",
    icon: "🎯",
    color: "#49FFB6",
  },
  {
    year: "2021",
    title: "성장",
    desc: "프로덕트 디자이너로 전환",
    icon: "🚀",
    color: "#20FFA6",
  },
  {
    year: "2023",
    title: "도약",
    desc: "시니어 디자이너 & 시스템 구축",
    icon: "⚡",
    color: "#5249FF",
  },
  {
    year: "Now",
    title: "정상을 향해",
    desc: "더 큰 임팩트를 만들어가는 중",
    icon: "🏔️",
    color: "#20FFA6",
  },
];

export default function JourneyPath() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-200px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end center"],
  });

  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={sectionRef} className="py-32 px-6 overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Journey
          </h2>
          <p style={{ color: "var(--muted)" }}>
            목표를 향해 한 걸음씩 올라가는 중
          </p>
        </motion.div>

        <div className="relative">
          {/* SVG Path line */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px">
            <svg
              className="w-[2px] h-full"
              viewBox="0 0 2 100"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              {/* Background line */}
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="100"
                stroke="var(--border)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
              {/* Animated progress line */}
              <motion.line
                x1="1"
                y1="0"
                x2="1"
                y2="100"
                stroke="url(#journeyGrad)"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
                style={{ pathLength }}
              />
              <defs>
                <linearGradient
                  id="journeyGrad"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="#94FF42" />
                  <stop offset="50%" stopColor="#20FFA6" />
                  <stop offset="100%" stopColor="#5249FF" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Milestones */}
          <div className="relative space-y-20">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`flex items-center gap-8 ${isLeft ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Content */}
                  <div
                    className={`flex-1 ${isLeft ? "text-right" : "text-left"}`}
                  >
                    <span
                      className="text-xs font-mono tracking-wider"
                      style={{ color: m.color }}
                    >
                      {m.year}
                    </span>
                    <h3 className="font-heading text-xl font-bold mt-1 mb-1">
                      {m.title}
                    </h3>
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {m.desc}
                    </p>
                  </div>

                  {/* Center dot */}
                  <motion.div
                    className="relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                    style={{
                      background: "var(--background)",
                      border: `2px solid ${m.color}`,
                      boxShadow: `0 0 20px ${m.color}30`,
                    }}
                    whileInView={{
                      boxShadow: `0 0 30px ${m.color}50`,
                    }}
                    viewport={{ once: true }}
                  >
                    {m.icon}
                  </motion.div>

                  {/* Empty space for the other side */}
                  <div className="flex-1" />
                </motion.div>
              );
            })}
          </div>

          {/* Summit glow */}
          <motion.div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-[60px]"
            style={{ background: "#20FFA6", opacity: 0 }}
            animate={isInView ? { opacity: 0.15 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />
        </div>
      </div>
    </section>
  );
}
