"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  color: string;
}

const stats: Stat[] = [
  { value: 25, suffix: "+", label: "Projects", color: "#20FFA6" },
  { value: 10, suffix: "+", label: "Clients", color: "#5249FF" },
  { value: 99, suffix: "%", label: "Satisfaction", color: "#94FF42" },
  { value: 5, suffix: "yr", label: "Experience", color: "#49FFB6" },
];

function CountUp({
  target,
  suffix,
  inView,
}: {
  target: number;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 60;
    const step = () => {
      frame++;
      const progress = 1 - Math.pow(1 - frame / total, 3); // ease-out cubic
      setCount(Math.floor(progress * target));
      if (frame < total) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [inView, target]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function StatsCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 px-6">
      <div ref={ref} className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div
                className="font-heading text-4xl md:text-5xl font-bold mb-2"
                style={{ color: stat.color }}
              >
                <CountUp
                  target={stat.value}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </div>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                {stat.label}
              </p>

              {/* Decorative bar */}
              <motion.div
                className="h-0.5 mx-auto mt-4 rounded-full"
                initial={{ width: 0 }}
                animate={inView ? { width: 48 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.1 }}
                style={{ background: stat.color + "40" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
