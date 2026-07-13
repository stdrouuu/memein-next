import { Upload, Loader } from "reicon-react";
import { Layer, Stage, Image as KonvaImage } from "react-konva";
import DraggableText from "./draggable-text";
import { StageSize, TextElement } from "@/types/meme";
import Konva from "konva";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";

interface MemeCanvasProps {
  image: HTMLImageElement | null;
  textElements: TextElement[];
  stageSize: StageSize;
  selectedId: string | null;
  onSelectText: (id: string) => void;
  onUpdateText: (id: string, updates: Partial<TextElement>) => void;

  stageRef: React.RefObject<Konva.Stage | null>;
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFileDrop?: (file: File) => void;
}


export default function MemeCanvas({
  image,
  textElements,
  stageSize,
  selectedId,
  stageRef,
  onSelectText,
  onUpdateText,
  onImageUpload,
  onFileDrop,
}: MemeCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [containerWidth, setContainerWidth] = useState<number>(stageSize.width);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Set initial size
    setContainerWidth(containerRef.current.offsetWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [stageSize.width]);

  // Explicitly pre-load Anton font before Konva draws — document.fonts.ready
  // alone is unreliable on mobile Safari/Chrome because remote fonts can still
  // be deferred at that point. fonts.load() blocks until the glyph data is
  // actually available, guaranteeing a correct canvas render.
  useEffect(() => {
    if (typeof window === "undefined" || !("fonts" in document)) return;

    const loadFont = async () => {
      try {
        await document.fonts.load('bold 40px "Anton"');
      } catch {
        // Ignore failures — fallback font will be used
      } finally {
        setFontsLoaded(true);
        if (stageRef.current) {
          stageRef.current.batchDraw();
        }
      }
    };

    loadFont();
  }, [stageRef]);

  useEffect(() => {
    if (stageRef.current) {
      stageRef.current.batchDraw();
    }
  }, [fontsLoaded, textElements, stageRef]);

  const scale = containerWidth < stageSize.width ? containerWidth / stageSize.width : 1;

  const handleContainerClick = () => {
    if (!image && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && onFileDrop) {
      onFileDrop(file);
    }
  };

  if (!image) {
    return (
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={`border-2 border-dashed rounded-lg overflow-hidden flex items-center justify-center cursor-pointer transition-[border-color,box-shadow,transform] duration-200 group/canvas ${
            isDraggingOver
              ? "border-black dark:border-white bg-black/5 dark:bg-white/5 scale-[1.02] shadow-lg"
              : "border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-black/20 hover:border-gray-400 dark:hover:border-white/40"
          }`}
          style={{ width: stageSize.width * scale, height: stageSize.height * scale }}
          onClick={handleContainerClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={onImageUpload}
          />
          <div className="text-center text-gray-500 dark:text-white/70 group-hover/canvas:scale-105 transition-transform duration-300 p-4">
            <Upload className="w-12 h-12 mx-auto mb-2 text-gray-400 dark:text-white/40 group-hover/canvas:text-black dark:group-hover/canvas:text-white transition-colors duration-300" />
            <p className="font-medium group-hover/canvas:text-black dark:group-hover/canvas:text-white transition-colors duration-300 text-sm md:text-base">
              {isDraggingOver ? "Drop image here!" : "Click or drag an image here to upload"}
            </p>
            <span className="text-xs text-gray-400 dark:text-white/40">JPG or PNG</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-center overflow-hidden"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div
        className={`border-2 rounded-lg overflow-hidden flex items-center justify-center relative transition-[border-color,box-shadow,transform] duration-200 ${
          isDraggingOver
            ? "border-black dark:border-white scale-[1.01] ring-4 ring-black/5 dark:ring-white/10"
            : "border-gray-200 dark:border-white/10"
        }`}
        style={{ width: stageSize.width * scale, height: stageSize.height * scale }}
      >
        {/* KONVA: rendered to canvas*/}
        <Stage 
          width={stageSize.width * scale} 
          height={stageSize.height * scale} 
          scaleX={scale} 
          scaleY={scale}
          ref={stageRef}
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage() || e.target.className === "Image";
            if (clickedOnEmpty) {
              onSelectText("");
            }
          }}
          onTouchStart={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage() || e.target.className === "Image";
            if (clickedOnEmpty) {
              onSelectText("");
            }
          }}
        >
          <Layer>
            <KonvaImage
              image={image}
              width={stageSize.width}
              height={stageSize.height}
            />
            {textElements.map((textEl) => (
              <DraggableText
                key={textEl.id}
                textProps={textEl}
                isSelected={textEl.id === selectedId}
                visible={true}
                onSelect={() => onSelectText(textEl.id)}
                onUpdateText={onUpdateText}
              />
            ))}
          </Layer>
        </Stage>


      </div>
    </div>
  );
}


