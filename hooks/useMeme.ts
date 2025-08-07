"use client";

import { StageSize, TextElement } from "@/types/meme";
import { calculateStageSize, loadImageFromFile } from "@/utils/image";
import Konva from "konva";
import { useCallback, useRef, useState } from "react";

export const useMeme = () => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [stageSize, setStageSize] = useState<StageSize>({
    width: 600,
    height: 400,
  });
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const stageRef = useRef<Konva.Stage>(null);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const img = await loadImageFromFile(file);
        const newStageSize = calculateStageSize(img);
        setStageSize(newStageSize);
        setImage(img);
        setTextElements([]); //reset text after changing picture
      } catch (error) {
        console.error("Error loading image:", error);
      }
    },
    []
  );

  const addText = useCallback(() => {
    const newText: TextElement = {
      id: `text-${Date.now()}`,
      text: "MEME TEXT",
      x: stageSize.width / 2,
      y: stageSize.height / 2,
      fontSize: 40,
      fill: "white",
      stroke: "black",
      strokeWidth: 1.5,
      fontFamily: "Impact, Arial Black, sans-serif",
      align: "center",
    };
    setTextElements((prev) => [...prev, newText]);
    setSelectedId(newText.id);
  }, [stageSize]);

  const updateText = useCallback((id: string, newText: string) => {
    setTextElements((prev) =>
      prev.map((el) => (el.id === id ? { ...el, text: newText } : el))
    );
  }, []);

  const deleteText = useCallback((id: string) => {
    setTextElements((prev) => prev.filter((el) => el.id !== id));
    setSelectedId(null);
  }, []);

  const resetCanvas = useCallback(() => {
    setImage(null);
    setTextElements([]);
    setSelectedId(null);
    setStageSize({ width: 600, height: 400 });
  }, []);

  const exportImage = useCallback(async () => {
    if (!stageRef.current) return;

    await new Promise((resolve) => setTimeout(resolve, 150));
    const uri = stageRef.current.toDataURL({
      pixelRatio: 2,
      mimeType: "image/png",
    });
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return {
    image,
    textElements,
    selectedId,
    stageSize,
    stageRef,
    handleImageUpload,
    addText,
    updateText,
    deleteText,
    resetCanvas,
    exportImage,
    setSelectedId,
  };
};
