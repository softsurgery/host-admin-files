import {
  FilePen,
  FileSpreadsheet,
  FileTextIcon,
  FileVideo,
  ImageIcon,
  Paperclip,
} from "lucide-react";

interface FilePreviewProps {
  className?: string;
  file: File;
}

export function FilePreview({ className, file }: FilePreviewProps) {
  const ext = file?.name?.split(".").pop()?.trim().toLowerCase() || "";
  const appliedClassName = "w-10 h-10" + className;

  if (file.type.startsWith("image/")) {
    return <ImageIcon className={appliedClassName} />;
  }
  if (file.name.endsWith("pdf")) {
    return <Paperclip className={appliedClassName} />;
  }
  if (["xlsx", "xls", "ods"].includes(ext)) {
    return <FileSpreadsheet className={appliedClassName} />;
  }
  if (["docx", "doc"].includes(ext)) {
    return <FilePen className={appliedClassName} />;
  }
  if (["ppt", "pptx", "mp4", "avi", "mkv", "flv", "mov", "amv"].includes(ext)) {
    return <FileVideo className={appliedClassName} />;
  }

  return <FileTextIcon className={appliedClassName} aria-hidden="true" />;
}
