import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Download, X, Upload } from "lucide-react";
import { useFileUploaderStore } from "@/hooks/stores/useFileUploaderStore";
import { downloadFile } from "@/lib/download-file.util";
import { useRef } from "react";
import { FilePreview } from "../common/FilePreview";
import { ScrollArea } from "../ui/scroll-area";

interface FileFormProps {
  className?: string;
}

export const FileForm = ({ className }: FileFormProps) => {
  const { files, addFile, removeFile } = useFileUploaderStore();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      Array.from(event.target.files).forEach(addFile);
      event.target.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        onClick={handleClick}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Upload className="w-5 h-5" />
        Choose Files
      </Button>
      {files.length > 0 && (
        <ul className="mt-2 flex flex-col flex-1 gap-2 overflow-auto px-2">
          {files.map((file, index) => (
            <li key={index} className="flex items-center p-2 border rounded">
              {/* File Preview (1/6 width) */}
              <div className="w-1/12 flex-shrink-0">
                <FilePreview file={file} />
              </div>

              {/* File Name & Size (4/6 width) */}
              <div className="w-9/12 px-2">
                <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </p>
              </div>

              {/* Action Buttons (1/6 width) */}
              <div className="w-1/6 flex justify-end gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => downloadFile(file)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeFile(file)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
