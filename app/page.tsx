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
    { top: '0%',  side: 'left',  offset: 144, size: 160 },
    { top: '5%',  side: 'right', offset: 128, size: 144 },
    { top: '25%', side: 'left',  offset: 160, size: 176 },
    { top: '25%', side: 'right', offset: 160, size: 160 },
    { top: '60%', side: 'left',  offset: 144, size: 192 },
    { top: '50%', side: 'right', offset: 176, size: 208 },
    { top: '70%', side: 'right', offset: 144, size: 160 },
  ]);

  useEffect(() => {
    const r = (min: number, max: number) => Math.random() * (max - min) + min;
    setDecorPos([
      { top: `${r(0,  70)}%`, side: 'left',  offset: r(120, 200), size: r(130, 210) },
      { top: `${r(0,  65)}%`, side: 'right', offset: r(110, 190), size: r(130, 180) },
      { top: `${r(15, 75)}%`, side: 'left',  offset: r(130, 200), size: r(150, 210) },
      { top: `${r(20, 70)}%`, side: 'right', offset: r(130, 200), size: r(140, 200) },
      { top: `${r(45, 82)}%`, side: 'left',  offset: r(120, 190), size: r(160, 220) },
      { top: `${r(40, 80)}%`, side: 'right', offset: r(140, 210), size: r(175, 230) },
      { top: `${r(55, 85)}%`, side: 'right', offset: r(120, 185), size: r(130, 185) },
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

      {/* Background Texture & Pastel Glowing Blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-slate-50/50 dark:bg-[#050505]">
        {/* Film grain noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-50 pointer-events-none mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />
        
        {/* Soft pastel blobs */}
        <div className="absolute top-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-blue-200/20 dark:bg-blue-950/10 blur-[100px] pointer-events-none" />
        <div className="absolute top-[40%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-pink-200/25 dark:bg-purple-950/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[10%] w-[30vw] h-[30vw] rounded-full bg-emerald-100/20 dark:bg-emerald-950/5 blur-[90px] pointer-events-none" />
        <div className="absolute top-[70%] left-[50%] w-[25vw] h-[25vw] rounded-full bg-amber-100/15 dark:bg-amber-950/10 blur-[80px] pointer-events-none" />
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

      <main className="relative z-10 w-full max-w-full px-4 md:px-12 xl:px-20 pt-32 pb-24 md:py-40">
        
        {/* Decorative images surrounding the sections, positioned relative to the full viewport width */}
        {decorPos.map((p, i) => {
          const images = [
            { src: '/assets/noun-meme-7212264.png',        alt: 'Meme Icon',        bg: 'bg-emerald-50/90 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-200' },
            { src: '/assets/noun-croco-7044312.png',        alt: 'Croco',            bg: 'bg-teal-50/90 dark:bg-teal-950/20 border border-teal-200/60 dark:border-teal-800/40 text-teal-800 dark:text-teal-200' },
            { src: '/assets/noun-meme-face-8203411.png',    alt: 'Meme Face',        bg: 'bg-violet-50/90 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-800/40 text-violet-800 dark:text-violet-200' },
            { src: '/assets/noun-meme-face-8203404 - Copy.png', alt: 'Meme Face Alt', bg: 'bg-fuchsia-50/90 dark:bg-fuchsia-950/20 border border-fuchsia-200/60 dark:border-fuchsia-800/40 text-fuchsia-800 dark:text-fuchsia-200' },
            { src: '/assets/noun-jackie-chan-105268.png',    alt: 'Jackie Chan',      bg: 'bg-rose-50/90 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-800/40 text-rose-800 dark:text-rose-200' },
            { src: '/assets/noun-yao-ming-105260.png',      alt: 'Yao Ming',         bg: 'bg-sky-50/90 dark:bg-sky-950/20 border border-sky-200/60 dark:border-sky-800/40 text-sky-800 dark:text-sky-200' },
            { src: '/assets/noun-doge-99472.png',           alt: 'Doge',             bg: 'bg-amber-50/90 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-amber-800 dark:text-amber-200' },
          ];
          const img = images[i];
          return (
            <div
              key={i}
              className={`absolute p-3 rounded-2xl shadow-md ${img.bg} backdrop-blur-sm pointer-events-none select-none flex items-center justify-center transition-all duration-700 z-0`}
              style={{
                top: p.top,
                [p.side]: `${p.offset}vw`,
                width: `${p.size}px`,
                height: `${p.size}px`,
              }}
            >
              <div className="w-full h-full relative brightness-0 dark:invert opacity-75 dark:opacity-60">
                <Image src={img.src} alt={img.alt} fill className="object-contain p-0.5" />
              </div>
            </div>
          );
        })}

        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-16 md:gap-24 relative z-10">

          <div
            className={`grid grid-cols-1 md:grid-cols-12 gap-6 transition-all duration-[1200ms] delay-200 ease-[cubic-bezier(0.32,0.72,0,1)] ${
              mounted ? "translate-y-0 opacity-100 blur-0" : "translate-y-16 opacity-0 blur-md"
            }`}
          >
            {/* Main Canvas Area */}
            <div className="md:col-span-8 md:row-span-2 group">
              {/* Double Bezel Outer Shell */}
              <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-violet-50/50 dark:bg-violet-950/5 ring-1 ring-violet-100 dark:ring-violet-900/30 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-xl shadow-violet-100/10 dark:shadow-none">
                {/* Inner Core */}
                <div className="w-full h-full relative overflow-hidden rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white/95 dark:bg-[#0a0a0a]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col backdrop-blur-md">
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
              <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-pink-50/50 dark:bg-pink-950/5 ring-1 ring-pink-100 dark:ring-pink-900/30 shadow-xl shadow-pink-100/10 dark:shadow-none">
                <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white/95 dark:bg-[#0a0a0a]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-center gap-4 backdrop-blur-md">
                  <h3 className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 font-bold mb-2">Media</h3>
                  <UploadControls onImageUpload={handleImageUpload} onReset={resetCanvas} />
                </div>
              </div>
            </div>

            {/* Controls Side Panel 2: Typography & Export */}
            <div className="md:col-span-4 flex flex-col gap-6">
              <div className="w-full flex-1 p-1.5 md:p-2 rounded-[2rem] bg-sky-50/50 dark:bg-sky-950/5 ring-1 ring-sky-100 dark:ring-sky-900/30 shadow-xl shadow-sky-100/10 dark:shadow-none">
                <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white/95 dark:bg-[#0a0a0a]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-start gap-4 backdrop-blur-md">
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

              <div className="w-full p-1.5 md:p-2 rounded-[2rem] bg-amber-50/50 dark:bg-amber-950/5 ring-1 ring-amber-100 dark:ring-amber-900/30 shadow-xl shadow-amber-100/10 dark:shadow-none">
                <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white/95 dark:bg-[#0a0a0a]/95 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md">
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
