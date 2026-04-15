"use client";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PuzzleBackground from "./PuzzleBackground";

const WORD = "DESIGN";
const TILE_COLORS = ["#5249FF", "#49FFB6", "#4242FF", "#49FFB6", "#94FF42", "#49FFB6"];
const CONFETTI_COLORS = ["#20FFA6", "#49FFB6", "#5249FF", "#4242FF", "#94FF42", "#FFD700"];
const DECOY_LETTERS = ["A", "B", "C", "F", "H", "K", "M", "P", "R", "T", "V", "W", "X", "Y", "Z"];

interface FloatingTile {
  char: string;
  color: string;
  isCorrect: boolean;
  // Unique drift path
  xPath: number[];
  yPath: number[];
  rPath: number[];
  duration: number;
  delay: number;
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Individual floating tile that uses local state for drag, so the parent
// component does not re-render and shake the title/slot area.
function FloatingTileItem({
  tile,
  tileRef,
  shapeClass,
  tileStyle,
  textColor,
  textOpacity,
  onDragStart,
  onDragEnd,
}: {
  tile: FloatingTile;
  isCorrect: boolean;
  tileRef?: React.Ref<HTMLDivElement>;
  shapeClass: string;
  tileStyle: React.CSSProperties;
  textColor: string;
  textOpacity: number;
  onDragStart: () => void;
  onDragEnd: (
    rect: DOMRect | null,
    point: { x: number; y: number }
  ) => void;
}) {
  const [grabbed, setGrabbed] = useState(false);
  const localRef = useRef<HTMLDivElement>(null);

  const setRefs = (el: HTMLDivElement | null) => {
    localRef.current = el;
    if (typeof tileRef === "function") tileRef(el);
    else if (tileRef && "current" in tileRef) {
      (tileRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    }
  };

  return (
    <motion.div
      ref={setRefs}
      drag
      dragMomentum={false}
      dragElastic={0.4}
      onDragStart={() => {
        setGrabbed(true);
        onDragStart();
      }}
      onDragEnd={(_e, info) => {
        const rect = localRef.current?.getBoundingClientRect() ?? null;
        onDragEnd(rect, info.point);
      }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={
        grabbed
          ? { opacity: 1, scale: 1 }
          : {
              opacity: 1,
              scale: 1,
              x: tile.xPath,
              y: tile.yPath,
              rotate: tile.rPath,
            }
      }
      transition={
        grabbed
          ? { type: "spring", stiffness: 300, damping: 25 }
          : {
              opacity: { delay: tile.delay - 0.4, duration: 0.4 },
              scale: {
                delay: tile.delay - 0.4,
                type: "spring",
                stiffness: 300,
                damping: 18,
              },
              x: {
                duration: tile.duration,
                repeat: Infinity,
                ease: "linear",
                delay: tile.delay,
              },
              y: {
                duration: tile.duration,
                repeat: Infinity,
                ease: "linear",
                delay: tile.delay,
              },
              rotate: {
                duration: tile.duration,
                repeat: Infinity,
                ease: "linear",
                delay: tile.delay,
              },
            }
      }
      whileDrag={{
        scale: 1.15,
        zIndex: 100,
        boxShadow: `0 12px 40px ${tile.color}60`,
      }}
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      className={`absolute w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 ${shapeClass} flex items-center justify-center select-none pointer-events-auto`}
      style={{
        ...tileStyle,
        cursor: "grab",
        touchAction: "none",
        willChange: "transform",
      }}
    >
      <span
        className="font-heading text-xl md:text-2xl lg:text-3xl font-bold pointer-events-none"
        style={{ color: textColor, opacity: textOpacity }}
      >
        {tile.char}
      </span>
    </motion.div>
  );
}

function makeDriftPath(safeTopY: number): {
  x: number[];
  y: number[];
  r: number[];
} {
  const points = 10;
  const x: number[] = [];
  const y: number[] = [];
  const r: number[] = [];
  // Use viewport size so tiles can roam the whole screen
  const w =
    typeof window !== "undefined" ? window.innerWidth : 1200;
  const h =
    typeof window !== "undefined" ? window.innerHeight : 800;
  const halfW = w / 2 - 60;
  const maxY = h / 2 - 60;
  // safeTopY = how far above center the slots/title occupy
  // tiles must stay below that boundary (downward y is positive)
  const minY = -h / 2 + safeTopY + 40;

  for (let i = 0; i < points; i++) {
    x.push(rand(-halfW, halfW));
    y.push(rand(minY, maxY));
    r.push(rand(-15, 15));
  }
  // Loop back to start for seamless animation
  x.push(x[0]);
  y.push(y[0]);
  r.push(r[0]);
  return { x, y, r };
}

export default function PuzzleIntro() {
  const [dismissed, setDismissed] = useState(false);
  const [ready, setReady] = useState(false);
  const [solved, setSolved] = useState(false);
  const [dragged, setDragged] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [missingIndex, setMissingIndex] = useState(0);
  const [ghostPos, setGhostPos] = useState<{
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    size: number;
  } | null>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  const missingChar = WORD[missingIndex];
  const missingColor = TILE_COLORS[missingIndex];

  // Generate floating tiles: 1 correct + 2 decoys
  const tiles = useMemo<FloatingTile[]>(() => {
    if (!ready) return [];
    const decoyChars = DECOY_LETTERS
      .filter((c) => c !== missingChar)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    const decoyColors = ["#FF6B6B", "#FFB84D"];

    // Reserve top area for ROCKET title + slots
    const safeTop = 200;

    const all: FloatingTile[] = [
      {
        char: missingChar,
        color: missingColor,
        isCorrect: true,
        ...(() => {
          const p = makeDriftPath(safeTop);
          return { xPath: p.x, yPath: p.y, rPath: p.r };
        })(),
        duration: rand(35, 45),
        delay: 1,
      },
      ...decoyChars.map((c, i) => {
        const p = makeDriftPath(safeTop);
        return {
          char: c,
          color: decoyColors[i],
          isCorrect: false,
          xPath: p.x,
          yPath: p.y,
          rPath: p.r,
          duration: rand(30, 50),
          delay: 1 + i * 0.3,
        };
      }),
    ];

    // Shuffle so correct one isn't always first visually
    return all.sort(() => Math.random() - 0.5);
  }, [ready, missingChar, missingColor]);

  // Calculate absolute positions of tile and slot in viewport
  const calcGhostOffset = useCallback(() => {
    const slot = slotRef.current;
    const tile = tileRef.current;
    if (!slot || !tile) return;
    const sr = slot.getBoundingClientRect();
    const tr = tile.getBoundingClientRect();
    setGhostPos({
      startX: tr.left,
      startY: tr.top,
      endX: sr.left,
      endY: sr.top,
      size: tr.width,
    });
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem("puzzle_done")) {
      setDismissed(true);
      return;
    }
    setMissingIndex(Math.floor(Math.random() * WORD.length));
    document.body.style.overflow = "hidden";
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const t1 = setTimeout(calcGhostOffset, 500);
    const t2 = setTimeout(calcGhostOffset, 1000);
    window.addEventListener("resize", calcGhostOffset);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", calcGhostOffset);
    };
  }, [ready, missingIndex, calcGhostOffset]);

  function fireConfetti() {
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    for (let i = 0; i < 60; i++) {
      const el = document.createElement("div");
      const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      const angle = Math.random() * Math.PI * 2;
      const dist = 100 + Math.random() * 350;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 150;
      const size = 4 + Math.random() * 8;
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
        boxShadow: `0 0 6px ${color}`,
      });
      el.style.setProperty("--dx", `${dx}px`);
      el.style.setProperty("--dy", `${dy}px`);
      el.style.setProperty("--spin", `${Math.random() * 720 - 360}deg`);
      el.style.animation = `confetti ${0.6 + Math.random() * 0.6}s ease-out forwards`;
      document.body.appendChild(el);
      el.addEventListener("animationend", () => el.remove());
    }
  }

  function handleDragEnd(
    isCorrect: boolean,
    tileRect: DOMRect | null,
    point: { x: number; y: number }
  ) {
    const slot = slotRef.current;
    if (!slot) return;
    const r = slot.getBoundingClientRect();
    const slotCx = r.left + r.width / 2;
    const slotCy = r.top + r.height / 2;

    // Three independent checks — if ANY passes, treat as inside the slot.
    // This makes the drop very forgiving regardless of how the user grabs.

    // 1) Mouse pointer landed near the slot
    const pointDist = Math.hypot(point.x - slotCx, point.y - slotCy);
    const pointHit = pointDist <= 200;

    // 2) Tile rect overlaps slot rect (with padding)
    let rectHit = false;
    if (tileRect) {
      const padding = 80;
      rectHit =
        tileRect.right >= r.left - padding &&
        tileRect.left <= r.right + padding &&
        tileRect.bottom >= r.top - padding &&
        tileRect.top <= r.bottom + padding;
    }

    // 3) Tile center within distance threshold
    let centerHit = false;
    if (tileRect) {
      const tCx = tileRect.left + tileRect.width / 2;
      const tCy = tileRect.top + tileRect.height / 2;
      const centerDist = Math.hypot(tCx - slotCx, tCy - slotCy);
      centerHit = centerDist <= 200;
    }

    const inSlot = pointHit || rectHit || centerHit;

    if (inSlot && isCorrect) {
      triggerSuccess();
    } else if (inSlot && !isCorrect) {
      setWrong(true);
      setTimeout(() => setWrong(false), 500);
    }
  }

  function triggerSuccess() {
    setSolved(true);
    fireConfetti();
    setTimeout(() => {
      setDismissed(true);
      sessionStorage.setItem("puzzle_done", "1");
      document.body.style.overflow = "";
    }, 2500);
  }

  function skipPuzzle() {
    setDismissed(true);
    sessionStorage.setItem("puzzle_done", "1");
    document.body.style.overflow = "";
  }

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="puzzle"
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[9997] flex flex-col items-center justify-center"
          style={{ background: "#0A0A0A" }}
        >
          <PuzzleBackground />

          {/* TODO: 나중에 본인 이름으로 교체 (예: "YOONSUNGHO") */}
          <motion.p
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 0.12, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold text-white select-none mb-10 relative z-10"
          >
            ROCKET
          </motion.p>

          {/* Slots row - 5 filled, 1 empty */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3 md:gap-4 mb-4 relative z-10"
          >
            {WORD.split("").map((char, i) => {
              const isMissing = i === missingIndex;
              const color = TILE_COLORS[i];

              if (!isMissing) {
                return (
                  <motion.div
                    key={`slot-${i}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center"
                    style={{
                      // Darker, more subtle border so the bright letter stands out
                      border: `2px solid ${color}40`,
                      background: `${color}08`,
                      boxShadow: `0 0 12px ${color}15`,
                    }}
                  >
                    <span
                      className="font-heading text-xl md:text-2xl lg:text-3xl font-bold"
                      style={{
                        // Brighter, fully opaque letter
                        color: "#FFFFFF",
                        textShadow: `0 0 12px ${color}80`,
                      }}
                    >
                      {char}
                    </span>
                  </motion.div>
                );
              }

              return (
                <motion.div
                  key={`slot-${i}`}
                  ref={slotRef}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={
                    wrong
                      ? {
                          opacity: 1,
                          scale: 1,
                          x: [0, -8, 8, -8, 8, 0],
                          borderColor: "#FF4444",
                        }
                      : solved
                      ? { opacity: 1, scale: 1 }
                      : {
                          opacity: 1,
                          scale: 1,
                          borderColor: [
                            "rgba(255,255,255,0.1)",
                            `${missingColor}80`,
                            "rgba(255,255,255,0.1)",
                          ],
                          boxShadow: [
                            `0 0 0px ${missingColor}00`,
                            `0 0 24px ${missingColor}50`,
                            `0 0 0px ${missingColor}00`,
                          ],
                        }
                  }
                  transition={
                    wrong
                      ? { duration: 0.4 }
                      : solved
                      ? { duration: 0.3 }
                      : {
                          opacity: { delay: 0.3 + i * 0.05 },
                          scale: { delay: 0.3 + i * 0.05 },
                          borderColor: {
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                          },
                          boxShadow: {
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 1,
                          },
                        }
                  }
                  className="w-14 h-14 md:w-18 md:h-18 lg:w-20 lg:h-20 rounded-xl flex items-center justify-center"
                  style={{
                    border: solved
                      ? `2px solid ${color}`
                      : "2px dashed rgba(255,255,255,0.1)",
                    background: solved
                      ? `${color}10`
                      : "rgba(255,255,255,0.02)",
                  }}
                >
                  {solved ? (
                    <motion.span
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      className="font-heading text-xl md:text-2xl lg:text-3xl font-bold"
                      style={{ color }}
                    >
                      {char}
                    </motion.span>
                  ) : (
                    <motion.span
                      className="font-heading text-xl md:text-2xl lg:text-3xl font-bold select-none"
                      animate={{
                        color: [
                          `${missingColor}40`,
                          `${missingColor}90`,
                          `${missingColor}40`,
                        ],
                      }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    >
                      {char}
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </motion.div>


          {/* Floating tiles: 1 correct + 2 decoys, drift across whole screen */}
          {ready && !solved && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
              {tiles.map((tile, idx) => {
                // Decoys: outline only + circle shape, lighter feel
                const shapeClass = tile.isCorrect
                  ? "rounded-xl"
                  : "rounded-full";
                const tileStyle = tile.isCorrect
                  ? {
                      background: tile.color,
                      boxShadow: `0 4px 24px ${tile.color}30`,
                    }
                  : {
                      background: "transparent",
                      border: `2px dashed ${tile.color}90`,
                      boxShadow: `0 0 16px ${tile.color}20`,
                    };
                const textColor = tile.isCorrect ? "#000" : `${tile.color}`;
                const textOpacity = tile.isCorrect ? 1 : 0.7;

                return (
                  <FloatingTileItem
                    key={`${tile.char}-${idx}`}
                    tile={tile}
                    isCorrect={tile.isCorrect}
                    tileRef={tile.isCorrect ? tileRef : undefined}
                    shapeClass={shapeClass}
                    tileStyle={tileStyle}
                    textColor={textColor}
                    textOpacity={textOpacity}
                    onDragStart={() => setDragged(true)}
                    onDragEnd={(rect, point) => {
                      handleDragEnd(tile.isCorrect, rect, point);
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Text hint - always rendered to prevent layout shift */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{
              opacity: solved ? 0 : 0.5,
            }}
            transition={{ duration: 0.3, delay: solved ? 0 : 1.2 }}
            className="mb-12 text-xs text-white select-none pointer-events-none tracking-wider relative z-10"
          >
            떠다니는 글자를 드래그해서 빈칸에 넣어보세요
          </motion.p>

          {/* Success overlay - blurs the whole stage */}
          <AnimatePresence>
            {solved && (
              <motion.div
                initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 flex flex-col items-center justify-center z-[60] pointer-events-none"
                style={{
                  background: "rgba(10,10,10,0.4)",
                  WebkitBackdropFilter: "blur(20px)",
                }}
              >
                <motion.div
                  initial={{ scale: 0, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 14,
                    delay: 0.3,
                  }}
                  className="font-heading text-6xl md:text-8xl lg:text-9xl font-bold gradient-text mb-6"
                >
                  Welcome!
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 14,
                    delay: 0.5,
                  }}
                  className="text-5xl md:text-6xl"
                >
                  🚀
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 0.6, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="mt-6 text-sm text-white tracking-wider"
                >
                  포트폴리오로 이동합니다...
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip */}
          {!solved && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              transition={{ delay: 2 }}
              onClick={skipPuzzle}
              className="absolute bottom-8 text-xs text-white hover:opacity-60 transition-opacity cursor-pointer"
            >
              건너뛰기
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
