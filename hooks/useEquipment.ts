import { Prisma } from "@/generated/prisma/client";
import api from "@/lib/fetcher";
import { CreateEquipementSchema, UpdateEquipmentSchema } from "@/schema/equipmentSchema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "sonner";
import z from "zod";

type EquipmentWithAsset = Prisma.EquipmentGetPayload<{
  include: { asset: true };
}>;

// get all equipment
export const useGetAllEquipment = () => {
  return useQuery<EquipmentWithAsset[]>({
    queryKey: ["equipments"],
    queryFn: async () => {
      const res = await api.get(`/equipments`);
      return res.data.data;
    },
  });
};

// create equipment
export const useCreateEquipment = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: z.infer<typeof CreateEquipementSchema>) => {
      const res = await api.post(`/equipments`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success("Asset created successfully");
      router.push("/admin/assets?asset=equipment");
      setTimeout(() => {
        router.reload();
      }, 1000);
    },
    onError: () => {
      toast.error("Failed to create Asset");
    },
  });
};

// update equipment
export const useUpdateEquipment = (equipmentId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Partial<z.infer<typeof UpdateEquipmentSchema>>) => {
      const res = await api.patch(`/equipments/${equipmentId}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success("Equipment updated successfully");
      router.push("/admin/assets?asset=equipment");
      setTimeout(() => {
        router.reload();
      }, 1000);
    },
    onError: () => {
      toast.error("Failed to update Equipment");
    },
  });
};

// delete equipment
export const useDeleteEquipment = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (equipmentId: string) => {
      const res = await api.delete(`/equipments/${equipmentId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipments"] });
      toast.success("Equipment deleted successfully");
      router.push("/admin/assets?asset=equipment");
      setTimeout(() => {
        router.reload();
      }, 1000);
    },
    onError: () => {
      toast.error("Failed to delete Equipment");
    },
  });
};