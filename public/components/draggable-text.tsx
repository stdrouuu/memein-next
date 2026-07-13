import { TextElement } from "@/types/meme";
import React, { useRef, useEffect } from "react";
import { Text, Transformer } from "react-konva";

interface DraggableTextProps {
  textProps: TextElement;
  isSelected: boolean;
  visible: boolean;
  onSelect: () => void;
  onUpdateText: (id: string, updates: Partial<TextElement>) => void;
}

export default function DraggableText({
  textProps,
  isSelected,
  visible,
  onSelect,
  onUpdateText,
}: DraggableTextProps) {
  const textRef = useRef<any>(null);
  const trRef = useRef<any>(null);

  // Dynamically calculate strokeWidth to scale proportionally with fontSize
  const dynamicStrokeWidth = Math.max(1.0, textProps.fontSize * 0.04);

  useEffect(() => {
    if (isSelected && trRef.current && textRef.current && visible) {
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected, textProps.text, textProps.fontSize, visible]);

  return (
    <>
      <Text
        ref={textRef}
        draggable
        {...textProps}
        visible={visible}
        strokeWidth={dynamicStrokeWidth}
        onClick={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onTouchStart={(e) => {
          e.cancelBubble = true;
          onSelect();
        }}
        onDblClick={(e) => {
          e.cancelBubble = true;
        }}
        onDblTap={(e) => {
          e.cancelBubble = true;
        }}
        offsetX={textProps.text.length * textProps.fontSize * 0.25}
        onDragEnd={(e) => {
          onUpdateText(textProps.id, {
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
        onTransformEnd={() => {
          const node = textRef.current;
          const scaleX = node.scaleX();

          node.scaleX(1);
          node.scaleY(1);

          onUpdateText(textProps.id, {
            x: node.x(),
            y: node.y(),
            fontSize: Math.max(12, Math.round(textProps.fontSize * scaleX)),
          });
        }}
      />
      {isSelected && visible && (
        <Transformer
          ref={trRef}
          enabledAnchors={["top-left", "top-right", "bottom-left", "bottom-right"]}
          keepRatio={true}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 30 || newBox.height < 30) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
}


