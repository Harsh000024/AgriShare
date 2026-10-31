import React, { useState } from 'react';
import { 
  Tractor, 
  Home, 
  ShoppingBag, 
  Layers, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Sun, 
  Moon, 
  LogOut, 
  Type, 
  X, 
  Users, 
  Calendar, 
  BarChart3, 
  DollarSign, 
  Briefcase, 
  LogIn,
  Settings
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { hasCustomAvatar, getUserInitials } from '../../utils/avatar';

interface SidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen = false, onCloseMobile }) => {
  const { 
    currentTab, 
    setCurrentTab, 
    isDarkMode, 
    toggleDarkMode, 
    cart, 
    bookings, 
    openHelp, 
    textSize, 
    toggleTextSize, 
    labourJobs 
  } = useApp();

  const { user, logout, switchRole } = useAuth();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const activeBookingsCount = bookings.filter(b => b.status === 'in_progress' || b.status === 'confirmed').length;
  const openJobsCount = labourJobs?.filter(j => j.status === 'Open').length || 0;

  const handleNav = (tab: NavigationTab) => {
    setCurrentTab(tab);
    onCloseMobile?.();
    setProfileDropdownOpen(false);
  };

  const handleHelpClick = () => {
    openHelp();
    onCloseMobile?.();
    setProfileDropdownOpen(false);
  };

  const isTabActive = (tab: NavigationTab) => currentTab === tab;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="md:hidden fixed inset-0 bg-stone-900/60 backdrop-blur-xs z-40 transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-60 bg-white dark:bg-stone-900 border-r border-stone-200 dark:border-stone-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Top Header / Logo */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-800 shrink-0">
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Tractor className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-stone-900 dark:text-stone-50 block leading-tight">
                Agri<span className="text-emerald-600 dark:text-emerald-400">Share</span>
              </span>
              <span className="text-[10px] text-stone-500 dark:text-stone-400 font-medium block">
                Farm equipment & supplies
              </span>
            </div>
          </div>

