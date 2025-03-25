import AdminLayout from "@/layouts/AdminLayout";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default function Admin() {
  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
