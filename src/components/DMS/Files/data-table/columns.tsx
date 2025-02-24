import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { UploadFile } from "@/types/UploadFile";
import { formatBytes } from "@/lib/utils";
import { formatDateToLocal } from "@/lib/date.utils";

export const getFileColumns = (): ColumnDef<UploadFile>[] => {
  return [
    {
      accessorKey: "Filename",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Filename"
          attribute="filename"
        />
      ),
      cell: ({ row }) => <div>{row.original.filename}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "uuid",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="UUID" attribute="uuid" />
      ),
      cell: ({ row }) => <div>{row.original.uuid || "No UUID"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "mime_type",
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="MIME Type"
          attribute="mime_type"
        />
      ),
      cell: ({ row }) => <div>{row.original.mime_type || "No MIME Type"}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "size",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Size" attribute="size" />
      ),
      cell: ({ row }) => <div>{formatBytes(row.original.size)}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "created_at",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Created at" attribute="created_at" />
      ),
      cell: ({ row }) => <div>{row.original.created_at && formatDateToLocal(row.original.created_at)}</div>,
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
