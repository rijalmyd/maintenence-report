import AdminLayout from "@/components/layout/admin";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UserForm from "@/components/users/UserForm";
import UserTable from "@/components/users/UserTable";

const UserPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-3">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Daftar User</CardTitle>
          </CardHeader>
          <CardContent>
            <UserTable />
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Create User</CardTitle>
          </CardHeader>
          <CardContent>
            <UserForm />
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default UserPage;
