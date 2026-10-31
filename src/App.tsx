/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Footer } from './components/layout/Footer';
import { HelpModal } from './components/help/HelpModal';
import { CartDrawer } from './components/marketplace/CartDrawer';
import { LiveTrackingModal } from './components/equipment/LiveTrackingModal';
import { FarmerDashboard } from './components/dashboard/FarmerDashboard';
import { CooperativeDashboard } from './components/dashboard/CooperativeDashboard';
import { EquipmentMatching } from './components/equipment/EquipmentMatching';
import { MyBookingsView } from './components/bookings/MyBookingsView';
import { GroupBookingSection } from './components/equipment/GroupBookingSection';
import { MarketplaceView } from './components/marketplace/MarketplaceView';
import { CropOperationPlanner } from './components/planner/CropOperationPlanner';
import { DemandPredictionView } from './components/demand/DemandPredictionView';
import { DynamicPricingTool } from './components/pricing/DynamicPricingTool';
import { SettingsView } from './components/settings/SettingsView';
import { LabourJobsPage } from './components/labour/LabourJobsPage';
import { PostLabourJobForm } from './components/labour/PostLabourJobForm';
import { MyLabourJobs } from './components/labour/MyLabourJobs';
import { HelpCircle, Phone } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { currentTab, activeTrackingBooking, closeTrackingModal, openHelp } = useApp();
  const { user, isAuthenticated } = useAuth();
  
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // If user is not logged in, but wants to view labour jobs, let them see LabourJobsPage without login!
  if (!isAuthenticated && currentTab !== 'labour-jobs') {
    return <LoginPage />;
  }

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'home':
        return user?.role === 'cooperative' ? <CooperativeDashboard /> : <FarmerDashboard />;
      case 'matching':
        return <EquipmentMatching />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'bookings':
        return <MyBookingsView />;
      case 'group-booking':
        return <GroupBookingSection />;
      case 'crop-planner':
        return <CropOperationPlanner />;
      case 'demand-forecast':
        return <DemandPredictionView />;
      case 'pricing-tool':
        return <DynamicPricingTool />;
      case 'settings':
        return <SettingsView />;
      case 'labour-jobs':
        return <LabourJobsPage />;
      case 'post-labour-job':
        return <PostLabourJobForm />;
      case 'my-labour-jobs':
        return <MyLabourJobs />;
      default:
        return <FarmerDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex bg-[#FAF8F3] dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-200">
      {/* Left Sidebar (Desktop fixed, Mobile slide-in drawer) */}
      <Sidebar 
        isMobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area to the right of the sidebar */}
      <div className="flex-1 md:pl-60 min-w-0 flex flex-col min-h-screen">
        {/* Slim Top Bar */}
        <TopBar 
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenCartDrawer={() => setCartDrawerOpen(true)}
        />

        {/* Page Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          {renderCurrentView()}
        </main>

        {/* Trustable Footer */}
        <Footer />
      </div>

      {/* Floating Help Button (compact round icon with hover label) */}
      <aside aria-label="Quick help support" className="fixed bottom-5 right-5 z-40">
        <div className="relative group flex items-center justify-center">
          <button
            onClick={openHelp}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white flex items-center justify-center shadow-md transition-all hover:scale-105 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
            title="Help & Support"
            aria-label="Open help and support dialog"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
          <span className="pointer-events-none absolute right-full mr-2.5 px-2.5 py-1 rounded-md bg-stone-900/90 dark:bg-stone-800 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            Help & Support
          </span>
        </div>
      </aside>

      {/* Help Modal */}
      <HelpModal />

      {/* Supplies Cart Drawer */}
      <CartDrawer
        isOpen={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
      />

      {/* Live Map Tracking Modal */}
      <LiveTrackingModal
        booking={activeTrackingBooking}
        onClose={closeTrackingModal}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <MainLayout />
      </AppProvider>
    </AuthProvider>
  );
}
