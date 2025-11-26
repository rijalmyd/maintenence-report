import api from "@/lib/fetcher";
import { Maintenence } from "@/types/maintenence";
import { useQuery } from "@tanstack/react-query";

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
