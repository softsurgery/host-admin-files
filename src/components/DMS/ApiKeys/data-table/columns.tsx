import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { formatDateToLocal } from "@/lib/date.utils";
import { ApiKey } from "@/types/APIKey";

export const getFileColumns = (): ColumnDef<ApiKey>[] => {
  return [
    {
      accessorKey: "ID",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" attribute="id" />
      ),
      cell: ({ row }) => <div>{row.original.id}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" attribute="name" />
      ),
      cell: ({ row }) => <div>{row.original.name || "No Name"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "key",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Key" attribute="key" />
      ),
      cell: ({ row }) => <div>{row.original.key || "No Key"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "workspace",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Workspace"
          attribute="workspace"
        />
      ),
      cell: ({ row }) => (
        <div>{row.original.workspace?.name || "No Workspace"}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "Created At",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Created at"
          attribute="created_at"
        />
      ),
      cell: ({ row }) => (
        <div>
          {row.original.created_at &&
            formatDateToLocal(row.original.created_at)}
        </div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-center">
          <DataTableRowActions row={row} />
        </div>
      ),
    },
  ];
};
