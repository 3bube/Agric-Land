import { useState } from "react";
import { ManageListings } from "@/components/ManageListing";
import InquiryManagement from "@/components/InquiryManager";
import { NotificationCenter } from "@/components/NotificationCenter";
import Analytics from "@/components/Analytics";

type View = "listings" | "inquiries" | "notifications" | "analytics";

export default function LandOwnerDashboard() {
  const [currentView, setCurrentView] = useState<View>("listings");

  return (
    <div className="flex  bg-white overflow-hidden ">
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Landowner's Dashboard</h1>
        {currentView === "listings" && <ManageListings />}
        {currentView === "inquiries" && <InquiryManagement />}
        {currentView === "notifications" && <NotificationCenter />}
        {currentView === "analytics" && <Analytics />}
      </main>
    </div>
  );
}
