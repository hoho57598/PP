"use client";
import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Card {
  id: number;
  x: number;
  y: number;
  rotation: number;
  gradient: string;
  title: string;
  scale: number;
  depth: number;
  driftX: number;
  driftY: number;
  driftRotate: number;
  speed: number;
}

const GRADIENTS = [
  "linear-gradient(135deg, #20FFA6, #5249FF)",
  "linear-gradient(135deg, #4242FF, #94FF42)",
  "linear-gradient(135deg, #5249FF, #20FFA6)",
  "linear-gradient(135deg, #94FF42, #4242FF)",
  "linear-gradient(135deg, #49FFB6, #5249FF)",
  "linear-gradient(135deg, #20FFA6, #4242FF)",
  "linear-gradient(135deg, #94FF42, #49FFB6)",
  "linear-gradient(135deg, #4242FF, #20FFA6)",
];

const TITLES = [
  "Design System",
  "Mobile App",
  "Brand Identity",
  "Dashboard",
  "Web Service",
  "UI Kit",
  "Branding",
  "Prototype",
];

function generateCards(): Card[] {
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    x: Math.random() * 90 + 5,
    y: Math.random() * 90 + 5,
    rotation: Math.random() * 40 - 20,
    gradient: GRADIENTS[i % GRADIENTS.length],
    title: TITLES[i % TITLES.length],
    scale: 0.5 + Math.random() * 0.6,
    depth: 0.2 + Math.random() * 0.8,
    driftX: 80 + Math.random() * 120,
    driftY: 60 + Math.random() * 100,
    driftRotate: 20 + Math.random() * 40,
    speed: 8 + Math.random() * 12,
  }));
}

export default function FloatingCards() {
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    // Mobile: fewer cards for performance
    const isMobile = window.innerWidth < 768;
    const all = generateCards();
    setCards(isMobile ? all.slice(0, 4) : all);
  }, []);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 15 });
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handler);

    // Update parallax from spring values
    const unsub1 = smoothX.on("change", (v) =>
      setParallax((p) => ({ ...p, x: v }))
    );
    const unsub2 = smoothY.on("change", (v) =>
      setParallax((p) => ({ ...p, y: v }))
    );

    return () => {
      window.removeEventListener("mousemove", handler);
      unsub1();
      unsub2();
    };
  }, [mouseX, mouseY, smoothX, smoothY]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          className="absolute rounded-xl"
          style={{
            left: `${card.x}%`,
            top: `${card.y}%`,
            width: `${140 * card.scale}px`,
            height: `${90 * card.scale}px`,
            background: card.gradient,
            opacity: 0.06 + card.depth * 0.04,
            x: parallax.x * 30 * card.depth,
            y: parallax.y * 30 * card.depth,
          }}
          animate={{
            x: [
              0,
              card.driftX,
              -card.driftX * 0.7,
              card.driftX * 0.4,
              0,
            ],
            y: [
              0,
              -card.driftY * 0.8,
              card.driftY,
              -card.driftY * 0.5,
              0,
            ],
            rotate: [
              card.rotation,
              card.rotation + card.driftRotate,
              card.rotation - card.driftRotate * 0.6,
              card.rotation + card.driftRotate * 0.3,
              card.rotation,
            ],
            scale: [
              card.scale,
              card.scale * 1.1,
              card.scale * 0.9,
              card.scale * 1.05,
              card.scale,
            ],
          }}
          transition={{
            duration: card.speed,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="flex items-center justify-center w-full h-full text-white/30 text-xs font-heading font-bold select-none">
            {card.title}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
