import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/common/Sheet";
import { Spinner } from "@/components/common/Spinner";
import { WorkspaceForm } from "../WorkspaceForm";

interface WorkspaceUpdateSheetProps {
  updateWorkspace?: () => void;
  isUpdatePending?: boolean;
  resetWorkspace?: () => void;
}

export const useWorkspaceUpdateSheet = ({
  updateWorkspace,
  isUpdatePending,
  resetWorkspace,
}: WorkspaceUpdateSheetProps) => {
  const {
    SheetFragment: updateWorkspaceSheet,
    openSheet: openUpdateWorkspaceSheet,
    closeSheet: closeUpdateWorkspaceSheet,
  } = useSheet({
    title: (
      <div className="flex items-center gap-2">
        <Briefcase />
        New Workspace
      </div>
    ),
    description: "Use this form to define a new workspace within the system",
    children: (
      <div>
        <WorkspaceForm className="mt-4" />
        <div className="flex gap-2 justify-end my-4">
          <Button
            onClick={() => {
              updateWorkspace?.();
            }}
          >
            Save
            <Spinner show={isUpdatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeUpdateWorkspaceSheet();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    ),
    className: "min-w-[25vw]",
    onToggle: resetWorkspace,
  });

  return {
    updateWorkspaceSheet,
    openUpdateWorkspaceSheet,
    closeUpdateWorkspaceSheet,
  };
};
