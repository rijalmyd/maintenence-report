import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useCreateVehicle } from "@/hooks/useVehicle";
import { CreateAssetSchema } from "@/schema/assetSchema";
import { CreateVehicleSchema } from "@/schema/vehicleSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { Resolver, useForm } from "react-hook-form";
import z from "zod";

interface Props {
  asset: z.infer<typeof CreateAssetSchema> | null;
  onPrevius: () => void;
}

const VehicleForm: React.FC<Props> = ({ asset, onPrevius }) => {
  const form = useForm<z.infer<typeof CreateVehicleSchema>>({
    resolver: zodResolver(CreateVehicleSchema) as Resolver<
      z.infer<typeof CreateVehicleSchema>
    >,
    defaultValues: {
      asset: asset ?? undefined,
      color: "",
      engine_number: "",
      frame_number: "",
      kir_due_date: undefined,
      license_plate: "",
      no_kir: "",
      notes: "",
      stnk_due_date: undefined,
      vehicle_type: "",
      year: 2025,
    },
  });

  // vehicle mutation
  const vehicleMutation = useCreateVehicle();

  const onSubmit = (values: z.infer<typeof CreateVehicleSchema>) => {
    vehicleMutation.mutate(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Separator className="mb-4" />

        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warna</FormLabel>
              <FormControl>
                <Input placeholder="contoh: Merah, Hitam, dll." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="engine_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Mesin</FormLabel>
              <FormControl>
                <Input placeholder="contoh: MHF8983939" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="frame_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nomor Rangka</FormLabel>
              <FormControl>
                <Input placeholder="contoh: FRM8373883" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="license_plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Plat</FormLabel>
                <FormControl>
                  <Input placeholder="contoh: B 2828 C" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="stnk_due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>STNK Jatuh tempo</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal"
                      >
                        {field.value
                          ? field.value.toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => field.onChange(date ?? undefined)}
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="no_kir"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor KIR</FormLabel>
                <FormControl>
                  <Input placeholder="contoh: AST-XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="kir_due_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>KIR Jatuh tempo</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal"
                      >
                        {field.value
                          ? field.value.toLocaleDateString()
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="single"
                        selected={field.value ?? undefined}
                        onSelect={(date) => field.onChange(date ?? undefined)}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="vehicle_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Kendarran</FormLabel>
                <FormControl>
                  <Input placeholder="contoh: AST-XXX" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="contoh: AST-XXX"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex w-full justify-between">
          <Button onClick={onPrevius}>Kembali</Button>
          {vehicleMutation.isPending ? (
            <Button type="button" disabled>
              <Loader2Icon className="animate-spin" />
              Save
            </Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </Form>
  );
};

export default VehicleForm;
