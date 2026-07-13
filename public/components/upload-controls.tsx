"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Label } from "@radix-ui/react-label";
import { Button } from "@/shadcn/ui/button";
import { Input } from "@/shadcn/ui/input";
import { RotateCcw, Upload, Image as ImageIcon, Search, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";

interface MemeTemplate {
  id: string;
  name: string;
  url: string;
  width: number;
  height: number;
}

interface UploadControlsProps {
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  onUrlSelect: (url: string) => void;
}

const FALLBACK_TEMPLATES: MemeTemplate[] = [
  {
    id: "181913649",
    name: "Drake Hotline Bling",
    url: "https://i.imgflip.com/30b1gx.jpg",
    width: 1200,
    height: 1200,
  },
  {
    id: "112126428",
    name: "Distracted Boyfriend",
    url: "https://i.imgflip.com/1ur9kl.jpg",
    width: 1200,
    height: 800,
  },
  {
    id: "87743020",
    name: "Two Buttons",
    url: "https://i.imgflip.com/1g8my4.jpg",
    width: 600,
    height: 908,
  },
  {
    id: "129242436",
    name: "Change My Mind",
    url: "https://i.imgflip.com/24y43o.jpg",
    width: 482,
    height: 361,
  },
  {
    id: "438680",
    name: "Batman Slapping Robin",
    url: "https://i.imgflip.com/9ehk.jpg",
    width: 400,
    height: 387,
  },
  {
    id: "97984",
    name: "Disaster Girl",
    url: "https://i.imgflip.com/23ls.jpg",
    width: 500,
    height: 375,
  }
];

export default function UploadControls({
  onImageUpload,
  onReset,
  onUrlSelect,
}: UploadControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<"upload" | "templates">("upload");
  const [templates, setTemplates] = useState<MemeTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchTemplates() {
      setLoading(true);
      try {
        const response = await fetch("https://api.imgflip.com/get_memes");
        const data = await response.json();
        if (data.success && data.data?.memes) {
          setTemplates(data.data.memes);
        } else {
          setTemplates(FALLBACK_TEMPLATES);
        }
      } catch (err) {
        console.error("Failed to fetch meme templates:", err);
        setTemplates(FALLBACK_TEMPLATES);
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  const handleReset = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onReset();
  };

  const filteredTemplates = (templates.length > 0 ? templates : FALLBACK_TEMPLATES).filter(
    (t) => t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="border border-black/5 dark:border-white/5 overflow-hidden">
      <CardHeader className="pb-3 border-b border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Media Source
          </span>
          <div className="flex gap-1 p-0.5 bg-black/5 dark:bg-white/5 rounded-full text-xs">
            <button
              onClick={() => setActiveTab("upload")}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                activeTab === "upload"
                  ? "bg-white dark:bg-zinc-850 text-black dark:text-white shadow-sm"
                  : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setActiveTab("templates")}
              className={`px-3 py-1 rounded-full font-semibold transition-all ${
                activeTab === "templates"
                  ? "bg-white dark:bg-zinc-850 text-black dark:text-white shadow-sm"
                  : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
              }`}
            >
              Templates
            </button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {activeTab === "upload" ? (
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold">Choose Image (JPG/PNG)</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg, image/png"
                className="mt-1 bg-transparent"
                onChange={onImageUpload}
              />
            </div>
            <Button
              variant="outline"
              className="w-full bg-transparent border-red-500/20 hover:border-red-500/50 hover:bg-red-500/10 text-red-600 dark:text-red-400"
              onClick={handleReset}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Canvas
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-black/45 dark:text-white/45" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-transparent"
              />
            </div>

            {loading && templates.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-black/50 dark:text-white/50">
                <Loader2 className="w-6 h-6 animate-spin mb-2" />
                <span className="text-xs">Loading templates...</span>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                {filteredTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => onUrlSelect(t.url)}
                    className="group/template relative aspect-square rounded-lg overflow-hidden border border-black/10 dark:border-white/10 hover:border-black dark:hover:border-white transition-all bg-black/5 dark:bg-white/5"
                    title={t.name}
                  >
                    <img
                      src={t.url}
                      alt={t.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/template:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/template:opacity-100 transition-opacity flex items-end p-1">
                      <span className="text-[9px] leading-tight text-white font-medium truncate w-full text-left">
                        {t.name}
                      </span>
                    </div>
                  </button>
                ))}
                {filteredTemplates.length === 0 && (
                  <div className="col-span-3 text-center py-8 text-xs text-black/50 dark:text-white/50">
                    No templates found
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
