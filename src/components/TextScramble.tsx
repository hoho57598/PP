"use client";
import { useEffect, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";

export default function TextScramble({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [display, setDisplay] = useState("\u00A0".repeat(text.length));

  useEffect(() => {
    let frame = 0;
    const total = 30;
    let raf: number;
    let timeout: ReturnType<typeof setTimeout>;

    const run = () => {
      frame++;
      const progress = frame / total;
      const revealed = Math.floor(progress * text.length);

      let result = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") result += " ";
        else if (i < revealed) result += text[i];
        else result += CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setDisplay(result);

      if (frame < total) raf = requestAnimationFrame(run);
      else setDisplay(text);
    };

    timeout = setTimeout(() => {
      raf = requestAnimationFrame(run);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);

  return <span className={className}>{display}</span>;
}
