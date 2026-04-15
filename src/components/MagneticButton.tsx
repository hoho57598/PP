"use client";
import { useRef, useState } from "react";
import { motion } from "framer-motion";

export default function MagneticButton({
  children,
  className,
  style,
  href,
  onClick,
  type,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  href?: string;
  onClick?: () => void;
  type?: "submit";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    setOffset({
      x: (e.clientX - cx) * 0.35,
      y: (e.clientY - cy) * 0.35,
    });
  };

  const onLeave = () => setOffset({ x: 0, y: 0 });

  const Tag = href ? "a" : type ? "button" : "div";

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: "spring", stiffness: 300, damping: 15, mass: 0.5 }}
      className="inline-block"
    >
      <Tag
        href={href ?? undefined}
        onClick={onClick}
        type={type}
        className={className}
        style={style}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
