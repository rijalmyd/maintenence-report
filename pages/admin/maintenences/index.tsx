import AdminLayout from "@/components/layout/admin";
import MaintenenceTable from "@/components/maintenence/MaintenenceTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MaintenencePage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daftar Maintenence</CardTitle>
          </CardHeader>
          <CardContent>
            <MaintenenceTable />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default MaintenencePage;
