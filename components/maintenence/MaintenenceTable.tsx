import { useDeleteMaintenence, useGetAllMaintenence } from "@/hooks/useMaintenences";
import { formatDateID } from "@/lib/formatDate";
import { Maintenence } from "@/types/maintenence";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ChevronDown, Download, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from "../ui/alert-dialog";

export const columns: ColumnDef<Maintenence>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "no",
    header: "No",
    cell: ({ row }) => <div className="capitalize">{row.index + 1}</div>,
  },
  {
    accessorKey: "record_number",
    header: "Nomor",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.record_number}</div>
    ),
  },
  {
    accessorKey: "asset",
    header: "Asset",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.asset.name}</div>
    ),
  },
  {
    accessorKey: "km_asset",
    header: "Kilometer",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.km_asset} Km</div>
    ),
  },
  {
    accessorKey: "user_id",
    header: "User",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.user.fullname}</div>
    ),
  },
  {
    accessorKey: "complaint",
    header: "Komplain",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.complaint}</div>
    ),
  },
  {
    accessorKey: "asset.asset_type",
    header: "Jenis Aset",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.asset.asset_type}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Tanggal Perbaikan",
    cell: ({ row }) => (
      <div className="capitalize">{formatDateID(row.original.createdAt)}</div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const maintenance = row.original;
      return (
         <div className="flex justify-end gap-2">
          <DownloadMaintenancePDF maintenanceId={maintenance.id} />
          <DeleteMaintenance maintenanceId={maintenance.id} />
         </div>
      );
    },
  },
];
const MaintenenceTable: React.FC = () => {
  const spareparts = useGetAllMaintenence();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: spareparts.data ?? [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter nomor laporan..."
          value={
            (table.getColumn("record_number")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("record_number")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

const DeleteMaintenance = ({ maintenanceId }: { maintenanceId: string }) => {
  const [open, setOpen] = React.useState(false);
  const deleteMaintenance = useDeleteMaintenence();

  const handleDelete = async () => {
    try {
      await deleteMaintenance.mutateAsync(maintenanceId);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            maintenance report.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete
          </AlertDialogAction>  
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

// add authorization header to fetch request and open in new browser tab
const DownloadMaintenancePDF = ({
  maintenanceId,
}: {
  maintenanceId: string;
}) => {
  // const handleDownload = () => {
  //   // open PDF in new tab or force download
  //   window.open(
  //     `/api/maintenences/pdf?id=${maintenanceId}`,
  //     "_blank"
  //   );
  // };
  const handleDownload = () => {
    const authToken = localStorage.getItem("token"); // Adjust based on how you store the token

    fetch(`/api/maintenences/pdf?id=${maintenanceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob();
      })
      .then((blob) => {
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `maintenance_${maintenanceId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
      });
  };

  return (
    <Button
      size="icon"
      variant="outline"
      onClick={handleDownload}
      title="Download PDF"
    >
      <Download className="h-4 w-4" />
    </Button>
  );
};

export default MaintenenceTable;
