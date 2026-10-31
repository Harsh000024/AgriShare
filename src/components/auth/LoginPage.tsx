import React, { useState, useRef } from 'react';
import {
  Tractor,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Lock,
  User as UserIcon,
  MapPin,
  Check,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Upload,
  Trash2,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { hasCustomAvatar } from '../../utils/avatar';

export const LoginPage: React.FC = () => {
  const { login, signup, loginWithGoogle, isLoading, quickLoginAs } = useAuth();
  const { setCurrentTab } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [village, setVillage] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [acres, setAcres] = useState<number>(30);
  const [crop, setCrop] = useState<string>('Corn');
  const [profilePic, setProfilePic] = useState<string>(''); // Optional profile photo

  // Error & Feedback state
  const [error, setError] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Handle image upload from phone or computer
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Photo size should be less than 5MB.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePic(event.target.result as string);
          setError(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await login(loginIdentifier, loginPassword);
    if (!res.success) {
      setError(res.error || 'Could not log in. Please check your details.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await signup({
      name,
      phone,
      email: email || undefined,
      password,
      avatar: profilePic.trim() ? profilePic.trim() : undefined, // Only stores avatar if user chose one
      villageOrDistrict: village || 'My Village',
      role,
      acres,
      crop,
    });
    if (!res.success) {
      setError(res.error || 'Could not create account. Please check your details.');
    } else {
      setSuccessNotice('Account created! Welcome to AgriShare.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 flex flex-col justify-between py-4 sm:py-6 px-3 sm:px-6 lg:px-8 text-stone-900 dark:text-stone-100 transition-colors">
      {/* Top Clean Trust Bar (English only, no language switch) */}
      <div className="max-w-md w-full mx-auto flex items-center justify-center text-[11px] sm:text-xs text-stone-600 dark:text-stone-400 py-1">
        <div className="flex items-center gap-1.5 font-medium text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
          <span>Safe payments • Trusted sellers • 24/7 Field Support</span>
        </div>
      </div>

      {/* Main Centered Card */}
      <div className="max-w-md w-full mx-auto my-auto bg-white dark:bg-stone-900 rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-stone-200 dark:border-stone-800 p-4 sm:p-7 space-y-4 sm:space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1.5 sm:space-y-2">
          <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-md shadow-emerald-700/25">
            <Tractor className="w-7 h-7 sm:w-9 sm:h-9 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-stone-900 dark:text-stone-50">
            Agri<span className="text-emerald-600 dark:text-emerald-400">Share</span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300 max-w-xs mx-auto leading-relaxed">
            Rent what you need. Buy only what you must own.
          </p>
        </div>

        {/* Labourer Direct Access (No Login Required) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-green-100 dark:from-emerald-950/60 dark:to-stone-900 border border-emerald-300 dark:border-emerald-800 text-center space-y-2 shadow-2xs">
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Looking for Farm Work as a Labourer?</span>
          </div>
          <p className="text-[11px] text-stone-600 dark:text-stone-300">
            No login or password needed. Open the job list and apply directly with one tap.
          </p>
          <button
            type="button"
            onClick={() => setCurrentTab('labour-jobs')}
            className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <span>Open Labour Jobs Board (No Login)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Tab Switcher: Login vs Create Account */}
        <div className="grid grid-cols-2 p-1 rounded-xl sm:rounded-2xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setError(null);
            }}
            className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'login'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setError(null);
            }}
            className={`py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${activeTab === 'register'
                ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs'
                : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
          >
            Create Account
          </button>
        </div>

        {/* Error / Success Notice */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-medium">
            {error}
          </div>
        )}
        {successNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* Tab 1: Login Form */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 sm:space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
                Phone Number or Email
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute left-3 sm:left-3.5 top-3" />
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="e.g. 9876543210 or name@farm.com"
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute left-3 sm:left-3.5 top-3" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 sm:pl-11 pr-10 sm:pr-11 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] sm:min-h-[48px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm sm:text-base font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Logging in...</span>
              ) : (
                <>
                  <span>Login to AgriShare</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>

            {/* Google Sign In powered by Firebase */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-stone-900 text-stone-400">or</span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setError(null);
                const res = await loginWithGoogle();
                if (!res.success && res.error) {
                  setError(res.error);
                }
              }}
              disabled={isLoading}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.18 3.66-9.15z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.29 21.41 7.37 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.26C.46 8.2.01 9.99.01 12s.45 3.8 1.25 5.4l4.02-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.59 1.26 6.6l4.02 3.13c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Quick 1-Click Demo Profiles */}
            <div className="pt-2 sm:pt-3 border-t border-stone-100 dark:border-stone-800 space-y-2">
              <span className="text-[11px] sm:text-xs text-stone-500 block text-center font-medium">
                Or tap to try instant demo without typing:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => quickLoginAs('farmer', 'Ramesh Kumar')}
                  className="min-h-[40px] sm:min-h-[44px] py-2 px-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 text-xs font-bold hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🌾 Try as Farmer</span>
                </button>
                <button
                  type="button"
                  onClick={() => quickLoginAs('owner', 'Baljit Singh')}
                  className="min-h-[40px] sm:min-h-[44px] py-2 px-2.5 rounded-xl border border-blue-200 dark:border-blue-800/80 bg-blue-50/70 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🚜 Try as Owner</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* Tab 2: Create Account Form */
          <form onSubmit={handleRegisterSubmit} className="space-y-3 sm:space-y-4">
            {/* Optional Profile Picture Picker */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 flex items-center gap-3 sm:gap-4">
              <div className="relative shrink-0">
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile preview"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover border-2 border-emerald-500 shadow-xs bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-stone-200 dark:bg-stone-700/80 flex items-center justify-center text-stone-500 dark:text-stone-400 border border-dashed border-stone-300 dark:border-stone-600">
                    <UserIcon className="w-6 h-6 stroke-[1.8]" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <label className="block text-xs font-bold text-stone-800 dark:text-stone-200">
                  Profile Photo (Optional)
                </label>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">
                  {profilePic ? 'Custom photo selected' : 'Leave empty if you do not want a profile photo'}
                </p>

                <div className="flex items-center gap-2 mt-2">
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
                    className="px-2.5 sm:px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{profilePic ? 'Change Photo' : 'Choose Photo'}</span>
                  </button>

                  {profilePic && (
                    <button
                      type="button"
                      onClick={() => setProfilePic('')}
                      className="px-2 sm:px-2.5 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 text-stone-700 dark:text-stone-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Remove selected photo"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute left-3 sm:left-3.5 top-3" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute left-3 sm:left-3.5 top-3" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Village or Town
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute left-3 sm:left-3.5 top-3" />
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    placeholder="e.g. Morinda Village, Rupnagar"
                    className="w-full pl-9 sm:pl-11 pr-3 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 absolute left-3 sm:left-3.5 top-3" />
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full pl-9 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 text-sm sm:text-base rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                    className="absolute right-3 top-3 text-stone-400 cursor-pointer"
                  >
                    {showRegisterPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Role choice */}
            <div className="space-y-1.5 pt-0.5">
              <label className="block text-xs sm:text-sm font-bold text-stone-700 dark:text-stone-300">
                I am a:
              </label>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setRole('farmer')}
                  className={`w-full p-2.5 sm:p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${role === 'farmer'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-xl">🌾</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                      Farmer (I want to rent or buy)
                    </span>
                  </div>
                  {role === 'farmer' && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setRole('owner')}
                  className={`w-full p-2.5 sm:p-3.5 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${role === 'owner'
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-xl">🚜</span>
                    <span className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100">
                      Owner (I want to rent out my machines)
                    </span>
                  </div>
                  {role === 'owner' && <Check className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 shrink-0" />}
                </button>
              </div>
            </div>

            {role === 'farmer' && (
              <div className="grid grid-cols-2 gap-2.5 p-2.5 sm:p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-[11px] sm:text-xs">Your Land (Acres)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={acres}
                    onChange={(e) => setAcres(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-[11px] sm:text-xs">Main Crop</label>
                  <select
                    value={crop}
                    onChange={(e) => setCrop(e.target.value)}
                    className="w-full px-2 py-1.5 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs sm:text-sm font-medium"
                  >
                    <option value="Corn">Corn / Maize</option>
                    <option value="Wheat">Wheat</option>
                    <option value="Rice / Paddy">Rice / Paddy</option>
                    <option value="Cotton">Cotton</option>
                    <option value="Vegetables">Vegetables</option>
                  </select>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full min-h-[46px] sm:min-h-[48px] py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-sm sm:text-base font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Creating your account...</span>
              ) : (
                <>
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>

            {/* Google Quick Sign-Up */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white dark:bg-stone-900 text-stone-400">or sign up with</span>
              </div>
            </div>

            <button
              type="button"
              onClick={async () => {
                setError(null);
                const res = await loginWithGoogle();
                if (!res.success && res.error) {
                  setError(res.error);
                }
              }}
              disabled={isLoading}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm font-bold shadow-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.18 3.66-9.15z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.29 21.41 7.37 24 12 24z" />
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.6H1.26C.46 8.2.01 9.99.01 12s.45 3.8 1.25 5.4l4.02-3.13z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.59 1.26 6.6l4.02 3.13c.95-2.83 3.6-4.98 6.72-4.98z" />
              </svg>
              <span>Sign Up with Google</span>
            </button>
          </form>
        )}

        {/* Footer switch prompt */}
        <div className="pt-1 text-center text-xs text-stone-500 dark:text-stone-400">
          <button
            type="button"
            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
          >
            {activeTab === 'login' ? 'New to AgriShare? Tap Create Account' : 'Already have an account? Tap Login'}
          </button>
        </div>
      </div>

      {/* Forgot Password Simple Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-2xl p-5 sm:p-6 shadow-2xl border border-stone-200 dark:border-stone-800 space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
              Reset Your Password
            </h3>
            {forgotSent ? (
              <div className="space-y-3">
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  A reset code has been sent via SMS to <strong>{forgotPhone}</strong>. Use code <strong>123456</strong> to log in.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(false);
                    setForgotSent(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-stone-500">
                  Enter your registered phone number. We will send an SMS to help you log in.
                </p>
                <input
                  type="tel"
                  value={forgotPhone}
                  onChange={(e) => setForgotPhone(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 rounded-xl bg-stone-200 dark:bg-stone-700 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (forgotPhone) setForgotSent(true);
                    }}
                    className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                  >
                    Send SMS Code
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Trust Footer Bar */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 py-1">
        <p>Safe payments • Trusted machine owners • 24/7 Support</p>
      </div>
    </div>
  );
};
