import { handleApiError } from "@/lib/errorHandler";
import api from "@/lib/fetcher";
import { Maintenence } from "@/types/maintenence";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { on } from "events";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// get all equipment
export const useGetAllMaintenence = () => {
  return useQuery<Maintenence[]>({
    queryKey: ["maintenences"],
    queryFn: async () => {
      const res = await api.get(`/maintenences`);
      return res.data.data;
    },
  });
};

export const useDeleteMaintenence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (maintenenceId: string) => {
      const res = await api.delete(`/maintenences/${maintenenceId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenences"] });
      toast.success("Maintenence deleted successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Maintenence delete failed");
    },
  });
};

export const useUpdateMaintenence = (maintenenceId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Maintenence>) => {
      const res = await api.put(`/maintenences/${maintenenceId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maintenences"] });
      toast.success("Maintenence updated successfully");
    },
    onError: (error: unknown) => {
      handleApiError(error, "Maintenence update failed");
    },
  });
};