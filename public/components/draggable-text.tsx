import { TextElement } from "@/types/meme";
import React from "react";
import { Text } from "react-konva";

interface DraggableTextProps {
  textProps: TextElement;
  onSelect: () => void;
}

export default function DraggableText({
  textProps,
  onSelect,
}: DraggableTextProps) {
  // Dynamically calculate strokeWidth to scale proportionally with fontSize
  const dynamicStrokeWidth = Math.max(1.0, textProps.fontSize * 0.04);

  return (
    <Text
      draggable
      {...textProps}
      strokeWidth={dynamicStrokeWidth}
      onClick={onSelect}
      onTouchStart={onSelect}
      offsetX={textProps.text.length * textProps.fontSize * 0.3}
    />
  );
}


