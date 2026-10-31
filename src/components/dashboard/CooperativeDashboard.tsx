import React, { useState } from 'react';
import { 
  Building2, 
  BarChart3, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Tractor, 
  ShoppingBag, 
  Users, 
  ShieldCheck, 
  MapPin, 
  ArrowRight,
  Flame,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CooperativeDashboard: React.FC = () => {
  const { equipmentList, forecasts, setCurrentTab } = useApp();
  const [rebalanceAlertSent, setRebalanceAlertSent] = useState<string | null>(null);

  const totalMachines = equipmentList.length;
  const avgHealth = Math.round(equipmentList.reduce((acc, eq) => acc + eq.healthScore, 0) / totalMachines);

  const handleSendRebalanceAlert = (region: string) => {
    setRebalanceAlertSent(region);
    setTimeout(() => setRebalanceAlertSent(null), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Cooperative Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-stone-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-semibold mb-3">
            <Building2 className="w-3.5 h-3.5" />
            <span>Regional Agricultural Union Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Cooperative & Admin Control Center
          </h1>
          <p className="text-sm text-stone-300 mt-2 leading-relaxed">
            Monitor shared machinery saturation, detect underserved crop clusters, rebalance fleet capacity across 
            neighboring valleys, and oversee marketplace transaction volume.
          </p>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Coop Fleet Size</span>
            <Tractor className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
            {totalMachines * 6} <span className="text-xs font-normal text-stone-400">units</span>
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            ● 88% active in field
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Fleet Utilization Rate</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-purple-600 dark:text-purple-400">
            87.4%
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            +32% vs unpooled individual ownership
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Avg Machinery Health</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 dark:text-stone-100">
            {avgHealth} <span className="text-xs font-normal text-stone-400">/ 100</span>
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Audited via automated CANbus logs
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>Marketplace Volume (GMV)</span>
            <ShoppingBag className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-lg sm:text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400 truncate">
            ₹1,24,80,000
          </div>
          <div className="text-[11px] text-stone-500 mt-1">
            Seeds, inputs & bio-protection
          </div>
        </div>
      </div>

      {/* Underserved Agricultural Resource Clusters Table */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div>
            <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Regional Resource Imbalance & Deficit Cluster Alerts</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Identifies zones where crop operations face equipment bottlenecks
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('demand-forecast')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            <span>View Full Heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
          {forecasts.map((f, idx) => (
            <div key={idx} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 dark:text-stone-100">{f.region}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    f.predictedDemandLevel === 'Very High' 
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}>
                    {f.predictedDemandLevel} Deficit Alert
                  </span>
                </div>
                <p className="text-stone-500">
                  Target: <strong>{f.equipmentType}</strong> for {f.cropFocus} • Deficit: <span className="font-mono text-rose-600 font-bold">-{f.activeMachineryDeficit} units</span>
                </p>
                <p className="text-[11px] text-stone-400 italic">
                  Advice: {f.actionAdvice}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {rebalanceAlertSent === f.region ? (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Rebalance Dispatched</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleSendRebalanceAlert(f.region)}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Broadcast Rebalance Incentive
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
