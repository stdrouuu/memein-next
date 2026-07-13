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
  { text: "DOGE", color: "#ffcc00", x: "12%", y: "15%", rot: -10 },
  { text: "STONKS", color: "#00e575", x: "85%", y: "18%", rot: 8 },
  { text: "WOJAK", color: "#ff007f", x: "8%", y: "70%", rot: 15 },
  { text: "GIGACHAD", color: "#00c3ff", x: "88%", y: "65%", rot: -12 },
  { text: "420", color: "#b500ff", x: "78%", y: "45%", rot: 5 },
  { text: "69", color: "#ff3c00", x: "15%", y: "45%", rot: -8 }
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

    // 1. Header elements stagger reveal
    gsap.fromTo(
      ".hero-stagger",
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "power3.out" }
    );

    // 2. Bento cards elastic entrance
    const cards = cardsRef.current.filter(Boolean);
    gsap.fromTo(
      cards,
      { y: 80, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 1.2,
        stagger: 0.1,
        ease: "back.out(1.2)",
        delay: 0.4
      }
    );

    // 3. Floating background badges movement loop
    const badges = floatingRefs.current.filter(Boolean);
    badges.forEach((el, index) => {
      gsap.to(el, {
        x: "random(-35, 35)",
        y: "random(-35, 35)",
        rotation: "random(-18, 18)",
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.3
      });
    });
  }, { scope: containerRef, dependencies: [mounted] });

  return (
    <div ref={containerRef} className="min-h-[100dvh] bg-white dark:bg-[#050505] text-black dark:text-white font-sans relative selection:bg-black/10 dark:selection:bg-white/20 overflow-x-hidden w-full max-w-full">
      
      {/* Colorful Floating Background Meme Badges */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none opacity-25 dark:opacity-20">
        {memeBadges.map((badge, idx) => (
          <div
            key={idx}
            ref={(el) => { if (el) floatingRefs.current[idx] = el; }}
            className="absolute px-4 py-2 font-black border-2 border-black dark:border-white shadow-[3px_3px_0px_#000] dark:shadow-[3px_3px_0px_#fff] text-xs md:text-sm tracking-widest rounded-lg"
            style={{
              left: badge.x,
              top: badge.y,
              backgroundColor: badge.color,
              color: "#000",
              transform: `rotate(${badge.rot}deg)`
            }}
          >
            {badge.text}
          </div>
        ))}
      </div>

      {/* Film grain noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] z-50 pointer-events-none mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />
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
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] flex flex-wrap justify-center items-center">
              <span>Craft the</span>
              <span className="inline-block px-3 py-1 md:px-5 md:py-2 bg-[#ffcc00] text-black font-black text-xs md:text-lg uppercase -rotate-6 select-none shadow-[4px_4px_0px_#000] border-2 border-black rounded-lg mx-3 transform hover:scale-105 transition-transform">STONKS</span>
              <span>Ultimate Meme.</span>
            </h1>
          </div>
          <p className="hero-stagger max-w-xl text-lg md:text-xl text-black/60 dark:text-white/60 font-medium">
            Upload your image, orchestrate the typography, and export in a single fluid motion.
          </p>
        </header>

        {/* Asymmetrical Bento Grid with Solid Accent Shadows */}
        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 grid-flow-dense">
            
            {/* Bento Card 1: Main Canvas Area */}
            <div 
              ref={(el) => { if (el) cardsRef.current[0] = el; }}
              className="md:col-span-8 md:row-span-2 group/bento bento-card"
            >
              {/* Neo-brutalist Solid Card wrapping */}
              <div className="w-full h-full rounded-[2rem] border-4 border-black dark:border-white bg-white dark:bg-[#0a0a0a] shadow-[8px_8px_0px_#00c3ff] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#00c3ff] active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0px_#00c3ff] flex flex-col overflow-hidden">
                
                {/* Header of Canvas Workspace */}
                <div className="px-6 py-4 border-b-2 border-black dark:border-white flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
                  <div className="flex gap-1.5 cursor-default">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border-2 border-black transition-all duration-300 hover:scale-110" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border-2 border-black transition-all duration-300 hover:scale-110" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border-2 border-black transition-all duration-300 hover:scale-110" />
                  </div>
                  <h2 className="text-xs font-mono font-bold tracking-wide text-black/50 dark:text-white/50">workspace.meme</h2>
                  <div className="w-9"></div>
                </div>

                {/* Canvas Canvas Body */}
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
              <div className="w-full h-full p-6 rounded-[2rem] border-4 border-black dark:border-white bg-white dark:bg-[#0a0a0a] shadow-[8px_8px_0px_#ff007f] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#ff007f] active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0px_#ff007f] flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2 border-b-2 border-black dark:border-white pb-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff007f] border border-black dark:border-white" />
                  <h3 className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60 font-black">Media Upload</h3>
                </div>
                <UploadControls onImageUpload={handleImageUpload} onReset={resetCanvas} />
              </div>
            </div>

            {/* Bento Card 3: Typography & Export (Combined side layout) */}
            <div 
              ref={(el) => { if (el) cardsRef.current[2] = el; }}
              className="md:col-span-4 flex flex-col gap-6 bento-card"
            >
              <div className="w-full flex-1 p-6 rounded-[2rem] border-4 border-black dark:border-white bg-white dark:bg-[#0a0a0a] shadow-[8px_8px_0px_#ffcc00] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#ffcc00] active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0px_#ffcc00] flex flex-col justify-start gap-4">
                <div className="flex items-center gap-2 border-b-2 border-black dark:border-white pb-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ffcc00] border border-black dark:border-white" />
                  <h3 className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60 font-black">Typography</h3>
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

              <div className="w-full p-6 rounded-[2rem] border-4 border-black dark:border-white bg-white dark:bg-[#0a0a0a] shadow-[8px_8px_0px_#00e575] transition-all duration-300 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[12px_12px_0px_#00e575] active:translate-x-1 active:translate-y-1 active:shadow-[4px_4px_0px_#00e575]">
                <ExportControls hasImage={!!image} onExport={exportImage} />
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full pb-8 pt-12 flex flex-col justify-center items-center gap-2 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="text-[10px] uppercase tracking-[0.22em] font-black text-black/50 dark:text-white/50">
          © 2026, Brandon J.S — Engineered for depth
        </div>
        <div className="text-[8px] uppercase tracking-[0.15em] font-bold text-black/30 dark:text-white/30">
          Meme Status: Level 9000 Brainrot
        </div>
      </footer>
    </div>
  );
}
