import { cn } from "@/lib/utils";
import { Workspace } from "@/types/Workspace";
import { EllipsisIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface WorkspaceEntryProps {
  className?: string;
  workspace?: Workspace;
  openUpdateDialog?: () => void;
  openDeleteDialog?: () => void;
}

export const WorkspaceEntry = ({
  className,
  workspace,
  openUpdateDialog,
  openDeleteDialog,
}: WorkspaceEntryProps) => {
  return (
    <div
      className={cn(
        "flex flex-row justify-between items-center w-full p-4 rounded-md shadow-md border",
        className
      )}
    >
      <div className="flex flex-col gap-2">
        <Label className="font-bold">
          {workspace?.name ? (
            workspace?.name
          ) : (
            <span className="font-thin">- No Name Provided -</span>
          )}
        </Label>
        <Label className="font-thin truncate">
          {workspace?.description ? (
            workspace?.description
          ) : (
            <span className="font-thin">- No Description Provided -</span>
          )}
        </Label>
        <Label className="text-xs"> Created At : {workspace?.created_at}</Label>
      </div>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline" size="icon" className="w-5 h-5 p-4">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="bottom">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openUpdateDialog}>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-500"
              onClick={openDeleteDialog}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
