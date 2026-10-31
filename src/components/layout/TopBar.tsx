import React, { useState } from 'react';
import { 
  Menu, 
  ShoppingBag, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface TopBarProps {
  onOpenMobileSidebar: () => void;
  onOpenCartDrawer: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onOpenMobileSidebar, onOpenCartDrawer }) => {
  const { 
    currentTab, 
    cart, 
    notifications, 
    markNotificationAsRead 
  } = useApp();

  const { user } = useAuth();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  // Compute page title and subtitle according to current tab
  const getPageHeading = () => {
    switch (currentTab) {
      case 'home':
        return {
          title: 'AgriShare',
          subtitle: 'Rent what you need. Buy only what you must own.'
        };
      case 'matching':
        return {
          title: 'Find Farm Machines',
          subtitle: 'Tractors, combine harvesters, planters & sprayers'
        };
      case 'labour-jobs':
        return {
          title: 'Farm Labour Jobs',
          subtitle: 'Daily work opportunities direct with farmers'
        };
      case 'post-labour-job':
        return {
          title: 'Post a Labour Job',
          subtitle: 'Hire workers for harvesting, sowing, or weeding'
        };
      case 'my-labour-jobs':
        return {
          title: 'My Posted Labour Jobs',
          subtitle: 'Manage applications and workers'
        };
      case 'marketplace':
        return {
          title: 'Farm Supplies Store',
          subtitle: 'Certified seeds, bio-fertilizers & storage bags'
        };
      case 'bookings':
        return {
          title: 'My Machine Bookings',
          subtitle: 'Track live status, machinery ETA & operations'
        };
      case 'group-booking':
        return {
          title: 'Group Equipment Booking',
          subtitle: 'Share transport with nearby farms and save up to 40%'
        };
      case 'crop-planner':
        return {
          title: 'Crop Operation Planner',
          subtitle: 'Seasonal machine booking schedule by crop cycle'
        };
      case 'demand-forecast':
        return {
          title: 'Machinery Demand Forecast',
          subtitle: 'Regional equipment deficits and peak booking windows'
        };
      case 'pricing-tool':
        return {
          title: "Today's Machine Rates",
          subtitle: 'Local market rental rates for tractor owners'
        };
      case 'settings':
        return {
          title: 'Profile & Farm Settings',
          subtitle: 'Manage your location, farm size, and crops'
        };
      default:
        return {
          title: 'AgriShare',
          subtitle: 'Agricultural Equipment & Supplies Platform'
        };
    }
  };

  const { title, subtitle } = getPageHeading();

  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 w-full bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 px-4 sm:px-6 flex items-center justify-between gap-3 select-none">
      {/* Left: Mobile hamburger + Page Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileSidebar}
          className="md:hidden p-2 -ml-1.5 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
          aria-label="Open sidebar menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 truncate leading-snug">
            {title}
          </h1>
          <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate hidden sm:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Cart & Notifications (like YouTube quick action area) */}
      <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
        {/* Supplies Cart Button */}
        <button
          onClick={onOpenCartDrawer}
          className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          title="Farm Supplies Cart"
          aria-label="Farm supplies cart"
        >
          <ShoppingBag className="w-5 h-5" />
          {cartCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-emerald-600 text-[10px] font-bold text-white shadow-xs">
              {cartCount}
            </span>
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
            className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadNotifsCount > 0 && (
              <span className="absolute 1.5 top-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            )}
          </button>

          {notifDropdownOpen && (
            <div 
              className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800">
                <span className="font-bold text-stone-900 dark:text-stone-100">Alerts & Tips</span>
                <span className="text-[10px] text-stone-400">{notifications.length} total</span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => markNotificationAsRead(n.id)}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      !n.read 
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900' 
                        : 'bg-stone-50/60 dark:bg-stone-800/40 border-stone-200 dark:border-stone-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-900 dark:text-stone-100">{n.title}</h4>
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">{n.message}</p>
                    <span className="text-[10px] text-stone-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
