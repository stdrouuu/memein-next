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

export default function Home() {
  const {
    image,
    stageSize,
    stageRef,
    handleImageUpload,
    handleFileSelect,
    addText,
    updateText,
    deleteText,
    resetCanvas,
    exportImage,
    setSelectedId,
    textElements,
    selectedId,
    handleUrlSelect,
  } = useMeme();

  const [loadingSkeleton, setLoadingSkeleton] = useState(true);
  const mainContentRef = useRef<HTMLDivElement>(null);
  const skeletonOverlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Skeleton Animation (Pulse overlay blocks)
    const skeletonTween = gsap.fromTo(
      ".skeleton-pulse",
      { opacity: 0.3 },
      {
        opacity: 0.7,
        repeat: -1,
        yoyo: true,
        duration: 0.8,
        ease: "power1.inOut",
        stagger: 0.12,
      }
    );

    // Simulate loading for the premium intro feel
    const timer = setTimeout(() => {
      // Fade out skeleton
      if (skeletonOverlayRef.current) {
        gsap.to(skeletonOverlayRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
          onComplete: () => {
            setLoadingSkeleton(false);
            skeletonTween.kill();
            
            // 2. First Opening (Intro animation with slight blur reveal)
            const introTl = gsap.timeline();
            introTl
              .to(mainContentRef.current, { opacity: 1, duration: 0.2 })
              .fromTo(
                ".intro-nav",
                { y: -80, opacity: 0, filter: "blur(8px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, ease: "power3.out" },
                "<"
              )
              .fromTo(
                ".intro-title-line",
                { y: 50, opacity: 0, filter: "blur(12px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.85, ease: "power4.out", stagger: 0.15 },
                "-=0.4"
              )
              .fromTo(
                ".intro-p",
                { y: 30, opacity: 0, filter: "blur(8px)" },
                { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out" },
                "-=0.5"
              )
              .fromTo(
                ".bento-card",
                { y: 50, scale: 0.96, opacity: 0, filter: "blur(10px)" },
                {
                  y: 0,
                  scale: 1,
                  opacity: 1,
                  filter: "blur(0px)",
                  duration: 0.9,
                  ease: "power3.out",
                  stagger: 0.12,
                },
                "-=0.5"
              )
              .fromTo(
                "footer",
                { opacity: 0, y: 20, filter: "blur(6px)" },
                { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power2.out" },
                "-=0.4"
              );
          },
        });
      }
    }, 1200);

    return () => {
      clearTimeout(timer);
      skeletonTween.kill();
    };
  }, []);

  return (
    <div className="min-h-[100dvh] bg-white dark:bg-[#050505] text-black dark:text-white font-sans relative selection:bg-black/10 dark:selection:bg-white/20 overflow-x-hidden">
      
      {/* Background Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Film grain noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] z-50 pointer-events-none mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />
      </div>


      {/* 1. SKELETON ANIMATION OVERLAY */}
      {loadingSkeleton && (
        <div
          ref={skeletonOverlayRef}
          className="fixed inset-0 z-50 bg-white dark:bg-[#050505] flex flex-col items-center px-4 md:px-8 pt-32 pb-24 md:py-40 max-w-[1400px] mx-auto w-full gap-16 md:gap-24"
        >
          {/* Skeleton Nav */}
          <div className="fixed top-6 inset-x-0 mx-auto w-48 h-12 rounded-full bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 flex items-center justify-center">
            <div className="skeleton-pulse w-32 h-4 rounded bg-black/10 dark:bg-white/10" />
          </div>

          {/* Skeleton Header */}
          <header className="flex flex-col items-center text-center space-y-6 w-full">
            <div className="space-y-3 w-full max-w-2xl flex flex-col items-center">
              <div className="skeleton-pulse w-3/4 h-16 md:h-20 rounded bg-black/10 dark:bg-white/10" />
              <div className="skeleton-pulse w-1/2 h-16 md:h-20 rounded bg-black/10 dark:bg-white/10" />
            </div>
            <div className="skeleton-pulse w-full max-w-md h-6 rounded bg-black/10 dark:bg-white/10" />
          </header>

          {/* Skeleton Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full h-[550px]">
            <div className="md:col-span-8 h-full p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
              <div className="w-full h-full rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] p-6 flex flex-col justify-between">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-black/10 dark:bg-white/10" />
                </div>
                <div className="skeleton-pulse w-full h-3/4 rounded-xl bg-black/5 dark:bg-white/5" />
                <div className="h-4" />
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-6 h-full">
              <div className="flex-1 p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                <div className="w-full h-full rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] p-6 flex flex-col justify-center gap-4">
                  <div className="skeleton-pulse w-1/3 h-4 rounded bg-black/10 dark:bg-white/10" />
                  <div className="skeleton-pulse w-full h-12 rounded bg-black/10 dark:bg-white/10" />
                  <div className="skeleton-pulse w-full h-12 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
              <div className="h-32 p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                <div className="w-full h-full rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] p-6 flex flex-col justify-center">
                  <div className="skeleton-pulse w-full h-10 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div ref={mainContentRef} style={{ opacity: loadingSkeleton ? 0 : 1 }}>
        <nav className="intro-nav fixed top-6 inset-x-0 mx-auto w-max z-50 p-1.5 rounded-full ring-1 ring-black/5 dark:ring-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-2xl">
          <div className="flex items-center gap-4 px-4 py-2 rounded-[calc(2rem-0.375rem)] bg-white/80 dark:bg-[#0a0a0a]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/logomemein.png"
                alt="MemeIn Logo"
                width={32}
                height={32}
                className="w-8 h-8 object-contain brightness-0 dark:invert"
              />
              <span className="text-sm font-bold">Memein</span>
            </div>
            <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
            <ToggleButton />
          </div>
        </nav>

        <main className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-32 pb-24 md:py-40 flex flex-col gap-16 md:gap-24">
          
          {/* Header Section */}
          <header className="flex flex-col items-center text-center space-y-6">
            <div className="pt-8 overflow-hidden">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] flex flex-col items-center gap-2">
                <span className="intro-title-line inline-block">Craft the</span>
                <span className="intro-title-line inline-block">Ultimate Meme.</span>
              </h1>
            </div>
            <p className="intro-p max-w-xl text-lg md:text-xl text-black/60 dark:text-white/60 font-medium">
              Upload your image, orchestrate the typography, and export in a single fluid motion.
            </p>
          </header>

          {/* Asymmetrical Bento Grid */}
          <div className="relative bento-container">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              
              {/* Main Canvas Area */}
              <div className="bento-card md:col-span-8 md:row-span-2 group">
                <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]">
                  <div className="w-full h-full relative overflow-hidden rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col">
                    <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
                      <div className="flex gap-1.5 group/window cursor-default">
                        <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] transition-all duration-300 hover:scale-110" />
                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] transition-all duration-300 hover:scale-110 delay-75" />
                        <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] transition-all duration-300 hover:scale-110 delay-150" />
                      </div>
                      <h2 className="text-sm font-semibold tracking-wide text-black/40 dark:text-white/40">workspace.meme</h2>
                      {image ? (
                        <button
                          onClick={resetCanvas}
                          className="text-xs font-bold uppercase tracking-wider text-black/40 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 bg-transparent transition-colors"
                        >
                          Reset
                        </button>
                      ) : (
                        <div className="w-9"></div>
                      )}
                    </div>
                    <div className="flex-1 flex justify-center items-center p-4 md:p-8 min-h-[400px]">
                      <MemeCanvas
                        image={image}
                        stageSize={stageSize}
                        stageRef={stageRef}
                        textElements={textElements}
                        selectedId={selectedId}
                        onSelectText={setSelectedId}
                        onUpdateText={updateText}
                        onImageUpload={handleImageUpload}
                        onFileDrop={handleFileSelect}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls Side Panel 1: Upload */}
              <div className="bento-card md:col-span-4">
                <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                  <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-center gap-4">
                    <UploadControls onImageUpload={handleImageUpload} onUrlSelect={handleUrlSelect} />
                  </div>
                </div>
              </div>

              {/* Controls Side Panel 2: Typography & Export */}
              <div className="bento-card md:col-span-4 flex flex-col gap-6">
                <div className="w-full flex-1 p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10">
                  <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] flex flex-col justify-start gap-4">
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

        <footer className="w-full pb-8 pt-12 flex justify-center items-center">
          <div className="text-[10px] uppercase tracking-[0.2em] font-medium text-black/40 dark:text-white/40">
            © 2026, Brandon J.S — Engineered for depth
          </div>
        </footer>
      </div>
    </div>
  );
}

