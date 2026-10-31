import React, { useState } from 'react';
import { 
  DollarSign, 
  Sparkles, 
  Sliders, 
  TrendingUp, 
  Fuel, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Info,
  ShieldCheck,
  Tractor
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const DynamicPricingTool: React.FC = () => {
  const { equipmentList, formatPrice } = useApp();

  const [selectedEquipId, setSelectedEquipId] = useState(equipmentList[0]?.id || 'eq-1');
  const [demandFactor, setDemandFactor] = useState<'peak' | 'normal' | 'low'>('peak');
  const [distanceKm, setDistanceKm] = useState<number>(12);
  const [fuelIndex, setFuelIndex] = useState<number>(90); // ₹/Litre diesel
  const [durationDays, setDurationDays] = useState<number>(3);
  const [includeOperator, setIncludeOperator] = useState<boolean>(true);
  const [appliedNotice, setAppliedNotice] = useState(false);

  const selectedEquipment = equipmentList.find(e => e.id === selectedEquipId) || equipmentList[0];

  // AI Pricing algorithm
  const baseRate = selectedEquipment.dailyRate;
  const demandMultiplier = demandFactor === 'peak' ? 1.15 : demandFactor === 'normal' ? 1.0 : 0.90;
  const fuelSurcharge = Math.round((fuelIndex - 85) * 4 * (distanceKm / 10));
  const operatorAddition = includeOperator ? selectedEquipment.operatorDailyFee : 0;
  const multiDayDiscount = durationDays >= 5 ? 0.92 : durationDays >= 3 ? 0.96 : 1.0;

  const rawRecommended = Math.round(((baseRate * demandMultiplier) + fuelSurcharge + operatorAddition) * multiDayDiscount);
  const minRange = Math.round(rawRecommended * 0.90);
  const maxRange = Math.round(rawRecommended * 1.12);

  // Owner manual slider adjustment
  const [ownerOverridePrice, setOwnerOverridePrice] = useState<number>(rawRecommended);

  const handleApply = () => {
    setAppliedNotice(true);
    setTimeout(() => setAppliedNotice(false), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-emerald-950 dark:bg-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm border border-emerald-900/50 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
            <DollarSign className="w-3.5 h-3.5" />
            <span>Today's Prices</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Set the Best Rental Price for Your Fleet
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            See fair market prices based on season demand, diesel cost, and job days. 
            You always have the final say on the rate you want to charge.
          </p>
        </div>
      </div>

      {/* Main Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
          <h2 className="text-sm font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Configure Operating & Market Variables</span>
          </h2>

          {/* Machine Selection */}
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
              Select Fleet Machine
            </label>
            <select
              value={selectedEquipId}
              onChange={(e) => {
                setSelectedEquipId(e.target.value);
                setOwnerOverridePrice(rawRecommended);
              }}
              className="w-full text-xs font-semibold px-3 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            >
              {equipmentList.map((eq) => (
                <option key={eq.id} value={eq.id}>
                  {eq.name} (Base: {formatPrice(eq.dailyRate)}/day)
                </option>
              ))}
            </select>
          </div>

          {/* Demand Status & Season */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase">
              Current Regional Demand State
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'peak', label: '🔥 Peak Harvest Demand', mult: '+15% surge' },
                { id: 'normal', label: '🌱 Standard Season', mult: 'Baseline' },
                { id: 'low', label: '❄️ Off-Season / Idle', mult: '-10% discount' },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => {
                    setDemandFactor(d.id as any);
                    setOwnerOverridePrice(rawRecommended);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    demandFactor === d.id
                      ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 ring-1 ring-emerald-500 font-bold'
                      : 'border-stone-200 dark:border-stone-700 bg-stone-50/40 dark:bg-stone-800/40'
                  }`}
                >
                  <span className="block text-stone-900 dark:text-stone-100">{d.label}</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5 block">{d.mult}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Travel Radius & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
                Travel Radius: <span className="font-mono text-emerald-600 dark:text-emerald-400">{distanceKm} km</span>
              </label>
              <input
                type="range"
                min="2"
                max="50"
                value={distanceKm}
                onChange={(e) => setDistanceKm(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>Local (2km)</span>
                <span>Regional (50km)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
                Job Duration: <span className="font-mono text-emerald-600 dark:text-emerald-400">{durationDays} Days</span>
              </label>
              <input
                type="range"
                min="1"
                max="14"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>1 Day</span>
                <span>Multi-week (14d)</span>
              </div>
            </div>
          </div>

          {/* Fuel Benchmark & Operator Option */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1 flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-500" />
                <span>Diesel Benchmark (₹/Litre)</span>
              </label>
              <input
                type="number"
                step="1"
                value={fuelIndex}
                onChange={(e) => setFuelIndex(Number(e.target.value))}
                className="w-full text-xs font-medium px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 font-mono"
              />
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 self-end">
              <div>
                <span className="text-xs font-bold block text-stone-800 dark:text-stone-200">
                  Include In-House Operator
                </span>
                <span className="text-[10px] text-stone-400">+{formatPrice(selectedEquipment.operatorDailyFee)}/day package</span>
              </div>
              <input
                type="checkbox"
                checked={includeOperator}
                onChange={(e) => setIncludeOperator(e.target.checked)}
                className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right Output: AI Price Recommendation Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-500" />
                AI Suggested Market Rate
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-mono font-bold">
                94% Acceptance Probability
              </span>
            </div>

            <div className="text-center py-2">
              <div className="text-4xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {formatPrice(rawRecommended)}
                <span className="text-sm font-normal text-stone-400"> / day</span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Optimal price for high booking likelihood without leaving money on the table
              </p>
            </div>

            {/* Competitive Market Range */}
            <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-stone-500">Competitive Corridor:</span>
                <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                  {formatPrice(minRange)} — {formatPrice(maxRange)} / day
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 relative overflow-hidden">
                <div className="absolute left-[20%] right-[20%] h-full bg-emerald-500 rounded-full"></div>
              </div>
              <span className="text-[10px] text-stone-400 block text-center">
                Priced within regional cooperative guidelines
              </span>
            </div>

            {/* Owner Manual Override Slider (Owner holds final authority) */}
            <div className="pt-2 space-y-2">
              <div className="flex justify-between text-xs">
                <label className="font-bold text-stone-700 dark:text-stone-300">
                  Owner Manual Price Override:
                </label>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {formatPrice(ownerOverridePrice)}/day
                </span>
              </div>
              <input
                type="range"
                min={Math.round(minRange * 0.8)}
                max={Math.round(maxRange * 1.3)}
                value={ownerOverridePrice}
                onChange={(e) => setOwnerOverridePrice(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <p className="text-[10px] text-stone-400 italic">
                You always have the final say on the rate you want to charge.
              </p>
            </div>

            {/* Apply Action */}
            <div className="pt-2">
              {appliedNotice ? (
                <div className="p-3 rounded-xl bg-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Rate updated to {formatPrice(ownerOverridePrice)}/day on AgriShare!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApply}
                  className="w-full min-h-[48px] py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish Rate ({formatPrice(ownerOverridePrice)}/day)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
