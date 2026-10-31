import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  MapPin,
  AlertTriangle,
  Calendar,
  Sparkles,
  Tractor,
  ArrowRight,
  CheckCircle2,
  ShieldAlert,
  Layers,
  Flame
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DemandPredictionView: React.FC = () => {
  const { forecasts, setCurrentTab } = useApp();
  const [selectedRegion, setSelectedRegion] = useState<string>(forecasts[0]?.region || 'Morinda & Rupnagar Cluster');
  const [rebalanceInitiated, setRebalanceInitiated] = useState(false);

  const activeForecast = forecasts.find(f => f.region === selectedRegion) || forecasts[0];

  const handleRebalanceDispatch = () => {
    setRebalanceInitiated(true);
    setTimeout(() => setRebalanceInitiated(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm border border-stone-800 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Expected Demand</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            See Upcoming Machine Demand in Your Area
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            Harvest dates and rainfall patterns cause demand spikes. Machine owners can prepare their tractors,
            and farmers can book early to get discounted rates.
          </p>
        </div>
      </div>

      {/* Early-Bird Farmer Incentive Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider">
              Farmer Early-Bird Booking Window Active
            </h4>
            <p className="text-xs text-amber-800 dark:text-amber-300/80 mt-0.5">
              Lock in your combine harvester 10 days before harvest to avoid 15% peak demand surge pricing and guarantee operator assignment.
            </p>
          </div>
        </div>

        <button
          onClick={() => setCurrentTab('matching')}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 self-start sm:self-center"
        >
          <span>Reserve Machinery Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Regional Forecast Heatmap Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecasts.map((f) => {
          const isSelected = selectedRegion === f.region;
          const isSurge = f.predictedDemandLevel === 'Very High' || f.predictedDemandLevel === 'High';

          return (
            <div
              key={f.region}
              onClick={() => setSelectedRegion(f.region)}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${isSelected
                  ? 'border-emerald-500 bg-white dark:bg-stone-900 shadow-md ring-2 ring-emerald-500/20'
                  : 'border-stone-200 dark:border-stone-800 bg-white/70 dark:bg-stone-900/60 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">
                  {f.region}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase font-mono ${f.predictedDemandLevel === 'Very High'
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : f.predictedDemandLevel === 'High'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  }`}>
                  {f.predictedDemandLevel}
                </span>
              </div>

              <div className="space-y-1 text-xs text-stone-500">
                <div>
                  <strong className="text-stone-700 dark:text-stone-300">Target:</strong> {f.equipmentType}
                </div>
                <div className="truncate">
                  <strong className="text-stone-700 dark:text-stone-300">Crops:</strong> {f.cropFocus}
                </div>
              </div>

              {/* Deficit badge */}
              <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
                <span className="text-stone-400">Regional Deficit:</span>
                <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                  -{f.activeMachineryDeficit} units
                </span>
              </div>

              <div className="mt-2 flex items-center justify-between text-xs font-mono">
                <span className="text-stone-400">Fleet Utilization:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {f.utilizationRateCurrent}%
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detailed Regional Rebalancing Action Card */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 dark:border-stone-800 gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-stone-400 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>Deep Analysis: {activeForecast.region}</span>
            </div>
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              Peak Window: {activeForecast.peakDemandDateRange}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500">AI Suggested Price:</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 font-mono font-bold text-emerald-700 dark:text-emerald-300 text-xs border border-emerald-200 dark:border-emerald-800">
              {activeForecast.recommendedPriceAdjustment}
            </span>
          </div>
        </div>

        {/* AI Action Advice */}
        <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider">
                Automated Regional Fleet Rebalancing Recommendation
              </h4>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 leading-relaxed max-w-2xl">
                {activeForecast.actionAdvice}
              </p>
            </div>
          </div>

          {rebalanceInitiated ? (
            <div className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
              <span>Fleet Rebalance Dispatched</span>
            </div>
          ) : (
            <button
              onClick={handleRebalanceDispatch}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <Tractor className="w-4 h-4" />
              <span>Authorize Pre-Emptive Mobilization</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
