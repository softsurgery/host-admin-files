import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { downloadFileFromUrl } from "@/lib/file.util";
import { UploadFile } from "@/types/UploadFile";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Download, Trash } from "lucide-react";

interface DataTableRowActionsProps {
  row: Row<UploadFile>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const file = row.original;
  const ext = file?.filename?.split(".").pop()?.trim().toLowerCase() || "";
  const url = `${import.meta.env.VITE_BASE_URL}/files.php?uuid=${file?.uuid}&ext=${ext}`;
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
        <DropdownMenuItem onClick={() => {
          downloadFileFromUrl(url);
        }}>
          <Download /> Download
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={() => {}}>
          <Trash /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
