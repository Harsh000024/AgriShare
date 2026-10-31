import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ShieldCheck, 
  Tractor, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowRight,
  Sparkles,
  Phone,
  MapPin
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, signup, isLoading, quickLoginAs } = useAuth();
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [showPassword, setShowPassword] = useState(false);

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [acres, setAcres] = useState<number>(35);
  const [primaryCrop, setPrimaryCrop] = useState('Corn / Maize');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMsg('Authentication successful! Welcome to AgriShare.');
        setTimeout(() => onClose(), 600);
      } else {
        setError(res.error || 'Invalid credentials. Please try again.');
      }
    } else {
      if (!name) {
        setError('Please enter your full name.');
        return;
      }
      const res = await signup({
        name,
        email,
        password,
        phone: phone || '+91 98765 43210',
        villageOrDistrict: location || 'Morinda Village, Rupnagar',
        role,
        acres,
        crop: primaryCrop,
      });

      if (res.success) {
        setSuccessMsg('Account created and verified! Connecting to regional network...');
        setTimeout(() => onClose(), 600);
      } else {
        setError(res.error || 'Could not create account');
      }
    }
  };

  const handleDemoSelect = (demoRole: UserRole) => {
    quickLoginAs(demoRole);
    setSuccessMsg(`Logged in as verified ${demoRole.toUpperCase()} demo account!`);
    setTimeout(() => onClose(), 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-stone-900 dark:text-stone-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Security Badge */}
        <div className="bg-gradient-to-r from-emerald-800 to-green-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-xs border border-white/20">
              <Tractor className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isLogin ? 'Sign In to AgriShare' : 'Create Verified AgriShare Account'}
              </h3>
              <div className="flex items-center space-x-1.5 text-xs text-emerald-200/90">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                <span>Encrypted Agronomic Identity & Escrow Security</span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Quick Demo Selector for fast evaluation */}
          <div className="bg-stone-50 dark:bg-stone-800/60 p-3.5 rounded-xl border border-stone-200 dark:border-stone-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                Instant 1-Click Demo Profiles:
              </span>
              <span className="text-[11px] text-stone-400">Click to switch role</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => handleDemoSelect('farmer')}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 hover:border-emerald-500 font-medium text-left truncate flex items-center gap-1.5 hover:shadow-xs transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>🌾 Farmer</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('owner')}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 hover:border-emerald-500 font-medium text-left truncate flex items-center gap-1.5 hover:shadow-xs transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>🚜 Owner</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('operator')}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 hover:border-emerald-500 font-medium text-left truncate flex items-center gap-1.5 hover:shadow-xs transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                <span>🚁 Operator</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('seller')}
                className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 hover:border-emerald-500 font-medium text-left truncate flex items-center gap-1.5 hover:shadow-xs transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>📦 Agri Supplier</span>
              </button>
              <button
                type="button"
                onClick={() => handleDemoSelect('cooperative')}
                className="col-span-2 sm:col-span-2 px-2.5 py-1.5 rounded-lg bg-white dark:bg-stone-700 border border-stone-300 dark:border-stone-600 hover:border-emerald-500 font-medium text-left truncate flex items-center gap-1.5 hover:shadow-xs transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                <span>🏛️ Cooperative Admin</span>
              </button>
            </div>
          </div>

          {/* Error / Success Feedback */}
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Picker */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                Primary Account Purpose / Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { r: 'farmer', title: 'Farmer', desc: 'Rent machinery & buy supplies' },
                  { r: 'owner', title: 'Equipment Owner', desc: 'List fleet & monetize idle hours' },
                  { r: 'operator', title: 'Machine Operator', desc: 'Provide agricultural field labor & operations' },
                  { r: 'cooperative', title: 'Coop Admin', desc: 'Manage regional equipment demand' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.r}
                    onClick={() => setRole(item.r as UserRole)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      role === item.r
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 ring-1 ring-emerald-500'
                        : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-stone-900 dark:text-stone-100">{item.title}</span>
                      {role === item.r && <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                    </div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-0.5 leading-snug">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Full Name / Farm Business Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Arthur Pendelton"
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Location / District
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Morinda Village, Rupnagar"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {role === 'farmer' && (
                  <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-stone-50 dark:bg-stone-800/40 border border-stone-200 dark:border-stone-700">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Cultivated Acres
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="5000"
                        value={acres}
                        onChange={(e) => setAcres(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Primary Crop
                      </label>
                      <select
                        value={primaryCrop}
                        onChange={(e) => setPrimaryCrop(e.target.value)}
                        className="w-full px-2 py-1.5 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                      >
                        <option value="Corn / Maize">Corn / Maize</option>
                        <option value="Wheat / Barley">Wheat / Barley</option>
                        <option value="Soybeans & Legumes">Soybeans & Legumes</option>
                        <option value="Paddy / Rice">Paddy / Rice</option>
                        <option value="Vegetables / Orchard">Vegetables / Orchard</option>
                      </select>
                    </div>
                  </div>
                )}
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@agrishare.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Password
                </label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('arthur.farmer@agrishare.com');
                      setPassword('demo1234');
                    }}
                    className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:underline"
                  >
                    Auto-fill demo credentials
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 text-xs rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating with Secure Agronomic Network...</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In & Access Platform' : 'Create Verified AgriShare Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle between Login and Signup */}
          <div className="pt-2 text-center text-xs text-stone-500 dark:text-stone-400 border-t border-stone-100 dark:border-stone-800">
            {isLogin ? (
              <span>
                Don't have an AgriShare account yet?{' '}
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError(null);
                  }}
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Register here
                </button>
              </span>
            ) : (
              <span>
                Already have an AgriShare account?{' '}
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError(null);
                  }}
                  className="font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
