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
  return (
    <>
      <Text
        draggable
        {...textProps}
        onClick={onSelect}
        offsetX={textProps.text.length * textProps.fontSize * 0.3}
      />
      {/* textprops at useMeme */}
    </>
  );
}
