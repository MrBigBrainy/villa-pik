"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      >
        <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/6.jpg')" }}
        />
        <div className="absolute inset-0 bg-black/30" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-6 flex flex-col justify-center items-center text-center text-white">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6"
        >
          A Collection of <br /> Exquisite Residences
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl font-light tracking-wide max-w-2xl mb-10"
        >
          Discover our curated portfolio of luxury villas, each offering a unique sanctuary of comfort and style.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          <Link
            href="#residences"
            className="px-8 py-4 bg-white text-zinc-900 text-sm font-bold tracking-widest uppercase hover:bg-zinc-100 transition-colors rounded-full"
          >
            Explore Collection
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
