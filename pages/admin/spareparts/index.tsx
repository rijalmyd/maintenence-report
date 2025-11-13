import AdminLayout from "@/components/layout/admin";
import SparepartForm from "@/components/spareparts/SparepartForm";
import SparepartTable from "@/components/spareparts/SparepartTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SparepartPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daftar Sparepart</CardTitle>
          </CardHeader>
          <CardContent>
            <SparepartTable />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create Sparepart</CardTitle>
          </CardHeader>
          <CardContent>
            <SparepartForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default SparepartPage;
