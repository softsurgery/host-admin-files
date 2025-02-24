import { api } from "@/api";
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
import { Download, Trash } from "lucide-react";
import { useFileActions } from "./action-context";
import { useFileUploaderStore } from "@/hooks/stores/useFileUploaderStore";

interface DataTableRowActionsProps {
  row: Row<UploadFile>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const file = row.original;
  const ext = file?.filename?.split(".").pop()?.trim().toLowerCase() || "";
  const fileUploaderStore = useFileUploaderStore();
  const { openDeleteFileDialog } = useFileActions();
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
      <DropdownMenuContent align="center" side="bottom">
        <DropdownMenuLabel>Actions </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            api.upload.downloadFile(file?.uuid, ext);
          }}
        >
          <Download /> Download
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500"
          onClick={() => {
            fileUploaderStore.set("uuid", file?.uuid);
            openDeleteFileDialog?.();
          }}
        >
          <Trash /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
