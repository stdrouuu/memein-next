"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import ExportControls from "@/public/components/export-controls";
import MemeCanvas from "@/public/components/meme-canvas";
import TextControls from "@/public/components/text-controls";
import UploadControls from "@/public/components/upload-controls";
import { useMeme } from "@/hooks/useMeme";
import { ToggleButton } from "@/public/components/toggle-button";
import { ChevronLeft, ChevronRight, Sparkles, MoveRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register GSAP plugins safely on client side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const testimonials = [
  {
    quote: "I don't always create memes, but when I do, I use MemeIn. The canvas velocity is simply superior.",
    author: "The Most Interesting Man",
    role: "Legendary Meme Icon",
    image: "https://picsum.photos/seed/interesting/150/150",
  },
  {
    quote: "Such speed. Much styling. Very canvas. Wow. This generator sets the Doge standard.",
    author: "Doge",
    role: "Chief Vibe Officer",
    image: "https://picsum.photos/seed/doge/150/150",
  },
  {
    quote: "After shifting to MemeIn for viral templates, my account reach went up by 420%. Stonks!",
    author: "Stonks Guy",
    role: "Financial Meme Guru",
    image: "https://picsum.photos/seed/stonks/150/150",
  }
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
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const pinnedLeftRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // GSAP Animations
  useGSAP(() => {
    if (!mounted) return;

    // 1. Hero text letters/words stagger reveal
    gsap.fromTo(
      ".hero-reveal",
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, stagger: 0.15, ease: "power4.out" }
    );

    // 2. Hero elements float loop
    gsap.to(".floating-card-1", {
      y: -20,
      rotate: -8,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut"
    });
    gsap.to(".floating-card-2", {
      y: 20,
      rotate: 12,
      duration: 6,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 0.5
    });
    gsap.to(".floating-card-3", {
      y: -15,
      rotate: -2,
      duration: 4.5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
      delay: 1
    });

    // 3. Infinite Marquee loop
    if (marqueeRef.current) {
      const width = marqueeRef.current.scrollWidth / 2;
      gsap.to(marqueeRef.current, {
        x: -width,
        duration: 35,
        ease: "none",
        repeat: -1
      });
    }

    // 4. Scroll Pinning & Stacking Cards
    const cards = cardsRef.current.filter(Boolean);
    cards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { scale: 0.9, opacity: 0.5, y: 50 },
        {
          scale: 1 - (cards.length - 1 - index) * 0.03,
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 35%",
            scrub: true,
          }
        }
      );
    });

    // 5. Scrubbing Text Reveals inside pinned section
    const words = gsap.utils.toArray<HTMLElement>(".scrub-word");
    if (words.length > 0) {
      gsap.fromTo(
        words,
        { opacity: 0.15 },
        {
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: "#desire-section",
            start: "top 70%",
            end: "top 25%",
            scrub: true,
          }
        }
      );
    }
  }, { scope: containerRef, dependencies: [mounted] });

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const scrollToEditor = () => {
    document.getElementById("editor-workspace")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToVirality = () => {
    document.getElementById("desire-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={containerRef} className="min-h-[100dvh] bg-white dark:bg-[#050505] text-black dark:text-white font-sans relative selection:bg-black/10 dark:selection:bg-white/20 overflow-x-hidden w-full max-w-full">
      {/* Background radial gradient glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/10 dark:bg-violet-500/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-[800px] right-1/4 w-[600px] h-[600px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Film grain noise overlay */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] z-50 pointer-events-none mix-blend-overlay bg-[url('https://upload.wikimedia.org/wikipedia/commons/7/76/1k_Dissolve_Noise_Texture.png')] bg-repeat" />
      </div>

      {/* Navigation (Floating Glass Pill) */}
      <nav className="fixed top-6 inset-x-0 mx-auto w-max z-50 transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] translate-y-0 opacity-100 p-1.5 rounded-full ring-1 ring-black/5 dark:ring-white/10 bg-white/50 dark:bg-black/50 backdrop-blur-2xl">
        <div className="flex items-center gap-6 px-5 py-2 rounded-[calc(2rem-0.375rem)] bg-white/80 dark:bg-[#0a0a0a]/80 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Image
              src="/assets/logomemein.png"
              alt="MemeIn Logo"
              width={28}
              height={28}
              className="w-7 h-7 object-contain brightness-0 dark:invert"
            />
            <span className="text-sm font-black tracking-widest uppercase">Memein</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-5 text-xs font-semibold tracking-wider text-black/60 dark:text-white/60">
            <button onClick={scrollToEditor} className="hover:text-black dark:hover:text-white transition-colors">Editor</button>
            <button onClick={scrollToVirality} className="hover:text-black dark:hover:text-white transition-colors">Virality</button>
          </div>

          <div className="w-[1px] h-4 bg-black/10 dark:bg-white/10" />
          <ToggleButton />
        </div>
      </nav>

      {/* ATTENTION: Hero Section (Editorial Split) */}
      <header className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8 pt-36 pb-24 md:py-48 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        {/* Left Column: Typography Stack */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-left gap-8">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-balance flex flex-wrap items-center">
              <span className="hero-reveal inline-block">Draft the</span>
              <span className="hero-reveal inline-block w-16 h-8 md:w-28 md:h-12 rounded-full align-middle bg-cover bg-center mx-2 md:mx-4 border border-black/10 dark:border-white/20 shadow-lg transform hover:scale-105 transition-transform duration-300 bg-no-repeat" style={{backgroundImage: 'url(https://picsum.photos/seed/memecrafter/300/150)', filter: 'contrast(1.1) brightness(0.95)'}}></span>
              <span className="hero-reveal inline-block">Ultimate</span>
              <span className="hero-reveal inline-block">Meme.</span>
            </h1>
          </div>
          
          <p className="hero-reveal max-w-lg text-lg md:text-xl text-black/60 dark:text-white/60 font-medium leading-relaxed">
            Upload your media, sculpt typography, and export viral ideas in a single fluid gesture.
          </p>

          <div className="hero-reveal flex items-center gap-4 mt-2">
            <button 
              onClick={scrollToEditor}
              className="px-8 py-4 text-sm font-bold rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 transition-all duration-300 shadow-xl flex items-center gap-2 group cursor-pointer"
            >
              Start Generating
              <MoveRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
            <button 
              onClick={scrollToVirality}
              className="px-6 py-4 text-sm font-bold rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors duration-300"
            >
              Virality Physics
            </button>
          </div>
        </div>

        {/* Right Column: Layered floating interactive graphics */}
        <div className="w-full lg:w-1/2 flex justify-center items-center relative min-h-[350px] lg:min-h-[500px]">
          <div className="absolute w-[240px] h-[240px] md:w-[320px] md:h-[320px] bg-violet-600/20 rounded-full blur-[100px] pointer-events-none" />
          
          {/* Card 1 (Back Layer) */}
          <div className="floating-card-1 absolute w-[240px] md:w-[300px] aspect-[4/3] rounded-2xl bg-white/5 dark:bg-[#0a0a0a]/40 backdrop-blur-md border border-black/5 dark:border-white/5 p-4 shadow-2xl rotate-[-12deg] -translate-x-12 -translate-y-8 select-none pointer-events-none">
            <div className="w-full h-full relative rounded-lg overflow-hidden bg-black/10 dark:bg-white/5">
              <Image 
                src="https://picsum.photos/seed/retro/400/300" 
                alt="Retro Meme Background" 
                fill 
                className="object-cover opacity-60 grayscale" 
              />
              <div className="absolute inset-x-0 top-3 text-center text-white font-black text-lg tracking-wide uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                ME WHEN I CODE
              </div>
            </div>
          </div>

          {/* Card 2 (Middle Layer) */}
          <div className="floating-card-2 absolute w-[240px] md:w-[300px] aspect-[4/3] rounded-2xl bg-white/10 dark:bg-[#0d0d0d]/60 backdrop-blur-md border border-black/10 dark:border-white/10 p-4 shadow-2xl rotate-[8deg] translate-x-16 translate-y-4 select-none pointer-events-none">
            <div className="w-full h-full relative rounded-lg overflow-hidden bg-black/10 dark:bg-white/5">
              <Image 
                src="https://picsum.photos/seed/drake/400/300" 
                alt="Drake Style Meme" 
                fill 
                className="object-cover opacity-80" 
              />
              <div className="absolute inset-x-0 bottom-3 text-center text-white font-black text-lg tracking-wide uppercase drop-shadow-[0_2px_2px_rgba(0,0,0,1)]">
                IT JUST WORKS
              </div>
            </div>
          </div>

          {/* Card 3 (Front Layer - Workspace Mockup) */}
          <div className="floating-card-3 absolute w-[260px] md:w-[320px] aspect-[4/3] rounded-3xl bg-white/95 dark:bg-[#121212]/95 border border-black/10 dark:border-white/20 p-5 shadow-2xl rotate-[-2deg] translate-y-8 z-20">
            <div className="w-full h-full flex flex-col justify-between">
              <div className="flex justify-between items-center pb-2 border-b border-black/5 dark:border-white/5 text-[9px] font-mono opacity-50">
                <span>workspace.meme</span>
                <span className="text-emerald-500">● LIVE</span>
              </div>
              <div className="flex-1 my-3 rounded-lg overflow-hidden relative bg-black/[0.02] dark:bg-white/[0.02] border border-black/5 dark:border-white/5 flex items-center justify-center">
                <Image 
                  src="https://picsum.photos/seed/canvas/400/300" 
                  alt="Meme Canvas Mockup" 
                  fill 
                  className="object-cover brightness-95" 
                />
                <div className="absolute inset-0 flex flex-col justify-between p-3">
                  <div className="text-center text-white font-black text-sm tracking-wide uppercase drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,1)]">
                    ENTER MEME DETAILS
                  </div>
                  <div className="mx-auto w-fit bg-emerald-500 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles className="w-2 h-2" />
                    RENDERING
                  </div>
                </div>
              </div>
              <div className="h-6 flex items-center justify-between text-[8px] font-semibold text-black/40 dark:text-white/40">
                <span>EXPORT READY</span>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* INFINITE MARQUEE */}
      <div className="overflow-hidden w-full py-8 border-y border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01] relative z-10 select-none">
        <div ref={marqueeRef} className="flex whitespace-nowrap gap-16 text-xs md:text-sm uppercase tracking-[0.3em] font-black text-black/35 dark:text-white/35">
          <span>{"STONKS • DISTRACTED BOYFRIEND • DRAKE POSTING • DOGE • GIGACHAD • WOJAK • FEELS BAD MAN • SURELY IT'S STONKS • COFFEE CODE REPEAT • "}</span>
          <span>{"STONKS • DISTRACTED BOYFRIEND • DRAKE POSTING • DOGE • GIGACHAD • WOJAK • FEELS BAD MAN • SURELY IT'S STONKS • COFFEE CODE REPEAT • "}</span>
        </div>
      </div>

      {/* INTEREST: Bento Grid Workspace Editor */}
      <section id="editor-workspace" className="relative z-10 py-32 md:py-48 max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center mb-16 text-center gap-4">
          <span className="text-xs font-bold tracking-[0.2em] text-violet-500 uppercase">Interactive Studio</span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl text-balance">
            Zero friction workspace.
          </h2>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 grid-flow-dense">
          {/* Grid Item 1: Main Canvas Area */}
          <div className="col-span-12 md:col-span-8 md:row-span-2 group/card">
            <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition-all duration-500">
              <div className="w-full h-full relative overflow-hidden rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-black/5 dark:border-white/5 flex flex-col">
                <div className="px-6 py-4 border-b border-black/5 dark:border-white/5 flex justify-between items-center bg-black/[0.01] dark:bg-white/[0.01]">
                  <div className="flex gap-1.5 cursor-default">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] transition-transform duration-300 hover:scale-110" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] transition-transform duration-300 hover:scale-110" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] transition-transform duration-300 hover:scale-110" />
                  </div>
                  <span className="text-xs font-mono tracking-wider text-black/30 dark:text-white/35">canvas.meme</span>
                  <div className="w-9" />
                </div>
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
          </div>

          {/* Grid Item 2: Upload Controls */}
          <div className="col-span-12 md:col-span-4 md:row-span-1 group/card">
            <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition-all duration-500">
              <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-black/5 dark:border-white/5 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <h3 className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/50 font-black">Upload Media</h3>
                </div>
                <UploadControls onImageUpload={handleImageUpload} onReset={resetCanvas} />
              </div>
            </div>
          </div>

          {/* Grid Item 3: Typography & Export */}
          <div className="col-span-12 md:col-span-4 md:row-span-1 group/card">
            <div className="w-full h-full p-1.5 md:p-2 rounded-[2rem] bg-black/5 dark:bg-white/5 ring-1 ring-black/5 dark:ring-white/10 hover:ring-black/10 dark:hover:ring-white/20 transition-all duration-500">
              <div className="w-full h-full p-6 rounded-[calc(2rem-0.375rem)] md:rounded-[calc(2rem-0.5rem)] bg-white dark:bg-[#0a0a0a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border border-black/5 dark:border-white/5 flex flex-col justify-start gap-5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <h3 className="text-[10px] uppercase tracking-[0.25em] text-black/50 dark:text-white/50 font-black">Controls & Style</h3>
                </div>
                
                <div className="flex-1 flex flex-col justify-between gap-4">
                  <TextControls
                    hasImage={!!image}
                    onAddText={addText}
                    selectedId={selectedId}
                    textElements={textElements}
                    onUpdateText={updateText}
                    onDeleteText={deleteText}
                  />
                  <div className="pt-2 border-t border-black/5 dark:border-white/5">
                    <ExportControls hasImage={!!image} onExport={exportImage} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESIRE: Scroll Pinning & Stacking Cards */}
      <section id="desire-section" className="relative z-10 py-32 md:py-48 max-w-[1400px] mx-auto px-4 md:px-8 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row gap-16 md:gap-8">
        
        {/* Left Column: Pinned Scroll Title */}
        <div ref={pinnedLeftRef} className="w-full md:w-1/2 flex flex-col justify-start md:sticky md:top-32 h-fit gap-6 md:pr-12">
          <span className="text-xs font-bold tracking-[0.2em] text-violet-500 uppercase">MEMETIC PHYSICS</span>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-balance">
            The Physics of Internet Virality.
          </h2>

          <p className="text-lg md:text-xl text-black/60 dark:text-white/60 leading-relaxed font-medium">
            {"How a single image turns into a global language. Explore the rules of rapid cognition, reactions, and feed velocity.".split(" ").map((word, i) => (
              <span key={i} className="scrub-word inline-block mr-1">
                {word}
              </span>
            ))}
          </p>
        </div>

        {/* Right Column: Stacking Cards */}
        <div className="w-full md:w-1/2 flex flex-col gap-12 relative">
          
          {/* Card 1 */}
          <div 
            ref={(el) => { if (el) cardsRef.current[0] = el; }} 
            className="sticky top-44 md:top-60 bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl h-[320px] md:h-[380px] flex flex-col justify-between overflow-hidden backdrop-blur-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-4">
              <span className="text-3xl md:text-4xl font-black text-violet-500/30 font-mono">01</span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">High Cognitive Speed</h3>
              <p className="text-sm md:text-base text-black/60 dark:text-white/60 leading-relaxed font-medium">
                Viral memes rely on instant recognition. Combining familiar templates with high-impact typography makes the brain process the message in under 150 milliseconds.
              </p>
            </div>
            <div className="text-[10px] font-mono tracking-wider uppercase opacity-40">
              Template Calibration
            </div>
          </div>

          {/* Card 2 */}
          <div 
            ref={(el) => { if (el) cardsRef.current[1] = el; }} 
            className="sticky top-44 md:top-60 bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl h-[320px] md:h-[380px] flex flex-col justify-between overflow-hidden backdrop-blur-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-4">
              <span className="text-3xl md:text-4xl font-black text-emerald-500/30 font-mono">02</span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">The Reaction Proxies</h3>
              <p className="text-sm md:text-base text-black/60 dark:text-white/60 leading-relaxed font-medium">
                {"A reaction meme is an emotional proxy. Dynamic textual positioning on a canvas alters the joke's perspective in real-time, giving creators infinite angles on a single meme."}
              </p>
            </div>
            <div className="text-[10px] font-mono tracking-wider uppercase opacity-40">
              Interactive Perspective
            </div>
          </div>

          {/* Card 3 */}
          <div 
            ref={(el) => { if (el) cardsRef.current[2] = el; }} 
            className="sticky top-44 md:top-60 bg-white dark:bg-[#0c0c0c] border border-black/10 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl h-[320px] md:h-[380px] flex flex-col justify-between overflow-hidden backdrop-blur-xl transition-all duration-300"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="flex flex-col gap-4">
              <span className="text-3xl md:text-4xl font-black text-pink-500/30 font-mono">03</span>
              <h3 className="text-xl md:text-2xl font-black tracking-tight">Fluid Export Rhythm</h3>
              <p className="text-sm md:text-base text-black/60 dark:text-white/60 leading-relaxed font-medium">
                When a format is hot, timing is everything. Speeding up canvas-to-PNG export without watermarks ensures your meme hits the social media feeds before the algorithm shifts.
              </p>
            </div>
            <div className="text-[10px] font-mono tracking-wider uppercase opacity-40">
              Frictionless Output
            </div>
          </div>

        </div>

      </section>

      {/* CAROUSEL: Testimonials */}
      <section className="relative z-10 py-32 md:py-48 bg-black/[0.02] dark:bg-white/[0.01] border-y border-black/5 dark:border-white/5">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="flex flex-col items-center mb-16 text-center gap-4">
            <span className="text-xs font-bold tracking-[0.2em] text-violet-500 uppercase">Trusted globally</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight">Approved by the Legends.</h2>
          </div>

          <div className="max-w-4xl mx-auto bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-black/10 dark:border-white/10 p-8 md:p-16 shadow-xl relative">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 min-h-[220px]">
              
              {/* Overlapping/Centered Avatar Group */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 shrink-0 rounded-2xl overflow-hidden border-2 border-black/10 dark:border-white/10 shadow-lg">
                <Image 
                  src={testimonials[activeTestimonial].image} 
                  alt={testimonials[activeTestimonial].author} 
                  fill 
                  className="object-cover transition-transform duration-500 hover:scale-105" 
                />
              </div>

              <div className="flex-1 flex flex-col justify-between gap-6">
                <p className="text-lg md:text-2xl font-bold tracking-tight text-black/80 dark:text-white/90 leading-snug">
                  &ldquo;{testimonials[activeTestimonial].quote}&rdquo;
                </p>
                <div>
                  <h4 className="text-base font-black tracking-tight">{testimonials[activeTestimonial].author}</h4>
                  <p className="text-xs font-semibold text-black/40 dark:text-white/40">{testimonials[activeTestimonial].role}</p>
                </div>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="absolute right-8 bottom-8 flex gap-3">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ACTION: CTA Block */}
      <section className="relative z-10 py-32 md:py-48 max-w-[1400px] mx-auto px-4 md:px-8 text-center flex flex-col items-center gap-8">
        <div className="absolute w-[400px] h-[400px] bg-violet-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none max-w-4xl text-balance">
          Unleash the Brainrot.
        </h2>
        
        <p className="max-w-xl text-lg md:text-xl text-black/60 dark:text-white/60 font-medium">
          Generate. Export. Distribute. No signups, no watermarks, just raw memetic velocity.
        </p>

        <button 
          onClick={scrollToEditor}
          className="px-10 py-5 text-base font-extrabold rounded-full bg-black text-white dark:bg-white dark:text-black hover:bg-black/80 dark:hover:bg-white/80 transition-all duration-300 shadow-2xl flex items-center gap-3 cursor-pointer"
        >
          Launch Free Editor
          <MoveRight className="w-5 h-5" />
        </button>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 w-full py-12 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col sm:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Image
              src="/assets/logomemein.png"
              alt="MemeIn Logo"
              width={24}
              height={24}
              className="w-6 h-6 object-contain brightness-0 dark:invert"
            />
            <span className="text-xs font-black tracking-widest uppercase">Memein</span>
          </div>

          <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-black/40 dark:text-white/45">
            © 2026, Brandon J.S — Engineered for depth & memetic velocity
          </div>
        </div>
      </footer>
    </div>
  );
}
