import { Button } from "@/components/ui/button";
import { useDialog } from "@/components/common/Dialog";
import { Spinner } from "@/components/common/Spinner";

interface WorkspaceDeleteDialogProps {
  workspaceLabel?: string;
  deleteWorkspace?: () => void;
  isDeletionPending?: boolean;
}

export const useWorkspaceDeleteDialog = ({
  workspaceLabel,
  deleteWorkspace,
  isDeletionPending,
}: WorkspaceDeleteDialogProps) => {
  const {
    DialogFragment: deleteWorkspaceDialog,
    openDialog: openDeleteWorkspaceDialog,
    closeDialog: closeDeleteWorkspaceDialog,
  } = useDialog({
    title: (
      <div className="leading-normal flex items-center gap-1">
        Delete Workspace <span className="font-light">{workspaceLabel}</span> ?
      </div>
    ),
    description: "Are you sure you want to delete this workspace?",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteWorkspace?.();
              closeDeleteWorkspaceDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeDeleteWorkspaceDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
  });

  return {
    deleteWorkspaceDialog,
    openDeleteWorkspaceDialog,
    closeDeleteWorkspaceDialog,
  };
};
