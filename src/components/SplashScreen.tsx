"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("splashed")) return;
    setShow(true);
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("splashed", "1");
      document.body.style.overflow = "";
    }, 2400);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9997] flex items-center justify-center"
          style={{ background: "#0A0A0A" }}
        >
          {/* Line sweep */}
          <motion.div
            className="absolute left-0 right-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, #20FFA6, transparent)" }}
            initial={{ top: "0%" }}
            animate={{ top: "100%" }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
          />

          <div className="relative">
            <motion.h1
              className="font-heading text-5xl md:text-7xl font-bold"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{
                opacity: [0, 1, 1, 0],
                letterSpacing: ["0.5em", "0.05em", "0.05em", "0em"],
              }}
              transition={{ duration: 2.4, times: [0, 0.3, 0.7, 1] }}
            >
              <span className="gradient-text">Portfolio</span>
            </motion.h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
