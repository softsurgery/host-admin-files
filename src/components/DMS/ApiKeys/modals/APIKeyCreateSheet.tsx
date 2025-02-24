import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/common/Sheet";
import { Spinner } from "@/components/common/Spinner";
import { APIKeyForm } from "../APIKeyForm";
import { KeyRound } from "lucide-react";

interface APIKeyCreateSheetProps {
  createAPIKeys?: () => void;
  isCreatePending?: boolean;
  resetAPIKey?: () => void;
}

export const useAPIKeyCreateSheet = ({
  createAPIKeys,
  isCreatePending,
  resetAPIKey,
}: APIKeyCreateSheetProps) => {
  const {
    SheetFragment: createAPIKeySheet,
    openSheet: openCreateAPIKeySheet,
    closeSheet: closeCreateAPIKeySheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <KeyRound />
        New APIKey
      </div>
    ),
    description: "Use this form to define a new API Key within the system",
    children: (
      <div className="flex flex-col flex-1 overflow-hidden h-full">
        <APIKeyForm className="flex flex-col flex-1 overflow-hidden my-5" />
        <div className="flex gap-2 my-4 justify-end">
          <Button
            onClick={() => {
              createAPIKeys?.();
            }}
          >
            Create
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              resetAPIKey?.();
              closeCreateAPIKeySheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[25vw]",
    onToggle: resetAPIKey,
  });

  return {
    createAPIKeySheet,
    openCreateAPIKeySheet,
    closeCreateAPIKeySheet,
  };
};
