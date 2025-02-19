import { File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/common/Sheet";
import { Spinner } from "@/components/common/Spinner";
import { FileUploader } from "@/components/ui/file-uploader";
import { useFileUploaderStore } from "@/hooks/stores/useFileUploaderStore";

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
  const fileUploaderStore = useFileUploaderStore();
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
      <div className="flex flex-col h-full">
        <FileUploader
          className="flex-1 my-5"
          maxFileCount={Infinity}
          value={fileUploaderStore.files}
          onValueChange={(files) => {
            fileUploaderStore.setFiles(files);
          }}
        />
        <div className="flex gap-2 my-4 justify-end">
          <Button
            onClick={() => {
              uploadFiles?.();
            }}
          >
            Save
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
    className: "min-w-[70vw]",
    onToggle: resetFile,
  });

  return {
    uploadFileSheet,
    openUploadFileSheet,
    closeUploadFileSheet,
  };
};
