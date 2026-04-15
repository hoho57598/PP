"use client";
import { useEffect, useState } from "react";

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];
const COLORS = ["#20FFA6", "#49FFB6", "#5249FF", "#4242FF", "#94FF42", "#FF2060", "#FFD700"];
const EMOJIS = ["🎉", "🚀", "✨", "💎", "🔥", "⚡", "🌈", "🎨", "💜", "🎯"];

export default function EasterEgg() {
  const [keys, setKeys] = useState<string[]>([]);
  const [triggered, setTriggered] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setKeys((prev) => {
        const next = [...prev, e.key].slice(-10);
        if (next.join(",") === KONAMI.join(",")) {
          setTimeout(() => fireConfetti(), 50);
        }
        return next;
      });
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function fireConfetti() {
    setTriggered(true);
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;

    for (let i = 0; i < 80; i++) {
      const el = document.createElement("div");
      const isEmoji = Math.random() > 0.6;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 150 + Math.random() * 400;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 200;
      const size = isEmoji ? 20 : 6 + Math.random() * 10;
      const spin = Math.random() * 720 - 360;

      if (isEmoji) {
        el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        Object.assign(el.style, {
          position: "fixed",
          left: `${cx}px`,
          top: `${cy}px`,
          fontSize: `${size}px`,
          pointerEvents: "none",
          zIndex: "99999",
          transform: "translate(-50%,-50%)",
        });
      } else {
        Object.assign(el.style, {
          position: "fixed",
          left: `${cx}px`,
          top: `${cy}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: Math.random() > 0.5 ? "50%" : "2px",
          background: color,
          pointerEvents: "none",
          zIndex: "99999",
          transform: "translate(-50%,-50%)",
          boxShadow: `0 0 8px ${color}`,
        });
      }

      el.style.setProperty("--dx", `${dx}px`);
      el.style.setProperty("--dy", `${dy}px`);
      el.style.setProperty("--spin", `${spin}deg`);
      el.style.animation = `confetti ${0.8 + Math.random() * 0.8}s ease-out forwards`;

      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }

    setTimeout(() => setTriggered(false), 3000);
  }

  return triggered ? (
    <div className="fixed inset-0 z-[99998] pointer-events-none flex items-center justify-center">
      <div
        className="font-heading text-4xl md:text-6xl font-bold gradient-text animate-bounce"
      >
        🎉 You found it! 🎉
      </div>
    </div>
  ) : null;
}
