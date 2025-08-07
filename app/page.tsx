"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shadcn/ui/card";
import ExportControls from "@/public/components/export-controls";
import MemeCanvas from "@/public/components/meme-canvas";
import TextControls from "@/public/components/text-controls";
import UploadControls from "@/public/components/upload-controls";
import { useMeme } from "@/hooks/useMeme";
import { ToggleButton } from "@/public/components/toggle-button";

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
  console.log(image);

  return (
    <>
      <ToggleButton />
      <div className="min-h-screen bg-white dark:bg-black/5 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-auto mt-8">
              MemeIn
            </h1>
            <p className="text-gray-600 dark:text-white/60">
              Create your own meme with custom text and images ( ͡° ͜ʖ ͡°)
            </p>
          </div>

          {/* Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Control Panel */}
            <div className="lg:col-span-1 space-y-4">
              <UploadControls
                onImageUpload={handleImageUpload}
                onReset={resetCanvas}
              />
              <TextControls
                hasImage={!!image}
                onAddText={addText}
                selectedId={selectedId}
                textElements={textElements}
                onUpdateText={updateText}
                onDeleteText={deleteText}
              />
              <ExportControls hasImage={!!image} onExport={exportImage} />
            </div>
            {/* Canvas */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Canvas</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <MemeCanvas
                    image={image}
                    stageSize={stageSize}
                    stageRef={stageRef}
                    textElements={textElements}
                    onSelectText={setSelectedId}
                  />
                </CardContent>
              </Card>

              <footer className="mt-2 text-[11px] text-black dark:text-white/60 font-sans">
                © 2025, Brandon J.S - All rights reserved.
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
