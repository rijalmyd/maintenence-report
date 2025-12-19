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
import { Asset, Prisma } from "@/generated/prisma/client";
import { useDeleteVehicle, useGetAllVehicle } from "@/hooks/useVehicle";
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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import React from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import AssetForm from "../AssetForm";
import { nullable } from "zod";
import VehicleEditDialog from "./VehicleEditForm";
import { UpdateVehicleSchema } from "@/schema/vehicleSchema";
import { is } from "date-fns/locale";

type VehicleWithAsset = Prisma.VehicleGetPayload<{
  include: { asset: true };
}>;

export const columns: ColumnDef<VehicleWithAsset>[] = [
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
            warna: {row.original.color}
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
    accessorKey: "asset.brand",
    header: "Brand",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{row.original.asset.brand}</span>
          <span className="text-xs text-muted-foreground">
            tahun: {row.original.year}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "license_plate",
    header: "Nomor Plat",
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          <span className="font-semibold">{row.getValue("license_plate")}</span>
          <span className="text-xs text-muted-foreground">
            s/d: {formatDateID(row.original.stnk_due_date)}
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
      const vehicle = row.original;

      return (
        <div className="flex justify-end gap-2">
          {/* <ViewVehicle vehicle={vehicle} /> */}
          <EditVehicle vehicle={vehicle} />
          <DeleteVehicle vehicleId={vehicle.id} />
        </div>
      );
    },
  }
];

const VehicleTable: React.FC = () => {
  const spareparts = useGetAllVehicle();

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
          placeholder="Filter nomor plat..."
          value={
            (table.getColumn("license_plate")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("license_plate")?.setFilterValue(event.target.value)
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

const ViewVehicle = ({ vehicle }: { vehicle: VehicleWithAsset }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Eye className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Vehicle Detail</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm">
          <p><b>Name:</b> {vehicle.asset.name}</p>
          <p><b>Brand:</b> {vehicle.asset.brand}</p>
          <p><b>Color:</b> {vehicle.color}</p>
          <p><b>License Plate:</b> {vehicle.license_plate}</p>
          <p><b>Year:</b> {vehicle.year}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeleteVehicle = ({ vehicleId }: { vehicleId: string }) => {
  const [open, setOpen] = React.useState(false);
  const deleteVehicle = useDeleteVehicle();

  const handleDelete = async () => {
    try {
      await deleteVehicle.mutateAsync(vehicleId);
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
            vehicle.
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

const EditVehicle = ({ vehicle }: { vehicle: VehicleWithAsset }) => {
  const defaultValues = {
    asset_code: vehicle.asset.asset_code,
    brand: vehicle.asset.brand ?? undefined,
    model: vehicle.asset.model ?? undefined,
    name: vehicle.asset.name,
    purchase_price: vehicle.asset.purchase_price ?? undefined,
    serial_number: vehicle.asset.serrial_number ?? undefined,
    purchase_date: vehicle.asset.purchase_date
      ? new Date(vehicle.asset.purchase_date)
      : undefined,
    is_active: vehicle.asset.is_active,
    color: vehicle.color ?? undefined,
    frame_number: vehicle.frame_number ?? undefined,
    engine_number: vehicle.engine_number ?? undefined,
    license_plate: vehicle.license_plate ?? undefined,
    year: vehicle.year ?? undefined,
    no_kir: vehicle.no_kir ?? undefined,
    kir_due_date: vehicle.kir_due_date
      ? new Date(vehicle.kir_due_date)
      : undefined,
    stnk_due_date: vehicle.stnk_due_date
      ? new Date(vehicle.stnk_due_date)
      : undefined,
    notes: vehicle.notes ?? undefined
  }

  return (
    <VehicleEditDialog
      vehicleId={vehicle.id}
      defaultValues={defaultValues}
    />
  );
};


export default VehicleTable;
