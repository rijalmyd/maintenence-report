import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { LoginUserSchema } from "@/schema/userSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormField, FormItem } from "../ui/form";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // form use
  const form = useForm<z.infer<typeof LoginUserSchema>>({
    resolver: zodResolver(LoginUserSchema),
    defaultValues: {
      username: "",
      password: "",
      role: "ADMIN",
    },
  });

  // login mutation
  const loginMutation = useLogin();

  // on submit
  const onSubmit = (value: z.infer<typeof LoginUserSchema>) => {
    loginMutation.mutate(value);
  };

  // show/hide password
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FieldLabel htmlFor="">Username</FieldLabel>
                      <Input
                        id="username"
                        type="username"
                        placeholder="m@example.com"
                        {...field}
                        required
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      {/* wrapper relative supaya ikon bisa ditempatkan di kanan */}
                      <div className="relative">
                        <Input
                          id="password"
                          // letakkan {...field} dulu supaya value & onChange terpasang,
                          // lalu override type sesuai showPassword
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukan Password"
                          required
                        />

                        {/* tombol toggle */}
                        <button
                          type="button"
                          onClick={() => setShowPassword((s) => !s)}
                          aria-label={
                            showPassword ? "Hide password" : "Show password"
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center justify-center rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormItem>
                  )}
                />
                <Field>
                  <Button type="submit">Login</Button>
                  <Button variant="outline" type="button">
                    Login with Google
                  </Button>
                  <FieldDescription className="text-center">
                    Don&apos;t have an account? <a href="#">Sign up</a>
                  </FieldDescription>
                </Field>
              </FieldGroup>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
