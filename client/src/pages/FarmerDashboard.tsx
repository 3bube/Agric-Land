import { useState } from "react";
import { SearchableListings } from "@/components/SearchableListings";
import { InquiryTracker } from "@/components/InquiryTracker";
import { NotificationCenter } from "@/components/NotificationCenter";
import { FavoritesSection } from "@/components/FavoriteSection";

type View = "listings" | "inquiries" | "notifications" | "favorites";

export default function FarmerDashboard() {
  const [currentView, setCurrentView] = useState<View>("listings");

  return (
    <div className="flex h-screen bg-white">
      <main className="flex-1 overflow-y-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Farmer's Dashboard</h1>
        {currentView === "listings" && <SearchableListings />}
        {currentView === "inquiries" && <InquiryTracker />}
        {currentView === "notifications" && <NotificationCenter />}
        {currentView === "favorites" && <FavoritesSection />}
      </main>
    </div>
  );
}
