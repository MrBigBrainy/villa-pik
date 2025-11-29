"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const images = [
    "/1.jpg",
    "/2.jpg",
    "/5.jpg",
    "/7.jpg",
    "/8.jpg",
    "/9.jpg",
  ];

  // Define the target positions (in percentages) for the dispersed state
  // We'll use a 2x3 grid roughly
  const positions = [
    { top: "15%", left: "15%", rotate: -5 },
    { top: "15%", left: "50%", rotate: 0 },
    { top: "15%", left: "85%", rotate: 5 },
    { top: "60%", left: "15%", rotate: 5 },
    { top: "60%", left: "50%", rotate: 0 },
    { top: "60%", left: "85%", rotate: -5 },
  ];

  return (
    <section ref={containerRef} className="relative h-[300vh] bg-zinc-50">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center">
        <motion.div 
          style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [1, 0]) }}
          className="absolute top-20 z-10 text-center pointer-events-none"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4">
            Visual Journey
          </h2>
          <p className="text-zinc-500 font-light tracking-wide uppercase">
            Scroll to explore
          </p>
        </motion.div>

        <div className="relative w-full h-full flex items-center justify-center">
          {images.map((src, index) => {
            const pos = positions[index];
            
            // Randomize initial stack slightly
            const initialRotate = (index % 2 === 0 ? 1 : -1) * (Math.random() * 10);
            
            // Transform values
            // x: from center (50%) to target pos.left
            // We need to calculate the translation. 
            // Easier approach: Position them absolute at center, then translate OUT.
            
            // Let's assume the "center" is 50% 50%.
            // We want to interpolate from "50%" to `pos.left`.
            // Since we can't easily interpolate CSS strings like "50%" to "15%" in all cases with simple math without calc,
            // we'll use `useTransform` to map 0-1 to specific percentage strings if supported, or just use `left`/`top` directly.
            
            // Framer motion supports animating CSS variables or direct style props.
            
            const targetTop = pos.top;
            const targetLeft = pos.left;
            
            // We'll use a custom transform for each image
            const top = useTransform(scrollYProgress, [0, 1], ["50%", targetTop]);
            const left = useTransform(scrollYProgress, [0, 1], ["50%", targetLeft]);
            const rotate = useTransform(scrollYProgress, [0, 1], [initialRotate, pos.rotate]);
            const scale = useTransform(scrollYProgress, [0, 1], [1, 1]); // Maybe scale up slightly?
            
            // Add a slight z-index change so they don't clip weirdly when stacked
            const zIndex = images.length - index;

            return (
              <motion.div
                key={index}
                style={{ 
                  top, 
                  left, 
                  rotate,
                  scale,
                  zIndex,
                  x: "-50%", // Center the element on its anchor point
                  y: "-50%" 
                }}
                className="absolute w-[300px] h-[200px] md:w-[400px] md:h-[300px] shadow-2xl rounded-lg overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Gallery Image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
