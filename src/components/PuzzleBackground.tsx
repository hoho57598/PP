"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Star {
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: string;
}

const STAR_COLORS = ["#20FFA6", "#49FFB6", "#5249FF", "#94FF42", "#FFFFFF"];

export default function PuzzleBackground() {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generated: Star[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 4,
      duration: Math.random() * 3 + 2,
      color:
        Math.random() > 0.4
          ? "#FFFFFF"
          : STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
    }));
    setStars(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Radial glow blobs */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{ background: "#20FFA6" }}
        animate={{ opacity: [0.08, 0.15, 0.08], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full blur-[140px]"
        style={{ background: "#5249FF" }}
        animate={{ opacity: [0.1, 0.18, 0.1], scale: [1, 1.15, 1] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "#94FF42" }}
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Twinkling stars */}
      {stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            background: star.color,
            boxShadow: `0 0 ${star.size * 3}px ${star.color}`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}

      {/* Diagonal sweep light */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(115deg, transparent 40%, rgba(32,255,166,0.04) 50%, transparent 60%)",
        }}
        animate={{ x: ["-100%", "100%"] }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
