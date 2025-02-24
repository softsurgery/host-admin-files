import { Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSheet } from "@/components/common/Sheet";
import { Spinner } from "@/components/common/Spinner";
import { WorkspaceForm } from "../WorkspaceForm";

interface WorkspaceCreateSheetProps {
  createWorkspace?: () => void;
  isCreatePending?: boolean;
  resetWorkspace?: () => void;
}

export const useWorkspaceCreateSheet = ({
  createWorkspace,
  isCreatePending,
  resetWorkspace,
}: WorkspaceCreateSheetProps) => {
  const {
    SheetFragment: createWorkspaceSheet,
    openSheet: openCreateWorkspaceSheet,
    closeSheet: closeCreateWorkspaceSheet,
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
        <WorkspaceForm className="my-5" />
        <div className="flex gap-2 justify-end my-4">
          <Button
            onClick={() => {
              createWorkspace?.();
            }}
          >
            Save
            <Spinner show={isCreatePending} />
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => {
              closeCreateWorkspaceSheet();
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
    createWorkspaceSheet,
    openCreateWorkspaceSheet,
    closeCreateWorkspaceSheet,
  };
};
