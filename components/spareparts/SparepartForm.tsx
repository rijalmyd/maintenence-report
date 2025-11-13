import { useCreateSparepart } from "@/hooks/useSparepart";
import { CreateSparepartSchema } from "@/schema/sparepartSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../ui/button";
import { Field, FieldGroup, FieldSet } from "../ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { Textarea } from "../ui/textarea";

const SparepartForm: React.FC = () => {
  const form = useForm<z.infer<typeof CreateSparepartSchema>>({
    resolver: zodResolver(CreateSparepartSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      price: 0,
      stock_quantity: 0,
      unit: "",
    },
  });

  const sparepartMutation = useCreateSparepart();

  const onSubmit = (values: z.infer<typeof CreateSparepartSchema>) => {
    sparepartMutation.mutate(values);
    form.reset();
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kode</FormLabel>
                  <FormControl>
                    <Input placeholder="contoh: SPR-XXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Sparepart" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Harga / Satuan</FormLabel>
                  <FormControl>
                    <InputGroup>
                      <InputGroupInput
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                      <InputGroupAddon>Rp</InputGroupAddon>
                    </InputGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock_quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Jumlah Stok</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="0"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value === ""
                              ? undefined
                              : Number(e.target.value)
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Satuan</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="contoh: pcs,box dll."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </FieldSet>
          <Field orientation="horizontal">
            {sparepartMutation.isPending ? (
              <Button type="button" disabled>
                <Loader2Icon className="animate-spin" />
                Save
              </Button>
            ) : (
              <Button type="submit">Submit</Button>
            )}
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
};

export default SparepartForm;