          {/* Close button on mobile */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-4 text-xs scrollbar-thin">
          {/* Main Section */}
          <div className="space-y-0.5">
            {/* 1. Home */}
            <button
              onClick={() => handleNav('home')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('home')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Home className={`w-4 h-4 shrink-0 ${isTabActive('home') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Home</span>
              </div>
            </button>

            {/* 2. Find Machines */}
            <button
              onClick={() => handleNav('matching')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('matching')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Tractor className={`w-4 h-4 shrink-0 ${isTabActive('matching') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Find Machines</span>
              </div>
            </button>

            {/* 3. Labour Jobs */}
            <button
              onClick={() => handleNav('labour-jobs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                ['labour-jobs', 'post-labour-job', 'my-labour-jobs'].includes(currentTab)
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Briefcase className={`w-4 h-4 shrink-0 ${['labour-jobs', 'post-labour-job', 'my-labour-jobs'].includes(currentTab) ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Labour Jobs</span>
              </div>
              {openJobsCount > 0 && (
                <span className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-1.5">
                  {openJobsCount}
                </span>
              )}
            </button>

            {/* 4. Farm Supplies */}
            <button
              onClick={() => handleNav('marketplace')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('marketplace')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <ShoppingBag className={`w-4 h-4 shrink-0 ${isTabActive('marketplace') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Farm Supplies</span>
              </div>
              {cartCount > 0 && (
                <span className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-1.5">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 5. My Bookings */}
            <button
              onClick={() => handleNav('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('bookings')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Layers className={`w-4 h-4 shrink-0 ${isTabActive('bookings') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">My Bookings</span>
              </div>
              {activeBookingsCount > 0 && (
                <span className="bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] px-1.5 py-0.5 rounded-full font-medium ml-1.5">
                  {activeBookingsCount}
                </span>
              )}
            </button>
          </div>

          {/* Tools Section */}
          <div className="space-y-0.5">
            <div className="px-3 py-1 text-[11px] font-medium text-stone-400 dark:text-stone-500">
              Tools
            </div>

            {/* Crop Planner */}
            <button
              onClick={() => handleNav('crop-planner')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('crop-planner')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Calendar className={`w-4 h-4 shrink-0 ${isTabActive('crop-planner') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Crop Planner</span>
              </div>
            </button>

            {/* Group Booking */}
            <button
              onClick={() => handleNav('group-booking')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('group-booking')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Users className={`w-4 h-4 shrink-0 ${isTabActive('group-booking') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Group Booking</span>
              </div>
            </button>

            {/* Expected Demand */}
            <button
              onClick={() => handleNav('demand-forecast')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('demand-forecast')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <BarChart3 className={`w-4 h-4 shrink-0 ${isTabActive('demand-forecast') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Expected Demand</span>
              </div>
            </button>

            {/* Today's Prices (Owners) */}
            <button
              onClick={() => handleNav('pricing-tool')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('pricing-tool')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <DollarSign className={`w-4 h-4 shrink-0 ${isTabActive('pricing-tool') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Today's Prices</span>
              </div>
            </button>

            {/* Post Labour Job */}
            <button
              onClick={() => handleNav('post-labour-job')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('post-labour-job')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Briefcase className={`w-4 h-4 shrink-0 ${isTabActive('post-labour-job') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">Post Labour Job</span>
              </div>
            </button>

            {/* My Labour Jobs */}
            <button
              onClick={() => handleNav('my-labour-jobs')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm transition-colors cursor-pointer select-none ${
                isTabActive('my-labour-jobs')
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold'
                  : 'text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Users className={`w-4 h-4 shrink-0 ${isTabActive('my-labour-jobs') ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-stone-500'}`} />
                <span className="truncate">My Labour Jobs</span>
              </div>
            </button>
          </div>

          {/* Third Section: Help */}
          <div className="space-y-0.5 pt-1">
            <div className="px-3 py-1 text-[11px] font-medium text-stone-400 dark:text-stone-500">
              Support
            </div>

            <button
              onClick={handleHelpClick}
              className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-normal hover:bg-stone-100 dark:hover:bg-stone-800/60 transition-colors cursor-pointer select-none"
            >
              <div className="flex items-center gap-2.5 truncate">
                <HelpCircle className="w-4 h-4 text-stone-400 dark:text-stone-500 shrink-0" />
                <span className="truncate">Help & FAQs</span>
              </div>
            </button>
          </div>
        </div>

        {/* Bottom Section: Controls & Profile */}
        <div className="border-t border-stone-200 dark:border-stone-800 p-2.5 space-y-2 bg-stone-50/70 dark:bg-stone-900/70 shrink-0">
          {/* Accessibility & Theme Toggles */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={toggleTextSize}
              className="px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title="Toggle accessible font size"
            >
              <Type className="w-3.5 h-3.5 shrink-0" />
              <span>{textSize === 'large' ? 'Normal' : 'Bigger'}</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="px-2 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 hover:bg-white dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>

          {/* Profile Area */}
          {user ? (
            <div className="relative">
              {/* Profile Dropdown Popover (opens upward) */}
              {profileDropdownOpen && (
                <div 
                  className="absolute bottom-full mb-2 left-0 right-0 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 shadow-xl py-2 z-50 text-xs animate-in fade-in slide-in-from-bottom-2 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-700">
                    <p className="font-bold text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-500 truncate">{user.phone || user.email}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <span className="text-[10px] font-medium text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-700 px-1.5 py-0.5 rounded capitalize">
                        {user.role === 'farmer' ? 'Farmer' : 'Machine Owner'}
                      </span>
                      <span className="text-[10px] text-stone-400 truncate">• {user.villageOrDistrict || 'Local'}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleNav('settings')}
                      className="w-full text-left px-3 py-2 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Settings className="w-3.5 h-3.5 text-stone-500" />
                      <span>My Profile & Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        switchRole(user.role === 'farmer' ? 'owner' : 'farmer');
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2 cursor-pointer font-medium"
                    >
                      <Tractor className="w-3.5 h-3.5" />
                      <span>Switch to {user.role === 'farmer' ? 'Owner Mode' : 'Farmer Mode'}</span>
                    </button>
                  </div>

                  <div className="border-t border-stone-100 dark:border-stone-700 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Profile Card Button */}
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`w-full p-2 rounded-xl flex items-center justify-between transition-all cursor-pointer select-none ${
                  profileDropdownOpen
                    ? 'bg-stone-200 dark:bg-stone-700'
                    : 'bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700/80 border border-stone-200 dark:border-stone-700'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {hasCustomAvatar(user.avatar) ? (
                    <img
                      src={user.avatar!}
                      alt={user.name}
                      className="w-7 h-7 rounded-full object-cover border border-emerald-500 shrink-0"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/40 shrink-0">
                      {getUserInitials(user.name)}
                    </div>
                  )}
                  <div className="min-w-0 text-left">
                    <span className="text-xs font-bold text-stone-900 dark:text-stone-100 block truncate leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-stone-500 dark:text-stone-400 block truncate leading-tight capitalize">
                      {user.role}
                    </span>
                  </div>
                </div>

                {profileDropdownOpen ? (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                ) : (
                  <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleNav('home')}
              className="w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Login / Register</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
