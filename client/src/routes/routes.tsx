import { Route, Routes, Navigate } from "react-router-dom";
import Auth from "@/pages/auth";
import FarmerDashboard from "@/pages/FarmerDashboard";
import LandOwnerDashboard from "@/pages/LandOwner";
import DashboardLayout from "@/components/Layout";
import { InquiryTracker } from "@/components/InquiryTracker";
import LandOwnerInquiries from "@/pages/LandOwnerInquiries";
import { FavoritesSection } from "@/components/FavoriteSection";
import Notifications from "@/pages/Notifications";
import Analytics from "@/components/Analytics";
import ProtectedRoute from "@/components/ProtectedRoute";
import Messages from "@/pages/Messages";
import Chat from "@/pages/Chat";
import Agreements from "@/pages/Agreements";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<Auth />} />

      {/* Farmer routes */}
      <Route
        path="/dashboard/farmer"
        element={
          <ProtectedRoute allowedRoles={["farmer"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<FarmerDashboard />} />
        <Route path="inquiries" element={<InquiryTracker />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="favorites" element={<FavoritesSection />} />
        <Route path="messages" element={<Messages />} />
        <Route path="chat/:chatId" element={<Chat />} />
        <Route path="agreements" element={<Agreements />} />
      </Route>

      {/* Landowner routes */}
      <Route
        path="/dashboard/landowner"
        element={
          <ProtectedRoute allowedRoles={["landowner"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<LandOwnerDashboard />} />
        <Route path="inquiries" element={<LandOwnerInquiries />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="messages" element={<Messages />} />
        <Route path="chat/:chatId" element={<Chat />} />
        <Route path="agreements" element={<Agreements />} />
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default AppRoutes;
