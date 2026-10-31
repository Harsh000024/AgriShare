import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  Radio, 
  Gauge, 
  BatteryCharging, 
  Fuel, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Navigation, 
  Play, 
  Pause,
  AlertCircle
} from 'lucide-react';
import { EquipmentBooking } from '../../types';

interface LiveTrackingModalProps {
  booking: EquipmentBooking | null;
  onClose: () => void;
}

export const LiveTrackingModal: React.FC<LiveTrackingModalProps> = ({ booking, onClose }) => {
  const [speed, setSpeed] = useState(24);
  const [eta, setEta] = useState(18);
  const [fuelLevel, setFuelLevel] = useState(82);
  const [isSimulating, setIsSimulating] = useState(true);
  const [progressPercent, setProgressPercent] = useState(62);

  // Live simulation tick
  useEffect(() => {
    if (!isSimulating || !booking) return;

    const interval = setInterval(() => {
      setSpeed((prev) => Math.min(30, Math.max(18, prev + (Math.random() * 4 - 2))));
      setProgressPercent((prev) => (prev >= 98 ? 62 : prev + 1));
      setEta((prev) => (prev <= 2 ? 18 : prev - 0.2));
    }, 2500);

    return () => clearInterval(interval);
  }, [isSimulating, booking]);

  if (!booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden text-stone-900 dark:text-stone-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">Live Status on Map</h3>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
                  LIVE
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Machine: {booking.equipmentName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={onClose}
              className="p-1 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Map & Telemetry Canvas */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto">
          {/* Main Visual Map Simulation */}
          <div className="relative bg-stone-950 rounded-2xl p-6 overflow-hidden min-h-[260px] flex flex-col justify-between border border-stone-800">
            {/* Top Map Badges */}
            <div className="relative z-10 flex items-center justify-between gap-2">
              <div className="bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-stone-700 text-xs text-stone-200">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Target: {booking.farmerLocation}</span>
                </div>
                <div className="text-[11px] text-stone-400 mt-0.5">
                  Work: {booking.operationType} ({booking.acreage} Acres)
                </div>
              </div>

              <div className="bg-emerald-950/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-700 text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 animate-spin text-emerald-400" />
                <span>Arriving in: {Math.max(1, Math.round(eta))} mins</span>
              </div>
            </div>

            {/* Field Grid Visualization */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30">
              <div className="w-[120%] h-[120%] border border-stone-800 grid grid-cols-6 grid-rows-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="border border-stone-800 relative">
                    {i === 8 && <span className="absolute top-1 left-1 text-[9px] text-stone-500 font-mono">Plot 1</span>}
                    {i === 15 && <span className="absolute top-1 left-1 text-[9px] text-stone-500 font-mono">Plot 2</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Center Vehicle Marker */}
            <div className="relative z-10 flex flex-col items-center justify-center my-6">
              <div className="relative">
                <div className="absolute -inset-4 rounded-full bg-emerald-500/20 animate-ping"></div>
                <div className="w-16 h-16 rounded-full bg-emerald-600 border-2 border-emerald-300 flex items-center justify-center text-white shadow-2xl relative z-10 text-3xl">
                  🚜
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-stone-300 bg-stone-900/90 border border-stone-700 px-3 py-1 rounded-full">
                Moving towards your farm • {speed.toFixed(0)} km/h
              </span>
            </div>

            {/* Bottom Progress Bar */}
            <div className="relative z-10 bg-stone-900/90 backdrop-blur-md p-3.5 rounded-xl border border-stone-800">
              <div className="flex items-center justify-between text-xs mb-1 font-semibold text-stone-200">
                <span>Progress: {booking.trackingLocation?.currentJobPhase || 'Work in Progress'}</span>
                <span className="text-emerald-400 font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-stone-800 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Simple Gauges & Driver Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Driver Card */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-stone-400 uppercase">Machine Operator</span>
                <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{booking.ownerName}</h4>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified & Insured</span>
                </p>
              </div>

              <a
                href="tel:+15553491082"
                className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Driver</span>
              </a>
            </div>

            {/* Quick Status Info */}
            <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 flex items-center justify-around text-center">
              <div>
                <span className="text-xs text-stone-400 block">Speed</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                  {speed.toFixed(0)} km/h
                </span>
              </div>
              <div className="w-px h-8 bg-stone-200 dark:bg-stone-700"></div>
              <div>
                <span className="text-xs text-stone-400 block">Fuel</span>
                <span className="text-base font-bold font-mono text-stone-900 dark:text-stone-100">
                  {fuelLevel}%
                </span>
              </div>
              <div className="w-px h-8 bg-stone-200 dark:bg-stone-700"></div>
              <div>
                <span className="text-xs text-stone-400 block">Condition</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  Healthy
                </span>
              </div>
            </div>
          </div>

          {/* Simple breakdown guarantee note */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Breakdown guarantee: If the machine stops, a standby replacement will be sent within 2 hours.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full min-h-[48px] py-3 rounded-2xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-bold transition-colors cursor-pointer"
          >
            Close Map View
          </button>
        </div>
      </div>
    </div>
  );
};
