import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Download } from "lucide-react";

interface ExportControlsProps {
  hasImage: boolean;
  onExport: () => void;
}
export default function ExportControls({
  hasImage,
  onExport,
}: ExportControlsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button className="w-full" disabled={!hasImage} onClick={onExport}>
          Download PNG
        </Button>
      </CardContent>
    </Card>
  );
}
