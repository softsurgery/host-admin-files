import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { Edit, Trash } from "lucide-react";
import { useApiKeyActions } from "./action-context";
import { ApiKey } from "@/types/APIKey";
import { useAPIKeyStore } from "@/hooks/stores/useAPIKeyStore";

interface DataTableRowActionsProps {
  row: Row<ApiKey>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const key = row.original;
  const { openDeleteAPIKeyDialog } = useApiKeyActions();
  const apiKeyStore = useAPIKeyStore();
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
        <DropdownMenuItem>
          <Edit /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="text-red-500"
          onClick={() => {
            apiKeyStore.set("id", key.id);
            apiKeyStore.set("name", key.name);
            openDeleteAPIKeyDialog?.();
          }}
        >
          <Trash /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
