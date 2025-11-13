import { Sparepart } from "@/generated/prisma/client";
import { handleApiError } from "@/lib/errorHandler";
import api from "@/lib/fetcher";
import { CreateSparepartSchema } from "@/schema/sparepartSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import z from "zod";

// get all sparepart
export const useGetAllSparepart = () => {
  return useQuery<Sparepart[]>({
    queryKey: ["spareparts"],
    queryFn: async () => {
      const res = await api.get(`/spareparts`);
      return res.data.data;
    },
  });
};

// create sparepart
export const useCreateSparepart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof CreateSparepartSchema>) => {
      const res = await api.post(`/spareparts`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["spareparts"] });
      toast.success("Sparapert created successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Login gagal");
    },
  });
};
