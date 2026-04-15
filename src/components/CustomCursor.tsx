"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if ("ontouchstart" in window) return;
    setVisible(true);

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });

    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (
        t.closest(
          'a, button, [role="button"], input, textarea, select, .cursor-grow'
        )
      )
        setHovering(true);
    };
    const out = () => setHovering(false);

    const down = () => setClicking(true);
    const up = () => setClicking(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    document.addEventListener("mouseout", out);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      document.removeEventListener("mouseout", out);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  if (!visible) return null;

  const size = clicking ? 12 : hovering ? 48 : 20;
  const ringSize = clicking ? 60 : 40;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full mix-blend-difference"
        animate={{
          x: pos.x - size / 2,
          y: pos.y - size / 2,
          width: size,
          height: size,
        }}
        transition={{ type: "spring", stiffness: 1200, damping: 40, mass: 0.2 }}
        style={{ background: "#20FFA6" }}
      />
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
        animate={{
          x: pos.x - ringSize / 2,
          y: pos.y - ringSize / 2,
          width: ringSize,
          height: ringSize,
          opacity: clicking ? 0.8 : hovering ? 0 : 0.5,
          borderWidth: clicking ? 2 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: clicking ? 800 : 400,
          damping: 25,
        }}
        style={{ border: "1px solid", borderColor: clicking ? "#20FFA6" : "rgba(255,255,255,0.2)" }}
      />
      <style>{`@media (hover: hover) { *, *::before, *::after { cursor: none !important; } }`}</style>
    </>
  );
}
