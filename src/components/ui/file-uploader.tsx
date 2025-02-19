import * as React from "react";
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from "react-dropzone";
import { cn, formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Download,
  FilePen,
  FileSpreadsheet,
  FileTextIcon,
  FileVideo,
  ImageIcon,
  PackageOpen,
  Paperclip,
  UploadIcon,
  X,
} from "lucide-react";
import { useControllableState } from "@/hooks/useControllableState";
import { toast } from "sonner";
import { Label } from "./label";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: (File & { preview?: string })[];

  /**
   * Function to be called when the value changes.
   * @type (files: File[]) => void
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: File[]) => void;

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => unknown;

  /**
   * Progress of the uploaded files.
   * @type Record<string, number> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  progresses?: Record<string, number>;

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps["accept"];

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps["maxSize"];

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFileCount={4}
   */
  maxFileCount?: DropzoneProps["maxFiles"];

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean;

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept,
    maxSize = 1024 * 1024 * 50,
    maxFileCount = 1,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      // Filter out empty files
      const emptyFiles = acceptedFiles.filter((file) => file.size === 0);
      if (emptyFiles.length > 0) {
        emptyFiles.forEach((file) => {
          toast.warning(`File '${file.name}' is rejected`);
        });
      }

      // Filter non-empty files
      const validFiles = acceptedFiles.filter((file) => file.size > 0);

      if (!multiple && maxFileCount === 1 && validFiles.length > 1) {
        toast.error("Multiple files not allowed");
        return;
      }

      if ((files?.length ?? 0) + validFiles.length > maxFileCount) {
        toast.error("Too many files");
        return;
      }

      const newFiles = validFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      // Handle already rejected files
      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`${file} is rejected`);
        });
      }

      // Handle upload if necessary
      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFileCount
      ) {
        // const target =
        //   updatedFiles.length > 0 ? `${updatedFiles.length} Files` : `File`;
        // toast.warning(onUpload(updatedFiles), {
        //   loading: `file is uploading...`,
        //   success: () => {
        //     setFiles([]);
        //     return `${target} is uploaded successfully`;
        //   },
        //   error: "file failed to be uploaded",
        // });
      }
    },
    [files, maxFileCount, multiple, onUpload, setFiles]
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  const isDisabled = disabled || (files?.length ?? 0) >= maxFileCount;

  return (
    <div className={cn("flex flex-row gap-4", className)}>
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={maxFileCount > 1 || multiple}
        disabled={isDisabled}
      >
        {({ getRootProps, getInputProps, isDragActive }) => (
          <div
            {...getRootProps()}
            className={cn(
              "flex h-full w-2/3 cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50",
              isDisabled && "pointer-events-none opacity-60"
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5 w-full">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-medium text-muted-foreground">
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5 w-full">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col">
                  <p className="font-medium text-muted-foreground">
                    Drag & Drop File here
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="w-1/3 px-2 py-2  rounded cursor-pointer">
          <div className="flex max-h-48 flex-col gap-4">
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => {
                  onRemove(index);
                }}
                progress={progresses?.[file.name]}
              />
            ))}
          </div>
        </ScrollArea>
      ) : (
        <Label className="text-base font-bold w-1/3 flex justify-center gap-2 items-center">
          No Selected Files <PackageOpen />
        </Label>
      )}
    </div>
  );
}

interface FileCardProps {
  key: number;
  file: File & { preview?: string };
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  // Trigger download when clicking on the file
  const handleFileDownload = () => {
    const url = file.preview || URL.createObjectURL(file);
    const a = document.createElement("a");
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    if (!file.preview) {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="relative flex items-center gap-2.5 hover:bg-slate-200 dark:hover:bg-slate-800 p-1 rounded-lg">
      <div className="flex flex-1 gap-2.5">
        {file && <FilePreview file={file} />}
        <div className="flex w-full flex-col gap-2 ">
          <div className="flex flex-col gap-px">
            <p className="line-clamp-1 text-sm font-medium text-foreground/80">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(file.size)}
            </p>
          </div>
          {progress ? <Progress value={progress} /> : null}
        </div>
      </div>
      <div className="flex items-center gap-2 ">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={handleFileDownload}
        >
          <Download className="size-4" aria-hidden="true" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-7"
          onClick={onRemove}
        >
          <X className="size-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}

interface FilePreviewProps {
  file: File;
}

function FilePreview({ file }: FilePreviewProps) {
  const ext = file?.name?.split(".").pop()?.trim().toLowerCase() || "";
  if (file.type.startsWith("image/")) {
    return <ImageIcon className="w-10 h-10" />;
  }
  if (file.name.endsWith("pdf")) {
    return <Paperclip className="w-10 h-10" />;
  }
  if (["xlsx", "xls", "ods"].includes(ext)) {
    return <FileSpreadsheet className="w-10 h-10" />;
  }
  if (["docx", "doc"].includes(ext)) {
    return <FilePen className="w-10 h-10" />;
  }
  if (["ppt", "pptx", "mp4", "avi", "mkv", "flv", "mov", "amv"].includes(ext)) {
    return <FileVideo className="w-10 h-10" />;
  }

  return (
    <FileTextIcon
      className="size-10 text-muted-foreground"
      aria-hidden="true"
    />
  );
}
