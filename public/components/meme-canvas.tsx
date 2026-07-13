import { Upload, Loader2 } from "lucide-react";
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
  onSelectText: (id: string) => void;
  stageRef: React.RefObject<Konva.Stage | null>;
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}


export default function MemeCanvas({
  image,
  textElements,
  stageSize,
  stageRef,
  onSelectText,
  onImageUpload,
}: MemeCanvasProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [containerWidth, setContainerWidth] = useState<number>(stageSize.width);

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

  const scale = containerWidth < stageSize.width ? containerWidth / stageSize.width : 1;


  const handleContainerClick = () => {
    if (!image && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!image) {
    return (
      <div
        ref={containerRef}
        className="w-full flex justify-center items-center"
      >
        <div
          className="border-2 border-dashed border-gray rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-black/20 cursor-pointer hover:border-gray-400 dark:hover:border-white/40 transition-all duration-300 group/canvas"
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
              Click to upload an image
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
    >
      <div
        className="border-2 border-dashed border-gray rounded-lg overflow-hidden flex items-center justify-center"
        style={{ width: stageSize.width * scale, height: stageSize.height * scale }}
      >
        {/* KONVA: rendered to canvas*/}
        <Stage 
          width={stageSize.width * scale} 
          height={stageSize.height * scale} 
          scaleX={scale} 
          scaleY={scale}
          ref={stageRef}
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
                onSelect={() => onSelectText(textEl.id)}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}

