import { useCreateDriver } from "@/hooks/useDriver";
import { CreateDriverSchema } from "@/schema/driverSchema";
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
import { Textarea } from "../ui/textarea";

const DriverForm: React.FC = () => {
  const form = useForm<z.infer<typeof CreateDriverSchema>>({
    resolver: zodResolver(CreateDriverSchema),
    defaultValues: {
      name: "",
      phone: "",
      notes: "",
    },
  });

  const driverMutation = useCreateDriver();

  const onSubmit = (values: z.infer<typeof CreateDriverSchema>) => {
    driverMutation.mutate(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="ex: 6286155380996" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
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
            {driverMutation.isPending ? (
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

export default DriverForm;
