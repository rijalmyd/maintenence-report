import AssetForm from "@/components/assets/AssetForm";
import ChassisTable from "@/components/assets/chassis/ChassisTable";
import EquipmentTable from "@/components/assets/equipment/EquipmentTable";
import VehicleTable from "@/components/assets/vehicle/VehicleTable";
import AdminLayout from "@/components/layout/admin";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";

const AssetPage: React.FC = () => {
  const route = useRouter();
  const searchParam = useSearchParams();

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[7fr_1fr] gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daftar Aset</CardTitle>
            <CardAction>
              <AssetForm />
            </CardAction>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue={searchParam.get("asset") ?? "vehicle"}>
              <TabsList>
                <TabsTrigger
                  value="vehicle"
                  onClick={() => route.push("/admin/assets?asset=vehicle")}
                >
                  Kendaraan
                </TabsTrigger>
                <TabsTrigger
                  value="chassis"
                  onClick={() => route.push("/admin/assets?asset=chassis")}
                >
                  Chassis
                </TabsTrigger>
                <TabsTrigger
                  value="equipment"
                  onClick={() => route.push("/admin/assets?asset=equipment")}
                >
                  Equipment
                </TabsTrigger>
              </TabsList>
              <TabsContent value="vehicle">
                <VehicleTable />
              </TabsContent>
              <TabsContent value="chassis">
                <ChassisTable />
              </TabsContent>
              <TabsContent value="equipment">
                <EquipmentTable />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AssetPage;
