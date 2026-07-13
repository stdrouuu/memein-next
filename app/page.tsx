"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ExportControls from "@/public/components/export-controls";
import MemeCanvas from "@/public/components/meme-canvas";
import TextControls from "@/public/components/text-controls";
import UploadControls from "@/public/components/upload-controls";
import { useMeme } from "@/hooks/useMeme";
import { ToggleButton } from "@/public/components/toggle-button";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const memeBadges = [
  { text: "doge", color: "rgba(234, 179, 8, 0.08)", textCol: "rgba(202, 138, 4, 0.7)", borderCol: "rgba(234, 179, 8, 0.2)", x: "14%", y: "18%", rot: -8 },
  { text: "stonks", color: "rgba(16, 185, 129, 0.08)", textCol: "rgba(5, 150, 105, 0.7)", borderCol: "rgba(16, 185, 129, 0.2)", x: "83%", y: "20%", rot: 6 },
  { text: "wojak", color: "rgba(236, 72, 153, 0.08)", textCol: "rgba(219, 39, 119, 0.7)", borderCol: "rgba(236, 72, 153, 0.2)", x: "9%", y: "68%", rot: 12 },
  { text: "gigachad", color: "rgba(59, 130, 246, 0.08)", textCol: "rgba(37, 99, 235, 0.7)", borderCol: "rgba(59, 130, 246, 0.2)", x: "87%", y: "62%", rot: -10 },
  { text: "420", color: "rgba(168, 85, 247, 0.08)", textCol: "rgba(147, 51, 234, 0.7)", borderCol: "rgba(168, 85, 247, 0.2)", x: "76%", y: "42%", rot: 4 },
  { text: "69", color: "rgba(239, 68, 68, 0.08)", textCol: "rgba(220, 38, 38, 0.7)", borderCol: "rgba(239, 68, 68, 0.2)", x: "16%", y: "44%", rot: -6 }
];

