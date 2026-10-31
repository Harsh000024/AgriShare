import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  HeartHandshake, 
  Calendar, 
  CheckCircle2, 
  Truck, 
  Activity, 
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Equipment } from '../../types';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MachineImage } from '../common/MachineImage';

interface EquipmentDetailModalProps {
  equipment: Equipment | null;
  onClose: () => void;
}

export const EquipmentDetailModal: React.FC<EquipmentDetailModalProps> = ({ equipment, onClose }) => {
  const { createBooking, formatPrice } = useApp();
  const { user } = useAuth();

  const [serviceTier, setServiceTier] = useState<'machine_only' | 'machine_plus_operator' | 'machine_operator_transport'>('machine_plus_operator');
  const [days, setDays] = useState(2);
  const [acreage, setAcreage] = useState(user?.farmDetails?.acres || 35);
  const [operationType, setOperationType] = useState('Field Ploughing');
  const [cropType, setCropType] = useState(user?.farmDetails?.primaryCrops[0] || 'Corn');
  const [startDate, setStartDate] = useState('2026-10-12');
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!equipment) return null;

  // Rate calculations
  const machineTotal = equipment.dailyRate * days;
  const operatorFee = serviceTier !== 'machine_only' ? equipment.operatorDailyFee * days : 0;
  const transportFee = serviceTier === 'machine_operator_transport' ? equipment.transportFlatFee : 0;
  const grandTotal = machineTotal + operatorFee + transportFee;

  const handleConfirmFinalBooking = () => {
    createBooking({
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      equipmentImage: equipment.image,
      farmerId: user?.id || 'guest-farmer',
      farmerName: user?.name || 'Local Farmer',
      farmerLocation: user?.villageOrDistrict || user?.location || 'Morinda Village Field (Plot 4)',
      ownerName: equipment.ownerName,
      operationType,
      cropType,
      acreage,
      startDate,
      endDate: '2026-10-14',
      totalDays: days,
      serviceTier,
      dailyRate: equipment.dailyRate,
      operatorFee,
      transportFee,
      totalPrice: grandTotal,
      hasGroupDiscount: false,
    });

    try {
      confetti({ particleCount: 75, spread: 60 });
    } catch {}

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-stone-900 dark:text-stone-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-100 dark:bg-stone-800/80 px-6 py-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-700">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
              {equipment.category}
            </span>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 mt-0.5">
              {equipment.name}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {showConfirmStep ? (
            /* Confirmation Step */
            <div className="space-y-5 py-4 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h4 className="text-lg sm:text-xl font-extrabold text-stone-900 dark:text-stone-100">
                  Confirm your booking
                </h4>
                <p className="text-sm text-stone-600 dark:text-stone-300">
                  You are booking <strong>{equipment.name}</strong> for <strong>{days} {days === 1 ? 'day' : 'days'}</strong> ({startDate}).
                </p>
                <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2 text-sm text-left">
                  <div className="flex justify-between">
                    <span>Work:</span>
                    <strong className="text-stone-900 dark:text-stone-100">{operationType} ({acreage} acres)</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Package:</span>
                    <strong className="text-stone-900 dark:text-stone-100">
                      {serviceTier === 'machine_only' ? 'Machine Only' : serviceTier === 'machine_plus_operator' ? 'Machine + Operator' : 'Machine + Operator + Delivery'}
                    </strong>
                  </div>
                  <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between font-bold text-base">
                    <span>Total Amount:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-400">
                  Safe payment: You only pay after the work is completed and verified.
                </p>
              </div>

              <div className="flex gap-3 max-w-md mx-auto pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmStep(false)}
                  className="flex-1 min-h-[48px] py-3 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-sm"
                >
                  Go Back
                </button>
                <button
                  type="button"
                  onClick={handleConfirmFinalBooking}
                  className="flex-1 min-h-[48px] py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  Yes, Confirm Booking
                </button>
              </div>
            </div>
          ) : isSuccess ? (
            <div className="p-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h4 className="text-xl font-bold">Booking Confirmed!</h4>
              <p className="text-sm text-stone-500">
                The machine has been scheduled. You can track it on the map under "My Bookings".
              </p>
            </div>
          ) : (
            /* Main Form */
            <div className="space-y-5">
              {/* Photo & Health summary */}
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <MachineImage
                  src={equipment.image}
                  alt={equipment.name}
                  className="w-full sm:w-48 h-36 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 shrink-0"
                />
                <div className="space-y-1.5 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                      {formatPrice(equipment.dailyRate)} <span className="text-xs font-normal text-stone-500">/ day</span>
                    </span>
                    <span className="text-xs font-bold text-stone-600 dark:text-stone-300 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{equipment.rating}</span>
                      <span className="text-stone-400 font-normal">({equipment.reviewCount} jobs)</span>
                    </span>
                  </div>

                  <p className="text-xs text-stone-500">
                    Model: {equipment.model} • Capacity: {equipment.capacity}
                  </p>
                  <p className="text-xs text-stone-500">
                    Location: {equipment.location} ({equipment.distanceKm} km away)
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Machine Health Score: {equipment.healthScore}/100 (Inspected)</span>
                  </div>
                </div>
              </div>

              {/* Service Package Options */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
                  Choose Package
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setServiceTier('machine_only')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      serviceTier === 'machine_only'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500 font-bold'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                  >
                    <span className="text-xs block text-stone-900 dark:text-stone-100">Machine Only</span>
                    <span className="text-[11px] text-stone-500 block">Drive it yourself</span>
                    <span className="text-xs font-mono font-bold text-stone-800 dark:text-stone-200 mt-1 block">
                      {formatPrice(equipment.dailyRate)}/day
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceTier('machine_plus_operator')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      serviceTier === 'machine_plus_operator'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500 font-bold'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                  >
                    <span className="text-xs block text-stone-900 dark:text-stone-100">With Driver/Operator</span>
                    <span className="text-[11px] text-stone-500 block">Driver comes along</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                      +{formatPrice(equipment.operatorDailyFee)}/day
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceTier('machine_operator_transport')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      serviceTier === 'machine_operator_transport'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-500 font-bold'
                        : 'border-stone-200 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/40'
                    }`}
                  >
                    <span className="text-xs block text-stone-900 dark:text-stone-100">Driver + Gate Delivery</span>
                    <span className="text-[11px] text-stone-500 block">Delivered on trailer</span>
                    <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1 block">
                      +{formatPrice(equipment.transportFlatFee)}
                    </span>
                  </button>
                </div>
              </div>

              {/* Days, Land Acres, Dates */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">How many days?</label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={days}
                    onChange={(e) => setDays(Math.max(1, Number(e.target.value)))}
                    className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Land (Acres)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={acreage}
                    onChange={(e) => setAcreage(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-2 py-2 text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Work Type</label>
                  <select
                    value={operationType}
                    onChange={(e) => setOperationType(e.target.value)}
                    className="w-full px-2 py-2 text-sm font-medium rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800"
                  >
                    <option value="Field Ploughing">Ploughing</option>
                    <option value="Precision Sowing">Sowing</option>
                    <option value="Crop Spraying">Crop Spraying</option>
                    <option value="Grain Harvest">Harvest</option>
                    <option value="Straw Baling">Baling</option>
                  </select>
                </div>
              </div>

              {/* Price Calculation Bill */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1.5 text-xs sm:text-sm">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>Machine ({days} days @ {formatPrice(equipment.dailyRate)})</span>
                  <span className="font-mono text-stone-900 dark:text-stone-100">{formatPrice(machineTotal)}</span>
                </div>
                {operatorFee > 0 && (
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Driver fee ({days} days)</span>
                    <span className="font-mono text-stone-900 dark:text-stone-100">+{formatPrice(operatorFee)}</span>
                  </div>
                )}
                {transportFee > 0 && (
                  <div className="flex justify-between text-stone-600 dark:text-stone-400">
                    <span>Delivery fee</span>
                    <span className="font-mono text-stone-900 dark:text-stone-100">+{formatPrice(transportFee)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between font-bold text-base">
                  <span>Estimated Total:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Step 1 Submit Button */}
              <button
                type="button"
                onClick={() => setShowConfirmStep(true)}
                className="w-full min-h-[48px] py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Continue to Booking ({formatPrice(grandTotal)})</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
