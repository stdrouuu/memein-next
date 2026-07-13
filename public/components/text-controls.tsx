import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@radix-ui/react-label";
import { Type } from "lucide-react";
import { TextElement } from "@/types/meme";

interface TextControlsProps {
  hasImage: boolean;
  onAddText: () => void;
  onUpdateText: (id: string, updates: Partial<TextElement>) => void;
  onDeleteText: (id: string) => void;
  selectedId: string | null;
  textElements: TextElement[];
}

export default function TextControls({
  hasImage,
  selectedId,
  textElements,
  onAddText,
  onUpdateText,
  onDeleteText,
}: TextControlsProps) {
  const selectedText = textElements.find((el) => el.id === selectedId);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="w-5 h-5" />
            Add Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={onAddText} disabled={!hasImage}>
            Add Text
          </Button>
        </CardContent>
      </Card>

      {selectedId && selectedText && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Text</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-semibold">Text Content</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter meme text..."
                  value={selectedText.text}
                  onChange={(e) => onUpdateText(selectedId, { text: e.target.value })}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label className="text-sm font-semibold">Font Size</Label>
                  <span className="text-xs bg-black/5 dark:bg-white/10 px-2 py-0.5 rounded font-mono font-medium">
                    {selectedText.fontSize}px
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] uppercase font-bold text-black/35 dark:text-white/35">Aa</span>
                  <input
                    type="range"
                    min="12"
                    max="120"
                    value={selectedText.fontSize}
                    onChange={(e) => onUpdateText(selectedId, { fontSize: parseInt(e.target.value) })}
                    className="flex-1 accent-black dark:accent-white bg-black/10 dark:bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-lg font-bold text-black/35 dark:text-white/35">Aa</span>
                </div>
              </div>

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => onDeleteText(selectedId)}
              >
                Delete Text
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}