export default function Home() {
  const {
    image,
    stageSize,
    stageRef,
    handleImageUpload,
    addText,
    updateText,
    deleteText,
    resetCanvas,
    exportImage,
    setSelectedId,
    textElements,
    selectedId,
  } = useMeme();

  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const floatingRefs = useRef<HTMLDivElement[]>([]);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP Animations
  useGSAP(() => {
    if (!mounted) return;

    // 1. Header fade/slide in
    gsap.fromTo(
      ".hero-stagger",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.1, ease: "power2.out" }
    );

    // 2. Bento cards smooth entry
    const cards = cardsRef.current.filter(Boolean);
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.4,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.3
      }
    );

    // 3. Ultra-slow floating loop for background elements
    const badges = floatingRefs.current.filter(Boolean);
    badges.forEach((el, index) => {
      gsap.to(el, {
        x: "random(-20, 20)",
        y: "random(-20, 20)",
        rotation: "random(-8, 8)",
        duration: "random(6, 10)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.4
      });
    });
  }, { scope: containerRef, dependencies: [mounted] });

  return (
    <div ref={containerRef} className="min-h-[100dvh] bg-white dark:bg-[#050505] text-black dark:text-white font-sans relative selection:bg-black/10 dark:selection:bg-white/20 overflow-x-hidden w-full max-w-full">
      
      {/* Elegant, Semi-Transparent Background Meme Badges */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {memeBadges.map((badge, idx) => (
          <div
            key={idx}
            ref={(el) => { if (el) floatingRefs.current[idx] = el; }}
            className="absolute px-3 py-1.5 font-bold border rounded-full text-xs tracking-wider transition-opacity duration-300"
            style={{
              left: badge.x,
              top: badge.y,
              backgroundColor: badge.color,
              color: badge.textCol,
              borderColor: badge.borderCol,
              transform: `rotate(${badge.rot}deg)`
            }}
          >
            {badge.text}
          </div>
        ))}
      </div>

      {/* Film grain noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02] z-50 pointer-events-none mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />
      </div>

      {/* Navigation (Floating Glass Pill) */}
      <nav className="fixed top-6 inset-x-0 mx-auto w-max z-50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] translate-y-0 opacity-100 p-1.5 rounded-full ring-1 ring-black/5 dark:ring-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-2xl">
        <div className="flex items-center gap-4 px-4 py-2 rounded-[calc(2rem-0.375rem)] bg-white/80 dark:bg-[#0a0a0a]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logomemein.png"
              alt="MemeIn Logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain brightness-0 dark:invert"
            />
            <span className="text-sm font-bold tracking-widest">Memein</span>
          </div>
          <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
          <ToggleButton />
        </div>
      </nav>

      {/* MAIN SINGLE WORKSPACE LAYOUT */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-32 pb-24 md:py-40 flex flex-col gap-16 md:gap-24">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center space-y-6 max-w-4xl mx-auto">
          <div className="hero-stagger pt-8">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-wide leading-[1.1] flex flex-wrap justify-center items-center gap-y-3">
              <span>Craft the</span>
              <span className="inline-flex items-center px-4 py-1.5 md:px-6 md:py-2.5 bg-yellow-500/10 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold text-xs md:text-sm tracking-widest uppercase rounded-full mx-3 border border-yellow-500/20 shadow-sm select-none">ultimate</span>
              <span>Meme.</span>
            </h1>
          </div>
          <p className="hero-stagger max-w-xl text-lg md:text-xl text-black/60 dark:text-white/60 font-normal tracking-wide leading-relaxed">
            Upload your image, orchestrate the typography, and export in a single fluid motion.
          </p>
        </header>

        {/* Bento Grid */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 grid-flow-dense">
            
            {/* Bento Card 1: Main Canvas Area */}
            <div 
              ref={(el) => { if (el) cardsRef.current[0] = el; }}
              className="md:col-span-8 md:row-span-2 group/bento bento-card"
            >
              {/* Minimalist Card wrapper */}
              <div className="w-full h-full rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl flex flex-col overflow-hidden">
                
                {/* Header of Canvas Workspace */}
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
                  <div className="flex gap-1.5 cursor-default">
                    <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10 transition-transform duration-300 hover:scale-110" />
                    <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10 transition-transform duration-300 hover:scale-110" />
                    <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10 transition-transform duration-300 hover:scale-110" />
                  </div>
                  <h2 className="text-xs font-mono font-medium tracking-widest text-black/40 dark:text-white/40">workspace.meme</h2>
                  <div className="w-9"></div>
                </div>

                {/* Canvas Body */}
                <div className="flex-1 flex justify-center items-center p-4 md:p-8 min-h-[400px]">
                  <MemeCanvas
                    image={image}
                    stageSize={stageSize}
                    stageRef={stageRef}
                    textElements={textElements}
                    onSelectText={setSelectedId}
                    onImageUpload={handleImageUpload}
                  />
                </div>
              </div>
            </div>

            {/* Bento Card 2: Upload Controls */}
            <div 
              ref={(el) => { if (el) cardsRef.current[1] = el; }}
              className="md:col-span-4 bento-card"
            >
              <div className="w-full h-full p-6 rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-pink-500/80" />
                  <h3 className="text-xs uppercase tracking-widest text-black/55 dark:text-white/55 font-bold">Media</h3>
                </div>
                <UploadControls onImageUpload={handleImageUpload} onReset={resetCanvas} />
              </div>
            </div>

            {/* Bento Card 3: Typography & Export */}
            <div 
              ref={(el) => { if (el) cardsRef.current[2] = el; }}
              className="md:col-span-4 flex flex-col gap-6 bento-card"
            >
              <div className="w-full flex-1 p-6 rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl flex flex-col justify-start gap-4">
                <div className="flex items-center gap-2 border-b border-black/5 dark:border-white/10 pb-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <h3 className="text-xs uppercase tracking-widest text-black/55 dark:text-white/55 font-bold">Typography</h3>
                </div>
                <TextControls
                  hasImage={!!image}
                  onAddText={addText}
                  selectedId={selectedId}
                  textElements={textElements}
                  onUpdateText={updateText}
                  onDeleteText={deleteText}
                />
              </div>

              <div className="w-full p-6 rounded-[2rem] border border-black/5 dark:border-white/10 bg-white/70 dark:bg-[#0a0a0a]/70 backdrop-blur-md shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl">
                <ExportControls hasImage={!!image} onExport={exportImage} />
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full pb-8 pt-12 flex justify-center items-center">
        <div className="text-[10px] uppercase tracking-[0.25em] font-medium text-black/40 dark:text-white/45">
          © 2026, Brandon J.S — Engineered for depth
        </div>
      </footer>
    </div>
  );
}
