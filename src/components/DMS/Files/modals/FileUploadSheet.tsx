import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/common/Sheet";
import { Spinner } from "@/components/common/Spinner";
import { FileForm } from "../FileForm";

interface FileUploadSheetProps {
  uploadFiles?: () => void;
  isUploadPending?: boolean;
  resetFile?: () => void;
}

export const useFileUploadSheet = ({
  uploadFiles,
  isUploadPending,
  resetFile,
}: FileUploadSheetProps) => {
  const {
    SheetFragment: uploadFileSheet,
    openSheet: openUploadFileSheet,
    closeSheet: closeUploadFileSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <File />
        New File
      </div>
    ),
    description: "Use this form to define a new file within the system",
    children: (
      <div className="flex flex-col flex-1 overflow-hidden h-full">
        <FileForm className="flex flex-col flex-1 overflow-hidden my-4"/>
        <div className="flex gap-2 my-4 justify-end">
          <Button
            onClick={() => {
              uploadFiles?.();
            }}
          >
            Upload
            <Spinner show={isUploadPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeUploadFileSheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[25vw]",
    onToggle: resetFile,
  });

  return {
    uploadFileSheet,
    openUploadFileSheet,
    closeUploadFileSheet,
  };
};
