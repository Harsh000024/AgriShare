import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Calendar, 
  Users, 
  Phone, 
  CheckCircle2, 
  Search, 
  X, 
  Check, 
  AlertCircle,
  Utensils,
  Truck,
  Droplets,
  Home as HomeIcon,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { LabourJob, LabourWorkType } from '../../types';
import confetti from 'canvas-confetti';

export const LabourJobsPage: React.FC = () => {
  const { labourJobs, applyToJob } = useApp();
  const { user } = useAuth();

  // Simple filter state
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Application Modal state
  const [selectedJobForApply, setSelectedJobForApply] = useState<LabourJob | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [applicantPhone, setApplicantPhone] = useState('');
  const [applicantVillage, setApplicantVillage] = useState('');
  const [applyError, setApplyError] = useState<string | null>(null);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter jobs simply
  const filteredJobs = useMemo(() => {
    return labourJobs.filter((job) => {
      if (selectedType !== 'All' && job.workType !== selectedType) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          job.crop.toLowerCase().includes(q) ||
          job.workType.toLowerCase().includes(q) ||
          job.village.toLowerCase().includes(q) ||
          job.district.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      // Open jobs first
      const aOpen = a.status === 'Open' ? 0 : 1;
      const bOpen = b.status === 'Open' ? 0 : 1;
      if (aOpen !== bOpen) return aOpen - bOpen;
      return a.distanceKm - b.distanceKm;
    });
  }, [labourJobs, selectedType, searchQuery]);

  // Open apply modal
  const handleOpenApply = (job: LabourJob) => {
    setSelectedJobForApply(job);
    setApplicantName(user?.name || '');
    setApplicantPhone(user?.phone || '');
    setApplicantVillage(user?.villageOrDistrict || '');
    setApplyError(null);
    setApplySuccess(null);
  };

  // Submit application
  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    setApplyError(null);

    if (!applicantName.trim()) {
      setApplyError('Please enter your full name.');
      return;
    }

    const cleanPhone = applicantPhone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setApplyError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!applicantVillage.trim()) {
      setApplyError('Please enter your village name.');
      return;
    }

    if (!selectedJobForApply) return;

    setIsSubmitting(true);
    const result = applyToJob(selectedJobForApply.id, {
      name: applicantName,
      phone: applicantPhone,
      village: applicantVillage
    });
    setIsSubmitting(false);

    if (!result.success) {
      setApplyError(result.message);
    } else {
      setApplySuccess(result.message);
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      } catch {}
    }
  };

  const workTypes = ['All', 'Harvesting', 'Sowing / Planting', 'Weeding', 'Spraying', 'Irrigation', 'Loading / Unloading'];

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-16">
      {/* 1. Simple Clean Header */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
              <Briefcase className="w-5 h-5" />
            </span>
            <span>Farm Labour Required</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            List of daily farm work. No login or account needed. Call the farmer directly or apply with your name and phone.
          </p>
        </div>

        {/* Clean Live Count Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold shrink-0 self-start sm:self-auto">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>{filteredJobs.filter(j => j.status === 'Open').length} Jobs Available</span>
        </div>
      </div>

      {/* 2. Simple Filter & Search Bar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by crop or village (e.g. Wheat, Morinda)..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {workTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  selectedType === type
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Simple List of Jobs (Straightforward and legible) */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <div className="p-8 text-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl">
            <p className="text-sm font-bold text-stone-700 dark:text-stone-300">No jobs match your search.</p>
            <button
              onClick={() => { setSelectedType('All'); setSearchQuery(''); }}
              className="mt-2 text-xs text-emerald-600 dark:text-emerald-400 font-bold underline cursor-pointer"
            >
              Show all jobs
            </button>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isFilled = job.status === 'Filled' || job.spotsFilled >= job.labourersNeeded;
            const spotsRemaining = Math.max(0, job.labourersNeeded - job.spotsFilled);

            return (
              <div
                key={job.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  isFilled
                    ? 'bg-stone-100/60 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800 opacity-75'
                    : 'bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-xs hover:border-emerald-300 dark:hover:border-emerald-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Work details & Required labourers */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Big clear count of labourers required */}
                      <span className="px-2.5 py-1 rounded-lg text-xs font-black bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                        👥 {job.labourersNeeded} Labourers Required
                      </span>

                      {/* Work Type & Crop */}
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-stone-100 text-stone-800 dark:bg-stone-800 dark:text-stone-200">
                        {job.workType} • {job.crop}
                      </span>

                      {isFilled && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          Spots Full
                        </span>
                      )}
                    </div>

                    {/* Location & Farmer info */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 dark:text-stone-300 pt-0.5">
                      <span className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                        <span>{job.village}, {job.district} ({job.distanceKm} km away)</span>
                      </span>
                      {job.landmark && (
                        <span className="text-stone-400">({job.landmark})</span>
                      )}
                      <span>•</span>
                      <span>Farmer: <strong>{job.farmerName}</strong></span>
                    </div>

                    {/* Start date & Facilities */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>Starts: <strong className="text-stone-700 dark:text-stone-200">{job.startDate}</strong> ({job.totalDays} {job.totalDays === 1 ? 'day' : 'days'})</span>
                      </span>

                      {/* Facilities provided */}
                      <div className="flex items-center gap-2 text-[11px] text-stone-600 dark:text-stone-300">
                        {job.foodProvided && <span title="Food provided">🍽️ Food</span>}
                        {job.transportProvided && <span title="Transport provided">🚗 Transport</span>}
                        {job.drinkingWater && <span title="Drinking water provided">💧 Water</span>}
                        {job.shelterProvided && <span title="Rest area provided">🏠 Shelter</span>}
                      </div>
                    </div>

                    {job.extraDetails && (
                      <p className="text-xs text-stone-600 dark:text-stone-400 italic pt-1">
                        Note: {job.extraDetails}
                      </p>
                    )}
                  </div>

                  {/* Right: Daily Pay & Big Action Buttons */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 pt-3 sm:pt-0 border-t sm:border-t-0 border-stone-100 dark:border-stone-800 shrink-0">
                    <div className="text-left sm:text-right">
                      <span className="text-xs text-stone-400 block">Daily Pay</span>
                      <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                        ₹{job.payPerDay}
                        <span className="text-xs font-normal text-stone-500"> / day</span>
                      </span>
                      <span className="text-[11px] text-stone-500 block">
                        ({spotsRemaining} spots still open)
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${job.farmerPhone}`}
                        className="min-h-[44px] px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
                        title={`Call ${job.farmerName}`}
                      >
                        <Phone className="w-4 h-4 text-emerald-600" />
                        <span>Call</span>
                      </a>

                      <button
                        onClick={() => handleOpenApply(job)}
                        disabled={isFilled}
                        className={`min-h-[44px] px-4 py-2 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                          isFilled
                            ? 'bg-stone-200 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95'
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isFilled ? 'Full' : 'Apply'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 4. Simple Quick Apply Modal (No Account Required) */}
      {selectedJobForApply && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 max-w-md w-full shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Direct Application (No Login)
                </span>
                <h3 className="text-lg font-black text-stone-900 dark:text-stone-100 mt-0.5">
                  Apply for {selectedJobForApply.workType} ({selectedJobForApply.crop})
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedJobForApply.village} • ₹{selectedJobForApply.payPerDay}/day • Farmer: {selectedJobForApply.farmerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedJobForApply(null)}
                className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {applySuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-black text-stone-900 dark:text-stone-100">
                  Application Sent!
                </h4>
                <p className="text-xs text-stone-600 dark:text-stone-300">
                  {applySuccess}
                </p>
                <div className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 text-xs text-stone-600 dark:text-stone-300">
                  Or call farmer directly: <a href={`tel:${selectedJobForApply.farmerPhone}`} className="font-bold text-emerald-600 underline ml-1">{selectedJobForApply.farmerPhone}</a>
                </div>
                <button
                  onClick={() => setSelectedJobForApply(null)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs sm:text-sm cursor-pointer hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-3">
                {applyError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{applyError}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Your Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantName}
                    onChange={(e) => setApplicantName(e.target.value)}
                    placeholder="e.g. Gurmukh Singh"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Mobile Number (Farmer will call you) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={applicantPhone}
                    onChange={(e) => setApplicantPhone(e.target.value)}
                    placeholder="e.g. 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Your Village Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={applicantVillage}
                    onChange={(e) => setApplicantVillage(e.target.value)}
                    placeholder="e.g. Morinda"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Application'}</span>
                  </button>
                  <p className="text-[10px] text-stone-400 text-center mt-1.5">
                    No sign-up or fee required.
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
