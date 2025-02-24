import { useDialog } from "@/components/common/Dialog";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";

interface FileDeleteDialogProps {
  fileLabel?: string;
  deleteFile?: () => void;
  isDeletionPending?: boolean;
  resetFile?: () => void;
}

export const useFileDeleteDialog = ({
  fileLabel,
  deleteFile,
  isDeletionPending,
  resetFile
}: FileDeleteDialogProps) => {
  const {
    DialogFragment: deleteFileDialog,
    openDialog: openDeleteFileDialog,
    closeDialog: closeDeleteFileDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete File <span className="font-light">{fileLabel}</span> ?
      </div>
    ),
    description:
      "This action is permanent and cannot be undone. All associations with this file will also be removed.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteFile?.();
              closeDeleteFileDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetFile?.();
              closeDeleteFileDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetFile,
  });

  return {
    deleteFileDialog,
    openDeleteFileDialog,
    closeDeleteFileDialog,
  };
};