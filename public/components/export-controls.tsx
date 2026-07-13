"use client";

import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Download, Copy, Share, Check } from "reicon-react";
import { useState, useEffect } from "react";
import { goeyToast } from "goey-toast";

interface ExportControlsProps {
  hasImage: boolean;
  onExport: (format: string, action: "download" | "copy" | "share") => Promise<string | null>;
}

export default function ExportControls({
  hasImage,
  onExport,
}: ExportControlsProps) {
  const [format, setFormat] = useState<string>("image/png");
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const handleDownload = async () => {
    const res = await onExport(format, "download");
    if (res) {
      goeyToast.success("Meme downloaded successfully!");
    }
  };

  const handleCopy = async () => {
    try {
      const dataUrl = await onExport(format, "copy");
      if (!dataUrl) return;

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopied(true);
      goeyToast.success("Meme copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image to clipboard:", err);
      goeyToast.error("Failed to copy image!");
    }
  };

  const handleShare = async () => {
    try {
      const dataUrl = await onExport(format, "share");
      if (!dataUrl) return;

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const ext = format === "image/jpeg" ? "jpg" : "png";
      const file = new File([blob], `meme.${ext}`, { type: blob.type });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: "My Meme",
          text: "Check out this meme I created with Memein!",
        });
      }
    } catch (err) {
      console.error("Failed to share meme:", err);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Format Selection */}
        <div>
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/5 dark:bg-white/5 rounded-lg">
            <button
              disabled={!hasImage}
              onClick={() => setFormat("image/png")}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                format === "image/png"
                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                  : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              PNG
            </button>
            <button
              disabled={!hasImage}
              onClick={() => setFormat("image/jpeg")}
              className={`py-1.5 text-xs font-semibold rounded-md transition-all ${
                format === "image/jpeg"
                  ? "bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm"
                  : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              JPG
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-2">
          <Button
            className="w-full flex items-center justify-center gap-2"
            disabled={!hasImage}
            onClick={handleDownload}
          >
            <Download className="w-4 h-4" />
            Download
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 bg-transparent"
              disabled={!hasImage}
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-green-500 animate-pulse" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy
                </>
              )}
            </Button>

            <Button
              variant="outline"
              className="flex items-center justify-center gap-2 bg-transparent"
              disabled={!hasImage || !canShare}
              onClick={handleShare}
            >
              <Share className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
