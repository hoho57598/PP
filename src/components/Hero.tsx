"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TextScramble from "./TextScramble";
import FloatingCards from "./FloatingCards";
import RotatingText from "./RotatingText";

function getGreeting(): { text: string; emoji: string } {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return { text: "Good Morning", emoji: "☀️" };
  if (h >= 12 && h < 18) return { text: "Good Afternoon", emoji: "🌤" };
  if (h >= 18 && h < 23) return { text: "Good Evening", emoji: "🌙" };
  return { text: "Still Creating", emoji: "🌃" };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function Hero() {
  const [greeting, setGreeting] = useState({ text: "", emoji: "" });
  const [time, setTime] = useState("");

  useEffect(() => {
    setGreeting(getGreeting());

    const tick = () => {
      const now = new Date();
      setTime(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
      setGreeting(getGreeting());
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Floating project cards */}
      <FloatingCards />

      {/* Background glow — hidden on mobile for performance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full blur-[128px] opacity-20 bg-mint" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full blur-[128px] opacity-15 bg-purple" />
      </div>

      <div className="relative z-10 text-center max-w-4xl">
        {/* Time greeting + live clock */}
        {greeting.text && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex items-center gap-3 mb-6 justify-center"
          >
            <motion.span
              className="text-2xl"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
            >
              {greeting.emoji}
            </motion.span>
            <span className="text-sm" style={{ color: "var(--muted)" }}>
              {greeting.text}
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full" style={{ color: "var(--muted)", border: "1px solid var(--border)" }}>
              {time}
            </span>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-sm tracking-[0.2em] uppercase text-mint mb-6"
        >
          <TextScramble text="Design Portfolio" delay={300} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight mb-4"
        >
          I Make Things
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold mb-10"
        >
          <RotatingText
            words={["Beautiful ✨", "Meaningful 💎", "Interactive ⚡", "Unforgettable 🔥"]}
            className="gradient-text"
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
          style={{ color: "var(--muted)" }}
        >
          매일 픽셀과 싸우고, 가끔 이깁니다.
          <br />
          커피 한 잔이면 뭐든 디자인하는 사람.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="flex gap-4 justify-center"
        >
          <a
            href="#work"
            className="px-6 py-3 bg-mint text-black font-medium rounded-full hover:bg-mint-light transition-colors text-sm"
          >
            View Work
          </a>
          <a
            href="#contact"
            className="px-6 py-3 rounded-full text-sm transition-colors hover:text-mint"
            style={{ border: "1px solid var(--border)" }}
          >
            Say Hello 👋
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-8"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-6 h-10 rounded-full flex justify-center pt-2"
          style={{ border: "2px solid var(--muted)" }}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ background: "var(--muted)" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
