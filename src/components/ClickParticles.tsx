"use client";
import { useEffect } from "react";

const COLORS = ["#20FFA6", "#49FFB6", "#5249FF", "#4242FF", "#94FF42"];

export default function ClickParticles() {
  useEffect(() => {
    if ("ontouchstart" in window) return;

    const handler = (e: MouseEvent) => {
      const count = 8 + Math.floor(Math.random() * 6);
      for (let i = 0; i < count; i++) {
        const el = document.createElement("div");
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
        const dist = 40 + Math.random() * 80;
        const size = 4 + Math.random() * 6;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;

        Object.assign(el.style, {
          position: "fixed",
          left: `${e.clientX}px`,
          top: `${e.clientY}px`,
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          background: color,
          pointerEvents: "none",
          zIndex: "9996",
          transform: "translate(-50%,-50%)",
          boxShadow: `0 0 6px ${color}`,
        });
        el.style.setProperty("--dx", `${dx}px`);
        el.style.setProperty("--dy", `${dy}px`);
        el.style.animation = `clickParticle ${0.5 + Math.random() * 0.3}s ease-out forwards`;

        document.body.appendChild(el);
        el.addEventListener("animationend", () => el.remove());
      }
    };

    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return null;
}
