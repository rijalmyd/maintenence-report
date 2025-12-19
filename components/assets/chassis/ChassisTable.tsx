import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@/generated/prisma/browser";
import { Asset } from "@/generated/prisma/client";
import { useDeleteChassis, useGetAllChassis } from "@/hooks/useChassis";
import { useDeleteVehicle } from "@/hooks/useVehicle";

import { formatDateID } from "@/lib/formatDate";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Trash2 } from "lucide-react";
import React from "react";
import ChassisEditForm from "./ChassisEditForm";

type ChassisWithAsset = Prisma.ChassisGetPayload<{
  include: { asset: true };
}>;

export const columns: ColumnDef<ChassisWithAsset>[] = [
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
    accessorKey: "asset.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nama
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => {
      const asset = row.original.asset as Asset;

      return (
        <div className="flex flex-col">
          <span className="font-semibold">{asset?.name}</span>
          <span className="text-sm text-muted-foreground">
            tipe: {row.original.chassis_type}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "asset.code",
    header: "Kode",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.asset.asset_code}</div>
    ),
  },
  {
      accessorKey: "chassis_category",
      header: "Kategori",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{row.getValue("chassis_category")}</span>
            <span className="text-xs text-muted-foreground">
              axle: {row.original.axle_count}
            </span>
          </div>
      );
    },
  },
  {
    accessorKey: "no_kir",
    header: "Nomor KIR",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{row.getValue("no_kir")}</span>
          <span className="text-xs text-muted-foreground">
            s/d: {formatDateID(row.original.kir_due_date)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "asset.status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="capitalize">
          {row.original.asset.is_active ? (
            <Badge>Aktif</Badge>
          ) : (
            <Badge variant="destructive">Tidak Aktif</Badge>
          )}
        </div>
      );
    },
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const chassis = row.original;
       return (
        <div className="flex justify-end gap-2">
          {/* /* <ViewVehicle vehicle={vehicle} /> */}
          <EditChassis chassis={chassis} /> 
          <DeleteChassis chassisId={chassis.id} />
        </div>
      );
    },
  },
];

const ChassisTable: React.FC = () => {
  const spareparts = useGetAllChassis();

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
          placeholder="Filter fullnames..."
          value={
            (table.getColumn("fullname")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("fullname")?.setFilterValue(event.target.value)
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


const DeleteChassis = ({ chassisId }: { chassisId: string }) => {
  const [open, setOpen] = React.useState(false);
  const deleteChassis = useDeleteChassis();

  const handleDelete = async () => {
    try {
      await deleteChassis.mutateAsync(chassisId);
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
            chassis.
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

const EditChassis = ({ chassis }: { chassis: ChassisWithAsset }) => {
  // Mapping data dari DB/API ke struktur Zod Schema
  const defaultValues = {
    // Mapping dari Asset (Table/Relation)
    asset_code: chassis.asset.asset_code,
    name: chassis.asset.name,
    brand: chassis.asset.brand ?? undefined,
    model: chassis.asset.model ?? undefined,
    serial_number: chassis.asset.serrial_number ?? undefined, // Typo fixed from 'serrial_number'
    purchase_date: chassis.asset.purchase_date
      ? new Date(chassis.asset.purchase_date)
      : undefined,
    purchase_price: chassis.asset.purchase_price ?? undefined,
    is_active: chassis.asset.is_active,

    // Mapping dari Chassis (Table) sesuai UpdateChassisSchema
    chassis_number: chassis.chassis_number ?? undefined,
    chassis_category: chassis.chassis_category ?? undefined,
    chassis_type: (chassis.chassis_type as "RANGKA" | "FLATBED") ?? undefined,
    axle_count: chassis.axle_count ?? undefined,
    no_kir: chassis.no_kir ?? undefined,
    kir_due_date: chassis.kir_due_date
      ? new Date(chassis.kir_due_date)
      : undefined,
    notes: chassis.notes ?? undefined,
  };

  return (
    <ChassisEditForm
      chassisId={chassis.id}
      defaultValues={defaultValues}
    />
  );
};

export default ChassisTable;
