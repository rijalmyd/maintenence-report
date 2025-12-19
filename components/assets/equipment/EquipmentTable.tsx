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
import { useDeleteEquipment, useGetAllEquipment } from "@/hooks/useEquipment";
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
import EquipmentEditForm from "./EquipmentEditForm";
import { useDeleteVehicle } from "@/hooks/useVehicle";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction, AlertDialogHeader, AlertDialogFooter } from "@/components/ui/alert-dialog";

type EquipmentWithAsset = Prisma.EquipmentGetPayload<{
  include: { asset: true };
}>;

export const columns: ColumnDef<EquipmentWithAsset>[] = [
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
            {asset?.brand && `brand: ${asset.brand}`}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "asset.code",
    header: "Kode",
    cell: ({ row }) => (
      <div className="capitalize">{row.original.asset?.asset_code}</div>
    ),
  },
  {
      accessorKey: "asset.model",
      header: "Model",
      cell: ({ row }) => {
        return (
          <div className="flex flex-col">
            <span className="font-semibold">{row.original.asset?.model}</span>
            <span className="text-xs text-muted-foreground">
              no seri: {row.original.asset?.serrial_number}
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
      const equipment = row.original;
      return (
        <div className="flex justify-end gap-2">
          {/* <ViewEquipment equipment={equipment} /> */}
          <EditEquipment equipment={equipment} />
          <DeleteEquipment equipmentId={equipment.id} />
        </div>
      );
    },
  },
];

const EquipmentTable = () => {
  const spareparts = useGetAllEquipment();

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

const DeleteEquipment = ({ equipmentId }: { equipmentId: string }) => {
  const [open, setOpen] = React.useState(false);
  const deleteEquipment = useDeleteEquipment();

  const handleDelete = async () => {
    try {
      await deleteEquipment.mutateAsync(equipmentId);
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
            equipment.
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

const EditEquipment = ({ equipment }: { equipment: EquipmentWithAsset }) => {
  const defaultValues = {
    asset_code: equipment.asset.asset_code,
    brand: equipment.asset.brand ?? undefined,
    model: equipment.asset.model ?? undefined,
    name: equipment.asset.name,
    purchase_price: equipment.asset.purchase_price ?? undefined,
    serial_number: equipment.asset.serrial_number ?? undefined,
    purchase_date: equipment.asset.purchase_date
      ? new Date(equipment.asset.purchase_date)
      : undefined,
    is_active: equipment.asset.is_active,
    equipment_code: equipment.equipment_code ?? undefined,
    equipment_type: equipment.equipment_type ?? undefined,
    specification: equipment.specification ?? undefined,
    condition: equipment.condition ?? undefined,
  }

  return (
    <EquipmentEditForm
      equipmentId={equipment.id}
      defaultValues={defaultValues}
    />
  );
};

export default EquipmentTable;
