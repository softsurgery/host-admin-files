import { useDialog } from "@/components/common/Dialog";
import { Spinner } from "@/components/common/Spinner";
import { Button } from "@/components/ui/button";

interface APIKeyDeleteDialogProps {
  apiKeyLabel?: string;
  deleteAPIKey?: () => void;
  isDeletionPending?: boolean;
  resetAPIKey?: () => void;
}

export const useAPIKeyDeleteDialog = ({
  apiKeyLabel,
  deleteAPIKey,
  isDeletionPending,
  resetAPIKey,
}: APIKeyDeleteDialogProps) => {
  const {
    DialogFragment: deleteAPIKeyDialog,
    openDialog: openDeleteAPIKeyDialog,
    closeDialog: closeDeleteAPIKeyDialog,
  } = useDialog({
    title: (
      <div className="leading-normal">
        Delete API Key <span className="font-light">{apiKeyLabel}</span> ?
      </div>
    ),
    description:
      "This action is permanent and cannot be undone. All associations with this apiKey will also be removed.",
    children: (
      <div>
        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => {
              deleteAPIKey?.();
              closeDeleteAPIKeyDialog();
            }}
          >
            Confirm
            <Spinner show={isDeletionPending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetAPIKey?.();
              closeDeleteAPIKeyDialog();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "w-[500px]",
    onToggle: resetAPIKey,
  });

  return {
    deleteAPIKeyDialog,
    openDeleteAPIKeyDialog,
    closeDeleteAPIKeyDialog,
  };
};
