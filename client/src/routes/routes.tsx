import { Route, Routes, Navigate } from "react-router-dom";
import Auth from "@/pages/auth";
import FarmerDashboard from "@/pages/FarmerDashboard";
import LandOwnerDashboard from "@/pages/LandOwner";
import DashboardLayout from "@/components/Layout";
import { InquiryTracker } from "@/components/InquiryTracker";
import { NotificationCenter } from "@/components/NotificationCenter";
import { FavoritesSection } from "@/components/FavoriteSection";
import ProtectedRoute from "@/components/ProtectedRoute";
import { ManageListings } from "@/components/ManageListing";
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
        <Route path="notifications" element={<NotificationCenter />} />
        <Route path="favorites" element={<FavoritesSection />} />
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
        <Route path="listings" element={<ManageListings />} />
        {/* <Route path="inquiries" element={<InquiryTracker />} /> */}
        {/* <Route path="notifications" element={<NotificationCenter />} /> */}
      </Route>

      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/auth" replace />} />
    </Routes>
  );
};

export default AppRoutes;
