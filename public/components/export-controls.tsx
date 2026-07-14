"use client";

import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Download, Copy, Share, Check } from "reicon-react";
import { useState, useEffect } from "react";
import { gooeyToast } from "goey-toast";

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
  const [downloaded, setDownloaded] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const handleDownload = async () => {
    const res = await onExport(format, "download");
    if (res) {
      setDownloaded(true);
      gooeyToast.success("Meme downloaded successfully !", {
        preset: "snappy",
        showTimestamp: false,
        timing: {
          displayDuration: 3000,
        },
      });
      setTimeout(() => setDownloaded(false), 2000);
    }
  };

  const handleCopy = async () => {
    try {
      const dataUrl = await onExport("image/png", "copy");
      if (!dataUrl) return;

      const res = await fetch(dataUrl);
      const blob = await res.blob();

      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopied(true);
      gooeyToast.success("Meme copied to clipboard !", {
        preset: "snappy",
        showTimestamp: false,
        timing: {
          displayDuration: 3000,
        },
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image to clipboard:", err);
      gooeyToast.error("Failed to copy image!");
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
            className="w-full flex items-center justify-center gap-2 relative overflow-hidden"
            disabled={!hasImage}
            onClick={handleDownload}
          >
            <div className="relative w-4 h-4 flex items-center justify-center">
              <Download
                className={`absolute w-4 h-4 transition-all duration-300 transform ${
                  downloaded ? "scale-0 rotate-90 opacity-0" : "scale-100 rotate-0 opacity-100"
                }`}
              />
              <Check
                className={`absolute w-4 h-4 text-green-500 transition-all duration-300 transform ${
                  downloaded ? "scale-100 rotate-0 opacity-100" : "scale-0 -rotate-90 opacity-0"
                }`}
              />
            </div>
            <span className="relative h-5 overflow-hidden flex items-center justify-center">
              <span className="invisible pointer-events-none">Downloaded</span>
              <span
                className={`absolute transition-all duration-300 ${
                  downloaded ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
                }`}
              >
                Download
              </span>
              <span
                className={`absolute transition-all duration-300 ${
                  downloaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                }`}
              >
                Downloaded
              </span>
            </span>
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
