import React, { useState, useRef } from 'react';
import { 
  Settings, 
  User as UserIcon, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Lock, 
  Bell, 
  MapPin, 
  Tractor, 
  Check, 
  Save,
  KeyRound,
  FileCheck,
  Camera,
  Upload,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { hasCustomAvatar, getUserInitials } from '../../utils/avatar';

export const SettingsView: React.FC = () => {
  const { isDarkMode, toggleDarkMode, textSize, toggleTextSize, currency, toggleCurrency } = useApp();
  const { user, updateProfile, switchRole } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatar, setAvatar] = useState(user?.avatar && hasCustomAvatar(user.avatar) ? user.avatar : '');
  const [acres, setAcres] = useState(user?.farmDetails?.acres || 45);
  const [soilType, setSoilType] = useState(user?.farmDetails?.soilType || 'Fertile Silt Loam');
  const [crops, setCrops] = useState(user?.farmDetails?.primaryCrops.join(', ') || 'Corn, Wheat');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [savedNotice, setSavedNotice] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      email,
      phone,
      location,
      avatar: hasCustomAvatar(avatar) ? avatar : '',
      farmDetails: user?.role === 'farmer' ? {
        acres: Number(acres),
        primaryCrops: crops.split(',').map(c => c.trim()),
        soilType,
        irrigationType: user?.farmDetails?.irrigationType || 'Canal & Tubewell',
      } : undefined,
    });

    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const hasPhoto = hasCustomAvatar(avatar);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 md:pb-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Settings className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Account & Farm Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Manage your personal profile, photo, farm details, and theme preferences
          </p>
        </div>

        {savedNotice && (
          <div className="bg-emerald-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
            <Check className="w-4 h-4" />
            <span>Settings Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Picture Card */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
            <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Profile Photo</span>
          </h2>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative shrink-0">
              {hasPhoto ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-emerald-500 shadow-md bg-white"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-2xl sm:text-3xl flex items-center justify-center border-4 border-dashed border-emerald-500/40">
                  {getUserInitials(name)}
                </div>
              )}
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100">
                {hasPhoto ? 'Custom Photo Uploaded' : 'No Profile Photo Set'}
              </h3>
              <p className="text-xs text-stone-500 max-w-md">
                {hasPhoto 
                  ? 'Your custom photo is displayed across the platform.' 
                  : 'Your account uses your initials badge. You can optionally upload a photo anytime, or keep it unset.'}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{hasPhoto ? 'Change Photo' : 'Upload Photo'}</span>
                </button>

                {hasPhoto && (
                  <button
                    type="button"
                    onClick={() => setAvatar('')}
                    className="px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    <span>Remove Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Currency & Appearance Configuration */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
            {isDarkMode ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
            <span>Currency & Display Settings</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Currency info */}
            <div className="p-4 rounded-2xl border border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40">
              <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 block">Active Currency</span>
              <span className="text-lg font-extrabold font-mono text-stone-900 dark:text-stone-100 block mt-1">
                ₹ Indian Rupees
              </span>
              <span className="text-[11px] text-stone-500 mt-1 block">All machine rentals and supplies priced in ₹</span>
            </div>

            {/* Light Mode */}
            <button
              type="button"
              onClick={() => { if (isDarkMode) toggleDarkMode(); }}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                !isDarkMode
                  ? 'border-emerald-500 bg-stone-50 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sun className="w-5 h-5 text-amber-500" />
                <div>
                  <span className="text-xs font-bold block text-stone-900">Light Mode</span>
                  <span className="text-[11px] text-stone-500">Daylight viewing</span>
                </div>
              </div>
              {!isDarkMode && <Check className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => { if (!isDarkMode) toggleDarkMode(); }}
              className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                isDarkMode
                  ? 'border-emerald-500 bg-stone-800/80 ring-2 ring-emerald-500/20'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-emerald-400" />
                <div>
                  <span className="text-xs font-bold block text-stone-100">Dark Mode</span>
                  <span className="text-[11px] text-stone-400">Night shift</span>
                </div>
              </div>
              {isDarkMode && <Check className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Identity & Profile Inputs */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Farmer Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Village or Town</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Farm & Land Configuration */}
        {user?.role === 'farmer' && (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <Tractor className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Farm Land Details</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Total Land (Acres)</label>
                <input
                  type="number"
                  value={acres}
                  onChange={(e) => setAcres(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Soil Type</label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Main Crops</label>
                <input
                  type="text"
                  value={crops}
                  onChange={(e) => setCrops(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="min-h-[48px] px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
