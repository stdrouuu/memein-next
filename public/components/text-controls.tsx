import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { Label } from "@radix-ui/react-label";
import { Text } from "reicon-react";
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
            <Text className="w-5 h-5" />
            Add Text
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full flex items-center justify-center gap-2" onClick={onAddText} disabled={!hasImage}>
            <Text className="w-4 h-4" />
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
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-semibold">Text Content</Label>
                <Input
                  className="mt-1"
                  placeholder="Enter meme text..."
                  value={selectedText.text || ""}
                  onChange={(e) => onUpdateText(selectedId, { text: e.target.value })}
                />
              </div>

              <Button
                variant="destructive"
                className="w-full flex items-center justify-center gap-2"
                onClick={() => onDeleteText(selectedId)}
              >
                <Text className="w-4 h-4" />
                Delete Text
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}


