import api from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useAuthGuard = () => {
  const router = useRouter();

  const { data, isError, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me"),
    retry: false,
  });

  useEffect(() => {
    if (isError) router.push("/login");
  }, [isError, router]);

  return { user: data, isLoading };
};

export const useIsLoggin = () => {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => api.get("/auth/me"),
    retry: false,
  });

  useEffect(() => {
    if (data) router.back();
  }, [data, router]);

  return { isLoading };
};
