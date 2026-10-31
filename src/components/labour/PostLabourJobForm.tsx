import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Users, 
  IndianRupee, 
  Phone, 
  Utensils, 
  Truck, 
  Droplets, 
  Home as HomeIcon, 
  CheckCircle2, 
  ArrowLeft,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { LabourWorkType } from '../../types';
import confetti from 'canvas-confetti';

export const PostLabourJobForm: React.FC = () => {
  const { postLabourJob, setCurrentTab } = useApp();
  const { user } = useAuth();

  // Form Fields
  const [workType, setWorkType] = useState<LabourWorkType>('Harvesting');
  const [crop, setCrop] = useState<string>('Wheat');
  const [labourersNeeded, setLabourersNeeded] = useState<number>(5);
  const [payPerDay, setPayPerDay] = useState<number>(600);
  const [totalDays, setTotalDays] = useState<number>(3);
  const [startDate, setStartDate] = useState<string>('2026-11-04');
  
  // Location
  const [village, setVillage] = useState<string>(user?.villageOrDistrict || 'Morinda');
  const [district, setDistrict] = useState<string>('Rupnagar');
  const [landmark, setLandmark] = useState<string>('Near Primary Cooperative Society');
  const [farmerPhone, setFarmerPhone] = useState<string>(user?.phone || '+91 98765 43210');

  // Facilities
  const [foodProvided, setFoodProvided] = useState<boolean>(true);
  const [transportProvided, setTransportProvided] = useState<boolean>(false);
  const [drinkingWater, setDrinkingWater] = useState<boolean>(true);
  const [shelterProvided, setShelterProvided] = useState<boolean>(false);

  // Extra Details
  const [extraDetails, setExtraDetails] = useState<string>('');

  // Status
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const cropOptions = [
    'Wheat',
    'Paddy / Rice',
    'Corn / Maize',
    'Cotton',
    'Sugarcane',
    'Mustard & Fodder',
    'Potato',
    'Vegetables & Garlic',
    'Soybeans & Pulses',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (labourersNeeded < 1) {
      setError('Please specify at least 1 labourer needed.');
      return;
    }
    if (payPerDay < 100) {
      setError('Please enter a fair daily pay rate (at least ₹100/day).');
      return;
    }
    if (!village.trim()) {
      setError('Village name is required.');
      return;
    }
    if (!farmerPhone.trim()) {
      setError('Contact phone number is required so labourers can reach you.');
      return;
    }

    postLabourJob({
      farmerId: user?.id || 'farmer-current',
      farmerName: user?.name || 'Local Farmer',
      farmerPhone: farmerPhone.trim(),
      farmerRating: 4.9,
      isVerifiedFarmer: true,
      workType,
      crop,
      labourersNeeded: Number(labourersNeeded),
      payPerDay: Number(payPerDay),
      totalDays: Number(totalDays),
      startDate,
      village: village.trim(),
      district: district.trim(),
      landmark: landmark.trim() || undefined,
      distanceKm: 2.5,
      foodProvided,
      transportProvided,
      drinkingWater,
      shelterProvided,
      extraDetails: extraDetails.trim() || undefined
    });

    setIsSuccess(true);
    try {
      confetti({ particleCount: 75, spread: 65, origin: { y: 0.6 } });
    } catch {}
  };

  if (isSuccess) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-8 text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              Job Posted Successfully
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100">
              Your Labour Job is Live!
            </h2>
            <p className="text-sm text-stone-600 dark:text-stone-300 max-w-md mx-auto">
              Labourers nearby can now view your post and apply with one tap. You will receive in-app notifications whenever someone applies.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-left space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span className="text-stone-500">Work:</span>
              <strong className="text-stone-900 dark:text-stone-100">{workType} ({crop})</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Labourers Needed:</span>
              <strong className="text-stone-900 dark:text-stone-100">{labourersNeeded} Workers</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Daily Pay:</span>
              <strong className="text-emerald-700 dark:text-emerald-400">₹{payPerDay} / day ({totalDays} days)</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-500">Location:</span>
              <strong className="text-stone-900 dark:text-stone-100">{village}, {district}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => setCurrentTab('my-labour-jobs')}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
            >
              View My Posted Jobs & Applicants
            </button>
            <button
              onClick={() => setCurrentTab('labour-jobs')}
              className="w-full py-3 rounded-2xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm transition-all cursor-pointer"
            >
              Browse Public Job Board
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Bar with Back Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentTab('labour-jobs')}
          className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-all cursor-pointer"
          title="Back to Labour Jobs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100">
            Post a Labour Job
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            Reach local labourers in your area quickly. Simple form, zero charges.
          </p>
        </div>
      </div>

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Work & Crop Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            <span>Work Details</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Type of Work <span className="text-rose-500">*</span>
              </label>
              <select
                value={workType}
                onChange={(e) => setWorkType(e.target.value as LabourWorkType)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Harvesting">Harvesting (Sickle / Hand picking)</option>
                <option value="Sowing / Planting">Sowing / Planting</option>
                <option value="Weeding">Weeding (Khurpa / Manual)</option>
                <option value="Spraying">Spraying (Pesticide / Foliar assist)</option>
                <option value="Irrigation">Irrigation / Dike Management</option>
                <option value="Loading / Unloading">Loading / Unloading (Bags / Bales)</option>
                <option value="Other">Other Field Work</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Crop <span className="text-rose-500">*</span>
              </label>
              <select
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                {cropOptions.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 2. Workers & Pay Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
            <Users className="w-4 h-4 text-emerald-600" />
            <span>Labourers Needed & Pay</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Number of Labourers <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="100"
                required
                value={labourersNeeded}
                onChange={(e) => setLabourersNeeded(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Pay per Day in ₹ <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold">₹</span>
                <input
                  type="number"
                  min="200"
                  step="50"
                  required
                  value={payPerDay}
                  onChange={(e) => setPayPerDay(Math.max(100, parseInt(e.target.value) || 100))}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Number of Days <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="60"
                required
                value={totalDays}
                onChange={(e) => setTotalDays(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full sm:w-64 px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 3. Location & Contact Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 border-b border-stone-100 dark:border-stone-800 pb-2">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Farm Location & Contact</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Village Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="e.g. Morinda"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                District <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="e.g. Rupnagar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={farmerPhone}
                onChange={(e) => setFarmerPhone(e.target.value)}
                placeholder="e.g. +91 98765 11082"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
              Landmark or Meeting Spot (Optional)
            </label>
            <input
              type="text"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="e.g. Near Gurdwara Kotwali Sahib or Plot 4 Gate"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* 4. Facilities Provided */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
            Facilities Provided for Labourers (Check all that apply)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
              foodProvided
                ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
            }`}>
              <input
                type="checkbox"
                checked={foodProvided}
                onChange={(e) => setFoodProvided(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
                <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Food Provided</span>
              </div>
            </label>

            <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
              transportProvided
                ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
            }`}>
              <input
                type="checkbox"
                checked={transportProvided}
                onChange={(e) => setTransportProvided(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
                <Truck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Transport</span>
              </div>
            </label>

            <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
              drinkingWater
                ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-300 dark:border-cyan-700'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
            }`}>
              <input
                type="checkbox"
                checked={drinkingWater}
                onChange={(e) => setDrinkingWater(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
                <Droplets className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Drinking Water</span>
              </div>
            </label>

            <label className={`p-3 rounded-2xl border flex items-center gap-2.5 cursor-pointer transition-all ${
              shelterProvided
                ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-300 dark:border-purple-700'
                : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700'
            }`}>
              <input
                type="checkbox"
                checked={shelterProvided}
                onChange={(e) => setShelterProvided(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200">
                <HomeIcon className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Shelter / Rest Area</span>
              </div>
            </label>
          </div>
        </div>

        {/* 5. Extra Instructions */}
        <div>
          <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
            Extra Details or Instructions (Optional)
          </label>
          <textarea
            rows={2}
            value={extraDetails}
            onChange={(e) => setExtraDetails(e.target.value)}
            placeholder="e.g. Bring your own sickle; lunch and morning tea will be served at 12 PM."
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 border-t border-stone-100 dark:border-stone-800">
          <button
            type="submit"
            className="w-full min-h-[52px] py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-black text-base shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
          >
            <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
            <span>Publish Labour Job Now</span>
          </button>
        </div>
      </form>
    </div>
  );
};
