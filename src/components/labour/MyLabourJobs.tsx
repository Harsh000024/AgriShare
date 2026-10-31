import React, { useState } from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Plus, 
  ArrowLeft,
  AlertCircle,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { LabourJob } from '../../types';

export const MyLabourJobs: React.FC = () => {
  const { labourJobs, updateApplicantStatus, closeJob, reopenJob, deleteJob, setCurrentTab } = useApp();
  const { user } = useAuth();

  const [expandedJobId, setExpandedJobId] = useState<string | null>(null);

  // Filter jobs for current logged in farmer (or fallback demo jobs if id matches or user is farmer)
  const myJobs = labourJobs.filter(
    (j) => j.farmerId === (user?.id || 'farmer-current') || j.farmerId === 'farmer-1'
  );

  const toggleExpand = (jobId: string) => {
    setExpandedJobId((prev) => (prev === jobId ? null : jobId));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header with Back & Post Job CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              My Posted Labour Jobs
            </h1>
            <p className="text-xs sm:text-sm text-stone-500">
              Review applicant requests, accept workers, and manage job statuses.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('post-labour-job')}
          className="px-4 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Jobs List */}
      {myJobs.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl space-y-4">
          <Briefcase className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-base font-bold text-stone-800 dark:text-stone-200">No labour jobs posted yet</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Post your harvesting, sowing, or weeding work to connect with local labourers quickly.
            </p>
          </div>
          <button
            onClick={() => setCurrentTab('post-labour-job')}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
          >
            Post Your First Job
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {myJobs.map((job) => {
            const isExpanded = expandedJobId === job.id;
            const spotsRemaining = Math.max(0, job.labourersNeeded - job.spotsFilled);

            return (
              <div
                key={job.id}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl sm:rounded-3xl p-5 shadow-xs space-y-4 transition-all"
              >
                {/* Job Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        {job.workType}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        job.status === 'Open'
                          ? 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
                          : job.status === 'Filled'
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          : 'bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}>
                        {job.status}
                      </span>
                      <span className="text-xs text-stone-400">Posted on {job.postedAt}</span>
                    </div>

                    <h3 className="text-lg font-black text-stone-900 dark:text-stone-100">
                      {job.crop} ({job.totalDays} {job.totalDays === 1 ? 'day' : 'days'} work)
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 dark:text-stone-400">
                      <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400 font-mono">
                        ₹{job.payPerDay} / day
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <span><strong>{job.spotsFilled}</strong> of <strong>{job.labourersNeeded}</strong> spots filled</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{job.village}, {job.district}</span>
                      </span>
                    </div>
                  </div>

                  {/* Actions: Close/Reopen, Delete, Expand Applicants */}
                  <div className="flex items-center gap-2 shrink-0">
                    {job.status === 'Open' ? (
                      <button
                        onClick={() => closeJob(job.id)}
                        className="px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Close this job posting"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Close Job</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => reopenJob(job.id)}
                        className="px-3 py-1.5 rounded-xl border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-xs font-bold flex items-center gap-1 cursor-pointer"
                        title="Reopen job"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Reopen</span>
                      </button>
                    )}

                    <button
                      onClick={() => toggleExpand(job.id)}
                      className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{job.applicants.length} Applicants</span>
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      job.status === 'Filled' ? 'bg-amber-500' : 'bg-emerald-600'
                    }`}
                    style={{ width: `${Math.min(100, Math.round((job.spotsFilled / job.labourersNeeded) * 100))}%` }}
                  />
                </div>

                {/* Applicants List (Collapsible/Always clear) */}
                <div className="pt-2 border-t border-stone-100 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider flex items-center gap-1.5">
                      <span>Labour Applicants ({job.applicants.length})</span>
                    </h4>
                    <span className="text-[11px] text-stone-400">
                      {spotsRemaining > 0 ? `${spotsRemaining} more spots available` : 'All spots filled'}
                    </span>
                  </div>

                  {job.applicants.length === 0 ? (
                    <p className="text-xs text-stone-500 italic py-2">
                      No applications yet. Labourers in your district can see this job on the board.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {job.applicants.map((applicant) => (
                        <div
                          key={applicant.id}
                          className="p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-sm text-stone-900 dark:text-stone-100">
                                {applicant.name}
                              </span>
                              <span className={`px-2 py-0.2 rounded-md text-[10px] font-bold ${
                                applicant.status === 'accepted'
                                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                  : applicant.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                                  : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                              }`}>
                                {applicant.status === 'accepted' ? 'Accepted' : applicant.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                              </span>
                            </div>

                            <p className="text-xs text-stone-500 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                              <span>From {applicant.village} • Applied: {applicant.appliedAt}</span>
                            </p>
                          </div>

                          {/* Contact & Decision Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={`tel:${applicant.phone}`}
                              className="px-3 py-1.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 hover:bg-stone-50 text-stone-800 dark:text-stone-200 text-xs font-bold flex items-center gap-1.5"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{applicant.phone}</span>
                            </a>

                            {applicant.status !== 'accepted' && (
                              <button
                                onClick={() => updateApplicantStatus(job.id, applicant.id, 'accepted')}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                                title="Accept this labourer"
                              >
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>Accept</span>
                              </button>
                            )}

                            {applicant.status !== 'rejected' && (
                              <button
                                onClick={() => updateApplicantStatus(job.id, applicant.id, 'rejected')}
                                className="px-3 py-1.5 rounded-xl border border-rose-300 dark:border-rose-800 hover:bg-rose-50 dark:hover:bg-rose-950 text-rose-700 dark:text-rose-300 text-xs font-bold flex items-center gap-1 cursor-pointer"
                                title="Reject this applicant"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Decline</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
