import Loading from "@/components/layout/loading";
import { LoginForm } from "@/components/login/login-form";
import { useIsLoggin } from "@/hooks/useAuthGuard";
import { Toaster } from "sonner";

export default function Page() {
  const { isLoading } = useIsLoggin();

  if (isLoading) return <Loading />;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Toaster richColors position="top-center" />
        <LoginForm />
      </div>
    </div>
  );
}
