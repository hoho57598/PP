"use client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function Lightbox({ images, initialIndex, onClose }: Props) {
  const [idx, setIdx] = useState(initialIndex);

  const next = useCallback(
    () => setIdx((i) => (i + 1) % images.length),
    [images.length]
  );
  const prev = useCallback(
    () => setIdx((i) => (i - 1 + images.length) % images.length),
    [images.length]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose, next, prev]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          className="absolute left-6 text-white/50 hover:text-white text-5xl z-10 transition-colors"
        >
          &#8249;
        </button>
      )}

      <AnimatePresence mode="wait">
        <motion.img
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          src={images[idx]}
          alt=""
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          className="absolute right-6 text-white/50 hover:text-white text-5xl z-10 transition-colors"
        >
          &#8250;
        </button>
      )}

      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/50 hover:text-white text-2xl z-10 transition-colors"
      >
        &times;
      </button>

      {images.length > 1 && (
        <div className="absolute bottom-6 text-white/30 text-sm">
          {idx + 1} / {images.length}
        </div>
      )}
    </motion.div>
  );
}
