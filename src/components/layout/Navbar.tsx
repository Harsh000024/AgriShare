import React, { useState } from 'react';
import { 
  Tractor, 
  Home, 
  ShoppingBag, 
  Layers, 
  HelpCircle, 
  ChevronDown, 
  Sun, 
  Moon, 
  Bell, 
  LogOut, 
  UserCheck, 
  ShieldCheck, 
  DollarSign, 
  Type, 
  Menu, 
  X,
  Users,
  Calendar,
  BarChart3,
  Sparkles,
  Check,
  Briefcase,
  LogIn
} from 'lucide-react';
import { useApp, NavigationTab } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { hasCustomAvatar, getUserInitials } from '../../utils/avatar';

interface NavbarProps {
  onOpenCartDrawer: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCartDrawer }) => {
  const { 
    currentTab, 
    setCurrentTab, 
    isDarkMode, 
    toggleDarkMode, 
    cart, 
    bookings, 
    openHelp,
    currency,
    toggleCurrency,
    textSize,
    toggleTextSize,
    notifications,
    markNotificationAsRead,
    labourJobs
  } = useApp();

  const { user, logout, switchRole, isAuthenticated } = useAuth();

  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const unreadNotifsCount = notifications.filter(n => !n.read).length;
  const activeBookingsCount = bookings.filter(b => b.status === 'in_progress' || b.status === 'confirmed').length;
  const openJobsCount = labourJobs?.filter(j => j.status === 'Open').length || 0;

  const handleNav = (tab: NavigationTab) => {
    setCurrentTab(tab);
    setMoreDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-xs transition-colors">
      {/* Reduced clean top strip */}
      <div className="bg-emerald-700 dark:bg-emerald-950 text-white text-[11px] sm:text-xs py-1 px-3 sm:px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span className="font-medium text-emerald-100 truncate">
              Safe payments • Trusted sellers<span className="hidden sm:inline"> • 24/7 Field Support</span>
            </span>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3 text-[11px] shrink-0">
            {/* Bigger text accessibility toggle */}
            <button
              onClick={toggleTextSize}
              className="inline-flex items-center gap-1 text-emerald-100 hover:text-white cursor-pointer"
              title="Toggle accessible text size"
            >
              <Type className="w-3 h-3" />
              <span>{textSize === 'large' ? 'Normal' : 'Bigger Text'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-3">
          {/* Logo & Name (Prevent overlap with proper shrink-0 and padding) */}
          <div 
            onClick={() => handleNav('home')}
            className="flex items-center space-x-2 sm:space-x-2.5 cursor-pointer shrink-0 group select-none"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-sm shadow-emerald-700/25 group-hover:scale-105 transition-transform">
              <Tractor className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center space-x-1">
                <span className="text-lg sm:text-xl font-black tracking-tight text-stone-900 dark:text-stone-50">
                  Agri<span className="text-emerald-600 dark:text-emerald-400">Share</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 font-medium hidden sm:block">
                Farm equipment & supplies
              </p>
            </div>
          </div>

          {/* Desktop 5 Primary Navigation Items */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5 flex-1 justify-center max-w-2xl">
            {/* 1. Home */}
            <button
              onClick={() => handleNav('home')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'home'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shadow-2xs border border-emerald-200 dark:border-emerald-800'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* 2. Find Machines */}
            <button
              onClick={() => handleNav('matching')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'matching'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shadow-2xs border border-emerald-200 dark:border-emerald-800'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Tractor className="w-4 h-4" />
              <span>Find Machines</span>
            </button>

            {/* 2b. Labour Jobs (Board - No login required) */}
            <button
              onClick={() => handleNav('labour-jobs')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                ['labour-jobs', 'post-labour-job', 'my-labour-jobs'].includes(currentTab)
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shadow-2xs border border-emerald-200 dark:border-emerald-800'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Labour Jobs</span>
              {openJobsCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold animate-pulse">
                  {openJobsCount}
                </span>
              )}
            </button>

            {/* 3. Farm Supplies */}
            <button
              onClick={() => handleNav('marketplace')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'marketplace'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shadow-2xs border border-emerald-200 dark:border-emerald-800'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Farm Supplies</span>
              {cartCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 rounded-full font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* 4. My Bookings */}
            <button
              onClick={() => handleNav('bookings')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                currentTab === 'bookings'
                  ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 shadow-2xs border border-emerald-200 dark:border-emerald-800'
                  : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>My Bookings</span>
              {activeBookingsCount > 0 && (
                <span className="bg-emerald-600 text-white text-[10px] px-1.5 rounded-full font-bold">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            {/* 5. Help */}
            <button
              onClick={openHelp}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-all"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Help</span>
            </button>

            {/* "More" Dropdown for secondary features */}
            <div className="relative">
              <button
                onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-sm font-bold transition-all ${
                  ['group-booking', 'crop-planner', 'demand-forecast', 'pricing-tool'].includes(currentTab)
                    ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <span>More</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {moreDropdownOpen && (
                <div 
                  className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setMoreDropdownOpen(false)}
                >
                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Additional Tools
                  </div>

                  <button
                    onClick={() => handleNav('group-booking')}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span>Group Booking</span>
                    </div>
                    <span className="text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-1.5 rounded font-bold">
                      Save 40%
                    </span>
                  </button>

                  <button
                    onClick={() => handleNav('crop-planner')}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Crop Plan</span>
                  </button>

                  <button
                    onClick={() => handleNav('demand-forecast')}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4 text-amber-600" />
                    <span>Expected Demand</span>
                  </button>

                  <button
                    onClick={() => handleNav('pricing-tool')}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <span>Today's Prices (Owners)</span>
                  </button>

                  <div className="my-1 border-t border-stone-100 dark:border-stone-800"></div>

                  <div className="px-3 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Labour Management
                  </div>

                  <button
                    onClick={() => handleNav('post-labour-job')}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                    <span>Post Labour Job</span>
                  </button>

                  <button
                    onClick={() => handleNav('my-labour-jobs')}
                    className="w-full text-left px-3.5 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                  >
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>My Labour Jobs</span>
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons: Cart, Notification, Dark Mode, Profile */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Supplies Cart */}
            <button
              onClick={onOpenCartDrawer}
              className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
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

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                className="relative p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifsCount > 0 && (
                  <span className="absolute 1.5 top-1.5 w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                )}
              </button>

              {notifDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 p-3 z-50">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100 dark:border-stone-800">
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">Alerts & Tips</span>
                    <span className="text-[10px] text-stone-400">{notifications.length} total</span>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
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
                        <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">{n.title}</h4>
                        <p className="text-[11px] text-stone-600 dark:text-stone-400 mt-0.5 leading-snug">{n.message}</p>
                        <span className="text-[10px] text-stone-400 mt-1 block">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Dark Mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-stone-600" />}
            </button>

            {/* User Profile Menu */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-all cursor-pointer"
                  aria-label="User profile menu"
                >
                  {hasCustomAvatar(user.avatar) ? (
                    <img
                      src={user.avatar!}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border border-emerald-500 bg-white"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                      {getUserInitials(user.name)}
                    </div>
                  )}
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200 hidden lg:inline max-w-[100px] truncate">
                    {user.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-stone-900 shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-2.5 mb-2">
                        {hasCustomAvatar(user.avatar) ? (
                          <img
                            src={user.avatar!}
                            alt={user.name}
                            className="w-9 h-9 rounded-full object-cover border border-emerald-500"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center border border-emerald-500/40 shrink-0">
                            {getUserInitials(user.name)}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-stone-900 dark:text-stone-100 truncate">{user.name}</p>
                          <p className="text-xs text-stone-500 truncate">{user.phone || user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded capitalize">
                          {user.role === 'farmer' ? '🌾 Farmer' : '🚜 Machine Owner'}
                        </span>
                        <span className="text-[10px] text-stone-400">• {user.villageOrDistrict || 'Local Village'}</span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => handleNav('settings')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center gap-2"
                      >
                        <span>My Profile & Settings</span>
                      </button>

                      <button
                        onClick={() => switchRole(user.role === 'farmer' ? 'owner' : 'farmer')}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center gap-2"
                      >
                        <span>Switch to {user.role === 'farmer' ? 'Owner Mode (Rent Out)' : 'Farmer Mode (Rent/Buy)'}</span>
                      </button>
                    </div>

                    <div className="border-t border-stone-100 dark:border-stone-800 pt-1">
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!user && (
              <button
                onClick={() => handleNav('home')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar: Exactly 5 touch-friendly big items */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border-t border-stone-200 dark:border-stone-800 py-1.5 px-2 flex items-center justify-around">
        <button
          onClick={() => handleNav('home')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] ${
            currentTab === 'home'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          onClick={() => handleNav('matching')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] ${
            currentTab === 'matching'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Tractor className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Machines</span>
        </button>

        <button
          onClick={() => handleNav('labour-jobs')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] relative ${
            ['labour-jobs', 'post-labour-job', 'my-labour-jobs'].includes(currentTab)
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Briefcase className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Labour</span>
          {openJobsCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
              {openJobsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => handleNav('bookings')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] ${
            currentTab === 'bookings'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <Layers className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Bookings</span>
        </button>

        <button
          onClick={() => handleNav('marketplace')}
          className={`flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] ${
            currentTab === 'marketplace'
              ? 'text-emerald-600 dark:text-emerald-400 font-bold'
              : 'text-stone-500 dark:text-stone-400'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Supplies</span>
        </button>

        <button
          onClick={openHelp}
          className="flex flex-col items-center justify-center p-1.5 rounded-xl min-w-[56px] text-stone-500 dark:text-stone-400"
        >
          <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[10px] mt-0.5">Help</span>
        </button>
      </nav>
    </header>
  );
};
