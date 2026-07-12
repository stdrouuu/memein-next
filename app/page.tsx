"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ExportControls from "@/public/components/export-controls";
import MemeCanvas from "@/public/components/meme-canvas";
import TextControls from "@/public/components/text-controls";
import UploadControls from "@/public/components/upload-controls";
import { useMeme } from "@/hooks/useMeme";
import { ToggleButton } from "@/public/components/toggle-button";

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

  // Decorative image positions around the bento grid
  // SSR-safe defaults; randomized on every client mount
  type DecorItem = { top: string; side: 'left' | 'right'; offset: number; size: number };
  const [decorPos, setDecorPos] = useState<DecorItem[]>([
    { top: '6%',  side: 'left',  offset: 120, size: 220 },
    { top: '8%',  side: 'right', offset: 100, size: 200 },
    { top: '32%', side: 'left',  offset: 200, size: 240 },
    { top: '28%', side: 'right', offset: 110, size: 220 },
    { top: '62%', side: 'left',  offset: 120, size: 260 },
    { top: '72%', side: 'right', offset: 110, size: 220 },
  ]);

  useEffect(() => {
    const r = (min: number, max: number) => Math.random() * (max - min) + min;
    setDecorPos([
      { top: `${r(4,  12)}%`, side: 'left',  offset: r(80, 140),  size: r(200, 260) }, // Pepe
      { top: `${r(5,  15)}%`, side: 'right', offset: r(60, 130),  size: r(180, 240) }, // Croco
      { top: `${r(28, 40)}%`, side: 'left',  offset: r(180, 250), size: r(240, 310) }, // Meme Face (noun-meme-face-8203411)
      { top: `${r(22, 34)}%`, side: 'right', offset: r(70, 140),  size: r(200, 260) }, // Meme Face Alt
      { top: `${r(58, 70)}%`, side: 'left',  offset: r(80, 140),  size: r(240, 310) }, // Jackie Chan
      { top: `${r(68, 80)}%`, side: 'right', offset: r(70, 140),  size: r(200, 260) }, // Doge
    ]);
    setMounted(true);
  }, []);

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-[#050505] text-black dark:text-white font-sans relative selection:bg-black/10 dark:selection:bg-white/20">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes drift1 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          33% { transform: translate(40px, -60px) rotate(15deg) scale(1.1); }
          66% { transform: translate(-30px, 30px) rotate(-10deg) scale(0.9); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        @keyframes drift2 {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          50% { transform: translate(-50px, -40px) rotate(-20deg) scale(1.05); }
          100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }
        .meme-float-1 { animation: drift1 20s ease-in-out infinite; }
        .meme-float-2 { animation: drift2 25s ease-in-out infinite reverse; }
        .meme-float-3 { animation: drift1 22s ease-in-out infinite 5s; }
      `}} />

      {/* Background Texture */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Film grain noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-50 pointer-events-none mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />
      </div>

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
            <span className="text-sm font-bold tracking-widest uppercase">MemeIn</span>
          </div>
          <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
          <ToggleButton />
        </div>
      </nav>

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-32 pb-24 md:py-40 flex flex-col gap-16 md:gap-24">
        
        {/* Header Section */}
        <header className="flex flex-col items-center text-center space-y-6">
          <div
            className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.32,0.72,0,1)] ${
              mounted ? "translate-y-0 opacity-100 blur-0" : "translate-y-16 opacity-0 blur-md"
            }`}
          >
            <span className="inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-medium bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 mb-4">
              Creative Studio
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] flex flex-col items-center gap-2">
              <span>Craft the</span>
              <span>Ultimate Meme.</span>
            </h1>
          </div>
          <p
            className={`max-w-xl text-lg md:text-xl text-black/60 dark:text-white/60 font-medium transition-all duration-[1000ms] delay-100 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              mounted ? "translate-y-0 opacity-100 blur-0" : "translate-y-16 opacity-0 blur-md"
            }`}
          >
            Upload your image, orchestrate the typography, and export in a single fluid motion.
          </p>
        </header>

        {/* Asymmetrical Bento Grid */}
        <div className="relative">
          {/* Decorative images surrounding the sections, positioned relative to the bento wrapper */}
          {decorPos.map((p, i) => {
            const images = [
              { src: '/assets/noun-meme-7212264.png',        alt: 'Meme Icon' },
              { src: '/assets/noun-croco-7044312.png',        alt: 'Croco' },
              { src: '/assets/noun-meme-face-8203411.png',    alt: 'Meme Face' },
              { src: '/assets/noun-meme-face-8203404 - Copy.png', alt: 'Meme Face Alt' },
              { src: '/assets/noun-jackie-chan-105268.png',    alt: 'Jackie Chan' },
              { src: '/assets/noun-doge-99472.png',           alt: 'Doge' },
            ];
            const img = images[i];
            return (
              <div
                key={i}
                className="absolute opacity-20 dark:opacity-30 brightness-0 dark:invert pointer-events-none select-none z-0"
                style={{
                  top: p.top,
                  [p.side]: `-${p.offset}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                }}
              >
                <Image src={img.src} alt={img.alt} width={256} height={256} className="w-full h-full object-contain" />
              </div>
            );
          })}

          <div
            className={`grid grid-cols-1 md:grid-cols-12 gap-6 transition-all duration-[1200ms] delay-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              mounted ? "translate-y-0 opacity-100 blur-0" : "translate-y-16 opacity-0 blur-md"
            }`}
          >
            {/* Main Canvas Area */}
            <div className="md:col-span-8 md:row-span-2 group">
              {/* Double Bezel Outer Shell */}
              <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                {/* Inner Core */}
                <div className="w-full h-full relative overflow-hidden rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col">
                  <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
                    <div className="flex gap-1.5 group/window cursor-default">
                      <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] transition-all duration-300 hover:scale-110" />
                      <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] transition-all duration-300 hover:scale-110 delay-75" />
                      <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] transition-all duration-300 hover:scale-110 delay-150" />
                    </div>
                    <h2 className="text-sm font-semibold tracking-wide text-black/40 dark:text-white/40">workspace.meme</h2>
                    <div className="w-9"></div>
                  </div>
                  <div className="flex-1 flex justify-center items-center p-4 md:p-8 min-h-[400px]">
                    <MemeCanvas
                      image={image}
                      stageSize={stageSize}
                      stageRef={stageRef}
                      textElements={textElements}
                      onSelectText={setSelectedId}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Controls Side Panel 1: Upload */}
            <div className="md:col-span-4">
              <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-center gap-4">
                  <h3 className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 font-bold mb-2">Media</h3>
                  <UploadControls onImageUpload={handleImageUpload} onReset={resetCanvas} />
                </div>
              </div>
            </div>

            {/* Controls Side Panel 2: Typography & Export */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="w-full flex-1 p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-start gap-4">
                  <h3 className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 font-bold mb-2">Typography</h3>
                  <TextControls
                    hasImage={!!image}
                    onAddText={addText}
                    selectedId={selectedId}
                    textElements={textElements}
                    onUpdateText={updateText}
                    onDeleteText={deleteText}
                  />
                </div>
              </div>

              <div className="w-full p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
                  <ExportControls hasImage={!!image} onExport={exportImage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full pb-8 pt-12 flex justify-center items-center">
        <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-black/40 dark:text-white/40">
          © 2026, Brandon J.S — Engineered for depth
        </div>
      </footer>
    </div>
  );
}
