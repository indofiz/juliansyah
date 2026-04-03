"use client";

import { useEffect, useRef } from "react";

export default function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef({ x: 0, y: 0 });
  const rafId = useRef<number>(0);
  const isMoving = useRef(false);
  const stopTimer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const animate = () => {
      pos.current.x += (mouse.current.x - pos.current.x) * 0.15;
      pos.current.y += (mouse.current.y - pos.current.y) * 0.15;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }

      const dx = mouse.current.x - pos.current.x;
      const dy = mouse.current.y - pos.current.y;
      if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
        rafId.current = requestAnimationFrame(animate);
      } else {
        isMoving.current = false;
      }
    };

    const startLoop = () => {
      if (!isMoving.current) {
        isMoving.current = true;
        rafId.current = requestAnimationFrame(animate);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      startLoop();
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId.current);
      if (stopTimer.current) clearTimeout(stopTimer.current);
    };
  }, []);

  // Hide on touch devices
  return (
    <div
      ref={dotRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block"
      style={{ willChange: "transform" }}
    >
      <div className="h-3 w-3 rounded-full bg-brand" />
    </div>
  );
}
