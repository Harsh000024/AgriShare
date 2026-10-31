import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Percent,
  MapPin,
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  Tractor,
  DollarSign,
  TrendingDown,
  Route,
  ShieldCheck,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { GroupBookingPool, EquipmentCategory } from '../../types';

export const GroupBookingSection: React.FC = () => {
  const { groupPools, joinGroupPool, createGroupPool } = useApp();
  const { user } = useAuth();

  const [selectedPoolForJoin, setSelectedPoolForJoin] = useState<GroupBookingPool | null>(null);
  const [farmerAcres, setFarmerAcres] = useState<number>(user?.farmDetails?.acres || 25);
  const [farmerCrop, setFarmerCrop] = useState<string>(user?.farmDetails?.primaryCrops[0] || 'Corn / Maize');
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  // New pool modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<EquipmentCategory>('Harvester');
  const [newEquipName, setNewEquipName] = useState('Preet 987 Deluxe AC Combine Harvester');
  const [newLocation, setNewLocation] = useState('Morinda & Chamkaur Sahib Villages');
  const [newTargetAcres, setNewTargetAcres] = useState(100);
  const [newStartDate, setNewStartDate] = useState('2026-10-18');
  const [newSavings, setNewSavings] = useState(35);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPoolForJoin) return;

    const ok = joinGroupPool(
      selectedPoolForJoin.id,
      user?.id || 'farmer-guest',
      user?.name || 'Local Farmer',
      farmerAcres,
      farmerCrop
    );

    if (ok) {
      try {
        confetti({ particleCount: 70, spread: 60 });
      } catch { }
      setJoinSuccess(`Joined ${selectedPoolForJoin.title}! ${farmerAcres} acres registered for pooled transport.`);
      setTimeout(() => {
        setSelectedPoolForJoin(null);
        setJoinSuccess(null);
      }, 1500);
    }
  };

  const handleCreatePool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    createGroupPool({
      title: newTitle,
      equipmentCategory: newCategory,
      equipmentName: newEquipName,
      locationArea: newLocation,
      targetAcres: newTargetAcres,
      targetFarmers: 4,
      startDate: newStartDate,
      estimatedCostSavingPercent: newSavings,
    });

    setShowCreateModal(false);
    setNewTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-emerald-950 dark:bg-stone-900 rounded-3xl p-6 sm:p-7 text-white shadow-sm border border-emerald-900/50 relative overflow-hidden">
        <div className="max-w-3xl relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>Group Booking</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            Share Machines with Neighbors & Save Up to 40%
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
            When you and nearby farms book the same harvester or tractor sprayer on the same days,
            delivery and transport costs are split. Less travel for machines, lower costs for everyone.
          </p>
        </div>

        {/* Floating Quick Action */}
        <div className="relative z-10 mt-5 flex flex-wrap gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Start a New Group Booking</span>
          </button>
        </div>
      </div>

      {/* How Pooling Works Flow & Route Optimizer Infographic */}
      <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 border border-stone-200 dark:border-stone-800 shadow-sm">
        <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-4">
          <Route className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Equipment Utilization Optimizer: Route Consolidation</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40">
            <div className="flex items-center gap-2 font-bold text-rose-800 dark:text-rose-300 mb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>Traditional Individual Rental</span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-2">
              Each farmer books individually. Machine transports 15 km to Farm A, returns to depot, then re-transports 18 km to Farm B next week.
            </p>
            <div className="font-mono text-rose-700 dark:text-rose-400 font-bold">
              Transport overhead: ₹2,500+ per farm
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800/80">
            <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-300 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>AgriShare Pooled Route</span>
            </div>
            <p className="text-stone-600 dark:text-stone-400 leading-relaxed mb-2">
              AI maps adjacent parcels. Single flatbed delivers machine to Farm A, which rolls across field fence to Farm B and Farm C continuously.
            </p>
            <div className="font-mono text-emerald-700 dark:text-emerald-300 font-bold">
              Transport overhead: ~₹400 split evenly (35% total savings)
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex flex-col justify-between">
            <div>
              <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
                Owner Benefit: Zero Idle Days
              </span>
              <p className="text-stone-500 dark:text-stone-400 leading-relaxed">
                Equipment owners secure guaranteed multi-day contiguous run-time with zero deadhead return trips.
              </p>
            </div>
            <div className="mt-2 pt-2 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between font-mono text-[11px] text-stone-500">
              <span>Avg Idle Reduction:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">+58% efficiency</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Regional Pools List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900 dark:text-stone-100">
              Active Regional Equipment Pools
            </h2>
            <p className="text-xs text-stone-500">
              Join an open cluster within your local zone to lock in shared pricing
            </p>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800">
            {groupPools.filter(p => p.status === 'open').length} Open Pools Near You
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {groupPools.map((pool) => {
            const percentFilled = Math.min(100, Math.round((pool.currentAcres / pool.targetAcres) * 100));
            const isUserJoined = pool.joinedFarmers.some(f => f.farmerId === user?.id);

            return (
              <div
                key={pool.id}
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs flex flex-col justify-between hover:border-emerald-500/50 transition-all"
              >
                <div>
                  {/* Status & Savings pill */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
                      {pool.equipmentCategory}
                    </span>

                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                      <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                      Save ~{pool.estimatedCostSavingPercent}%
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 leading-snug">
                    {pool.title}
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
                    Machine: {pool.equipmentName}
                  </p>

                  <div className="mt-3 space-y-1 text-xs text-stone-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      <span>{pool.locationArea}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-stone-400" />
                      <span>Scheduled Deployment: {pool.startDate}</span>
                    </div>
                  </div>

                  {/* Acreage Capacity Progress Bar */}
                  <div className="mt-4 p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60">
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                      <span className="text-stone-600 dark:text-stone-300">
                        Pooled Acreage: <strong className="font-mono text-stone-900 dark:text-stone-100">{pool.currentAcres}</strong> / {pool.targetAcres} Acres
                      </span>
                      <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {percentFilled}%
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-300"
                        style={{ width: `${percentFilled}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-stone-400 mt-2">
                      <span>{pool.joinedFarmers.length} neighboring farms committed</span>
                      <span className="capitalize font-bold text-stone-700 dark:text-stone-300">
                        {pool.status === 'open' ? '🟢 Slots Available' : '🔒 Capacity Locked'}
                      </span>
                    </div>
                  </div>

                  {/* Farmers list preview */}
                  <div className="mt-3">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block mb-1">
                      Committed Neighbors:
                    </span>
                    <div className="space-y-1">
                      {pool.joinedFarmers.map((farmer, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-stone-600 dark:text-stone-300">
                          <span className="truncate max-w-[170px]">• {farmer.farmerName}</span>
                          <span className="font-mono text-stone-400">{farmer.acres} ac ({farmer.crop})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-5 pt-3 border-t border-stone-100 dark:border-stone-800">
                  {isUserJoined ? (
                    <div className="w-full py-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 border border-emerald-300 dark:border-emerald-800">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Your Farm is Registered in this Pool</span>
                    </div>
                  ) : pool.status === 'locked' ? (
                    <button
                      disabled
                      className="w-full py-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-400 text-xs font-semibold cursor-not-allowed text-center"
                    >
                      Target Acreage Reached (Locked)
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedPoolForJoin(pool)}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Join Pool with Your Acreage</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Join Pool Modal */}
      {selectedPoolForJoin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Join Group Equipment Pool
              </h3>
              <button onClick={() => setSelectedPoolForJoin(null)} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            {joinSuccess ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-bold text-center">
                {joinSuccess}
              </div>
            ) : (
              <form onSubmit={handleJoinSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/50 text-xs space-y-1">
                  <div className="font-bold text-stone-800 dark:text-stone-200">{selectedPoolForJoin.title}</div>
                  <div className="text-stone-500">Machine: {selectedPoolForJoin.equipmentName}</div>
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    Expected Discount: {selectedPoolForJoin.estimatedCostSavingPercent}% off individual rates
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Your Farm Acreage to Add
                  </label>
                  <input
                    type="number"
                    min="5"
                    max={selectedPoolForJoin.targetAcres - selectedPoolForJoin.currentAcres}
                    value={farmerAcres}
                    onChange={(e) => setFarmerAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                    required
                  />
                  <p className="text-[10px] text-stone-400 mt-1">
                    Remaining pool capacity: {selectedPoolForJoin.targetAcres - selectedPoolForJoin.currentAcres} acres
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Target Crop
                  </label>
                  <select
                    value={farmerCrop}
                    onChange={(e) => setFarmerCrop(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                  >
                    <option value="Corn / Maize">Corn / Maize</option>
                    <option value="Wheat / Barley">Wheat / Barley</option>
                    <option value="Soybeans">Soybeans</option>
                    <option value="Cotton">Cotton</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
                >
                  Confirm & Join Shared Pool
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Create New Pool Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Initiate Local Equipment Pool
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-stone-400 hover:text-stone-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePool} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1">Pool Title / Cluster Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Silver Springs Corn Combine Shared Run"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Equipment Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as EquipmentCategory)}
                    className="w-full px-2 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  >
                    <option value="Harvester">Harvester</option>
                    <option value="Tractor">Tractor</option>
                    <option value="Seeder & Planter">Seeder & Planter</option>
                    <option value="Irrigation Machinery">Irrigation Machinery</option>
                    <option value="Baler & Tillage">Baler & Tillage</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target Total Acres</label>
                  <input
                    type="number"
                    value={newTargetAcres}
                    onChange={(e) => setNewTargetAcres(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    min="30"
                    max="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Location / Regional Zone</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. Valley Road corridor, Sector 5-7"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Deployment Window</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Estimated Cost Saving %</label>
                  <input
                    type="number"
                    value={newSavings}
                    onChange={(e) => setNewSavings(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800"
                    min="10"
                    max="60"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer mt-2"
              >
                Publish Pool to Regional Network
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
