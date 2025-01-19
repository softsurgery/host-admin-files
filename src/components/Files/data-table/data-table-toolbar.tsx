import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DataTableViewOptions } from "./data-table-view-options";
import { PackagePlus } from "lucide-react";
import { useFileActions } from "./action-context";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const { setPage, searchTerm, setSearchTerm } =
    useFileActions();
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter Files..."
          value={searchTerm?.toString()}
          onChange={(event) => {
            setPage?.(1);
            setSearchTerm?.(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[300px]"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            onClick={() => setSearchTerm?.("")}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <Button
        className="h-8 px-2 lg:px-3"
        variant="ghost"
        // onClick={openCreateFileSheet}
      >
        <PackagePlus className="h-6 w-6" />
        New File
      </Button>
      <DataTableViewOptions table={table} />
    </div>
  );
}
