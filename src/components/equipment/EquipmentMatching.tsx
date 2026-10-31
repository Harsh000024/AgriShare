import React, { useState, useMemo } from 'react';
import { 
  Tractor, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Star, 
  ShieldCheck, 
  ArrowRight,
  Filter,
  Clock,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { Equipment, EquipmentCategory } from '../../types';
import { EquipmentDetailModal } from './EquipmentDetailModal';
import { MachineImage } from '../common/MachineImage';

export const EquipmentMatching: React.FC = () => {
  const { equipmentList, setSelectedEquipment, selectedEquipment, formatPrice } = useApp();
  const { user } = useAuth();

  // Search & Match parameters
  const [crop, setCrop] = useState<string>(user?.farmDetails?.primaryCrops[0] || 'Corn');
  const [landSize, setLandSize] = useState<number>(user?.farmDetails?.acres || 40);
  const [operation, setOperation] = useState<string>('Ploughing');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [maxDistance, setMaxDistance] = useState<number>(30);

  const categories: (EquipmentCategory | 'All')[] = [
    'All',
    'Tractor',
    'Harvester',
    'Seeder & Planter',
    'Irrigation Machinery',
    'Baler & Tillage',
  ];

  const filteredEquipment = useMemo(() => {
    return equipmentList.filter((eq) => {
      if (selectedCategory !== 'All' && eq.category !== selectedCategory) return false;
      if (eq.distanceKm > maxDistance) return false;
      return true;
    });
  }, [equipmentList, selectedCategory, maxDistance]);

  return (
    <div className="space-y-6 pb-16 md:pb-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Tractor className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>Find Machines</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Rent tractors, harvesters, and sprayers from trusted owners near your village
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Every machine inspected for health before work</span>
        </div>
      </div>

      {/* Simplified Filter Box */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
              Your Crop
            </label>
            <select
              value={crop}
              onChange={(e) => setCrop(e.target.value)}
              className="w-full text-sm font-semibold px-3 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            >
              <option value="Corn">Corn / Maize</option>
              <option value="Wheat">Wheat</option>
              <option value="Rice">Rice / Paddy</option>
              <option value="Cotton">Cotton</option>
              <option value="Vegetables">Vegetables</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
              Work Needed
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              className="w-full text-sm font-semibold px-3 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            >
              <option value="Ploughing">Ploughing / Land Prep</option>
              <option value="Sowing">Sowing & Planting</option>
              <option value="Spraying">Spraying / Pest Defense</option>
              <option value="Harvesting">Grain Harvest</option>
              <option value="Baling">Straw Baling</option>
              <option value="Irrigation">Irrigation</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase mb-1">
              Distance (Max Radius)
            </label>
            <select
              value={maxDistance}
              onChange={(e) => setMaxDistance(Number(e.target.value))}
              className="w-full text-sm font-semibold px-3 py-2.5 rounded-2xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
            >
              <option value={15}>Within 15 km (Closest)</option>
              <option value={30}>Within 30 km (Normal)</option>
              <option value={50}>Within 50 km (All)</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-stone-100 dark:border-stone-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-2 rounded-xl font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              {cat === 'All' ? 'All Machines' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Machine Cards Grid */}
      <div className="space-y-4">
        <div className="text-xs text-stone-500 flex justify-between">
          <span>Found <strong>{filteredEquipment.length} machines</strong> available near you</span>
          <span>Tap any machine to see options and prices</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEquipment.map((eq) => (
            <div
              key={eq.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm hover:border-emerald-500/50 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {eq.category}
                  </span>
                  <span className="text-xs text-stone-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-400" />
                    {eq.distanceKm} km away
                  </span>
                </div>

                <div className="flex gap-3.5 items-start">
                  <MachineImage
                    src={eq.image}
                    alt={eq.name}
                    className="w-24 h-24 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 leading-snug">
                      {eq.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Model: {eq.model} • {eq.capacity}
                    </p>
                    <div className="flex items-center gap-2 text-xs pt-0.5">
                      <span className="flex items-center text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 mr-1" />
                        {eq.rating} ({eq.reviewCount})
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                        Health: {eq.healthScore}/100
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 truncate font-medium">
                      Owner: {eq.ownerName}
                    </p>
                  </div>
                </div>

                {/* Plain-language suitability */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {eq.suitability.slice(0, 3).map((item, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price and Action button */}
              <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <div className="text-lg font-extrabold font-mono text-stone-900 dark:text-stone-100">
                    {formatPrice(eq.dailyRate)}
                    <span className="text-xs font-normal text-stone-400"> / day</span>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Driver available (+{formatPrice(eq.operatorDailyFee)}/day)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedEquipment(eq)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Rent Machine</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Equipment Booking Modal */}
      {selectedEquipment && (
        <EquipmentDetailModal
          equipment={selectedEquipment}
          onClose={() => setSelectedEquipment(null)}
        />
      )}
    </div>
  );
};
