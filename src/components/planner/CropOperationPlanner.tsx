import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Tractor, 
  ShoppingBag, 
  Clock, 
  ArrowRight, 
  CheckCircle2, 
  DollarSign, 
  AlertCircle,
  HelpCircle,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CROP_OPERATION_PLANS } from '../../data/mockData';

export const CropOperationPlanner: React.FC = () => {
  const { setCurrentTab, setSelectedEquipment, equipmentList, addToCart, products, formatPrice } = useApp();
  const { user } = useAuth();

  const [selectedCrop, setSelectedCrop] = useState<string>(user?.farmDetails?.primaryCrops[0] || 'Corn / Maize');
  const [acreage, setAcreage] = useState<number>(user?.farmDetails?.acres || 45);
  const [plantingMonth, setPlantingMonth] = useState('October');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  const operations = CROP_OPERATION_PLANS[selectedCrop] || CROP_OPERATION_PLANS['Corn / Maize'];

  const totalEstimatedBudget = operations.reduce((sum, op) => sum + op.estimatedCostPerAcre * acreage, 0);

  const handleBookMachinery = (machineNameHint: string) => {
    // Find closest matching equipment
    const matched = equipmentList.find(e => 
      e.name.toLowerCase().includes(machineNameHint.toLowerCase().split(' ')[0])
    ) || equipmentList[0];
    
    setSelectedEquipment(matched);
    setCurrentTab('matching');
  };

  const handleAddInputSupplies = (inputHint: string) => {
    const matchedProd = products.find(p => 
      p.name.toLowerCase().includes(inputHint.toLowerCase().split(' ')[0])
    ) || products[0];

    addToCart(matchedProd, 2);
    setAddedNotice(`Added ${matchedProd.name} to cart based on AI Crop Schedule!`);
    setTimeout(() => setAddedNotice(null), 2500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-emerald-950 dark:bg-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm border border-emerald-900/50 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
            <Calendar className="w-3.5 h-3.5" />
            <span>Crop Plan</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Plan Machines & Supplies for Your Season
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            See the best dates to plough, sow, spray, and harvest your crop. 
            Book machines early to avoid shortages during peak season.
          </p>
          {addedNotice && (
            <div className="absolute top-4 right-4 z-20 bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-2 animate-in slide-in-from-top duration-200">
              <CheckCircle2 className="w-4 h-4" />
              <span>{addedNotice}</span>
            </div>
          )}
        </div>
      </div>

      {/* Farm & Crop Configurator Matrix */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
              Select Cultivated Crop
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            >
              <option value="Corn / Maize">Corn / Maize</option>
              <option value="Wheat / Barley">Wheat / Barley</option>
              <option value="Soybeans & Legumes">Soybeans & Legumes</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
              Field Acreage
            </label>
            <input
              type="number"
              min="5"
              max="2000"
              value={acreage}
              onChange={(e) => setAcreage(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
              Season Planting Timing
            </label>
            <select
              value={plantingMonth}
              onChange={(e) => setPlantingMonth(e.target.value)}
              className="w-full text-xs font-semibold px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            >
              <option value="October">Early Autumn (October)</option>
              <option value="November">Mid Autumn (November)</option>
              <option value="March">Early Spring (March)</option>
              <option value="April">Mid Spring (April)</option>
            </select>
          </div>
        </div>

        {/* Season Budget Estimation Bar */}
        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span className="text-stone-600 dark:text-stone-300">
              Total Full-Cycle Machinery & Input Budget Estimate:
            </span>
            <strong className="text-sm font-mono font-bold text-emerald-600 dark:text-emerald-400">
              ${totalEstimatedBudget.toLocaleString()} (${Math.round(totalEstimatedBudget / acreage)} / acre)
            </strong>
          </div>

          <span className="text-[11px] text-stone-400">
            Based on 4 synchronized lifecycle phases
          </span>
        </div>
      </div>

      {/* Timeline Steps for Crop Lifecycle */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Recommended Agronomic Timeline for {selectedCrop} ({acreage} Acres)</span>
        </h2>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 before:w-0.5 before:bg-stone-200 dark:before:bg-stone-800 before:hidden sm:before:block">
          {operations.map((op, idx) => (
            <div
              key={idx}
              className="relative sm:pl-10 group"
            >
              {/* Timeline marker icon */}
              <div className="hidden sm:flex absolute left-0 top-6 -translate-x-1/2 w-8 h-8 rounded-full bg-emerald-600 text-white font-bold text-xs items-center justify-center border-4 border-white dark:border-stone-900 shadow-md">
                {idx + 1}
              </div>

              {/* Main Phase Card */}
              <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs hover:border-emerald-500/60 transition-all space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {op.weekOffset}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        op.urgency === 'high'
                          ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {op.urgency} Urgency Window
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100">
                      {op.phase}
                    </h3>
                  </div>

                  {/* Booking Window & Cost */}
                  <div className="text-right sm:self-center">
                    <div className="text-xs font-semibold text-stone-700 dark:text-stone-300 flex items-center sm:justify-end gap-1">
                      <Clock className="w-3.5 h-3.5 text-stone-400" />
                      <span>Booking Window: <strong className="text-emerald-600 dark:text-emerald-400">{op.approxBookingWindow}</strong></span>
                    </div>
                    <span className="text-[11px] text-stone-400 font-mono">
                      ~${op.estimatedCostPerAcre}/acre (${(op.estimatedCostPerAcre * acreage).toLocaleString()} total)
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                  {op.description}
                </p>

                {/* Sub-grid: Recommended Machinery & Supplies Bundling */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Machinery Recommendations */}
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <Tractor className="w-3.5 h-3.5 text-emerald-500" />
                      Recommended Machinery
                    </span>
                    <div className="space-y-1.5">
                      {op.recommendedMachinery.map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-stone-800 dark:text-stone-200">• {m}</span>
                          <button
                            onClick={() => handleBookMachinery(m)}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                          >
                            <span>Book</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Input Supplies Recommendations */}
                  <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700/60">
                    <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                      <ShoppingBag className="w-3.5 h-3.5 text-emerald-500" />
                      Recommended Marketplace Inputs
                    </span>
                    <div className="space-y-1.5">
                      {op.recommendedInputs.map((inp, inpIdx) => (
                        <div key={inpIdx} className="flex items-center justify-between text-xs">
                          <span className="font-medium text-stone-800 dark:text-stone-200">• {inp}</span>
                          <button
                            onClick={() => handleAddInputSupplies(inp)}
                            className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5"
                          >
                            <span>Add Supply</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
