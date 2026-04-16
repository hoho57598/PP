"use client";

const items = [
  "Designer",
  "System Thinker",
  "Problem Solver",
  "Visual Storyteller",
  "Creator",
];

export default function Marquee() {
  const row = [...items, ...items, ...items, ...items];

  return (
    <div
      className="py-10 overflow-hidden select-none"
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        className="flex whitespace-nowrap animate-marquee"
      >
        {row.map((item, i) => (
          <span
            key={i}
            className="font-heading text-2xl md:text-4xl font-bold mx-6 flex items-center gap-6"
            style={{ color: "var(--foreground)" }}
          >
            {item}
            <span className="text-mint text-lg">&#x2666;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
