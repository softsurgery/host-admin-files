import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UploadFile } from "@/types/UploadFile";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { CopyIcon, Settings2, Telescope, Trash2 } from "lucide-react";
// import { useFileActions } from "./action-context";

interface DataTableRowActionsProps {
  row: Row<UploadFile>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const file = row.original;
  // const { openUpdateFileSheet, openDeleteFileDialog, openDuplicateFileDialog } =
  //   useFileActions();

  // const fileManager = useFileManager();

  // const targetFile = () => {
  //   fileManager.setRole(role);
  // };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-[160px]">
        <DropdownMenuLabel className="text-center">Actions </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {}}>
          <Telescope className="h-5 w-5 mr-2" /> Inspect
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            // targetFile();
            // openUpdateFileSheet();
          }}
        >
          <Settings2 className="h-5 w-5 mr-2" /> Update
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            // targetFile();
            // openDuplicateFileDialog();
          }}
        >
          <CopyIcon className="h-5 w-5 mr-2" /> Duplicate
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            // targetFile();
            // openDeleteFileDialog();
          }}
        >
          <Trash2 className="h-5 w-5 mr-2" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
