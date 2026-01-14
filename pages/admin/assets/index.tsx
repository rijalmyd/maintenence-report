
import ChassisTable from "@/components/assets/chassis/ChassisTable";
import EquipmentTable from "@/components/assets/equipment/EquipmentTable";
import VehicleTable from "@/components/assets/vehicle/VehicleTable";
import DriverForm from "@/components/driver/DriverForm";
import ChassisImportExcel from "@/components/assets/chassis/ChassisImportExcel";
import ChassisImportPreviewDialog from "@/components/assets/chassis/ChassisImportPreviewDialog";
import AssetForm from "@/components/assets/AssetForm";
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
import { useState } from "react";
import { useBulkCreateChassis } from "@/hooks/useChassis";

const AssetPage: React.FC = () => {
  const route = useRouter();
  const searchParam = useSearchParams();

  const chassisBulkMutation = useBulkCreateChassis();

  const [importedData, setImportedData] = useState<any[]>([]);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleImport = (data: any[]) => {
    console.log("Imported Data:", data);
    setImportedData(data);
    setPreviewOpen(true);
  };

  const handleSubmitImport = async () => {
    chassisBulkMutation.mutate(importedData);

    setPreviewOpen(false);
    setImportedData([]);
  };

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Aset</CardTitle>
          <CardAction className="space-x-2">
            <ChassisImportExcel onImported={handleImport} />
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

      {/* DIALOG PREVIEW */}
      <ChassisImportPreviewDialog
        open={previewOpen}
        data={importedData}
        onClose={() => setPreviewOpen(false)}
        onSubmit={handleSubmitImport}
      />
    </AdminLayout>
  );
};

export default AssetPage;
