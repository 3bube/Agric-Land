import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "@/components/Sidebar";

export default function Layout() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/auth" />;

  return (
    <Sidebar>
      <Outlet />
    </Sidebar>
  );
}
