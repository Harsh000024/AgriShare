import React from 'react';
import { 
  Tractor, 
  MapPin, 
  Calendar, 
  Clock, 
  Radio, 
  Check, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Star,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MachineImage } from '../common/MachineImage';

export const MyBookingsView: React.FC = () => {
  const { bookings, openTrackingModal, setCurrentTab, formatPrice, rateBooking } = useApp();

  const activeBookings = bookings.filter(b => b.status === 'in_progress' || b.status === 'confirmed');
  const pastBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  return (
    <div className="space-y-6 pb-16 md:pb-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200 dark:border-stone-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>My Machine Bookings</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Check the live arrival and working status of machines scheduled for your farm
          </p>
        </div>

        <button
          onClick={() => setCurrentTab('matching')}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all self-start sm:self-auto cursor-pointer"
        >
          <Tractor className="w-4 h-4" />
          <span>Rent a Machine</span>
        </button>
      </div>

      {/* Active Bookings */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
          Currently Active ({activeBookings.length})
        </h2>

        {activeBookings.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-200 dark:border-stone-800 text-center space-y-3">
            <Tractor className="w-12 h-12 text-stone-300 dark:text-stone-700 mx-auto" />
            <p className="text-sm font-semibold text-stone-600 dark:text-stone-400">
              You have no active machine bookings right now.
            </p>
            <button
              onClick={() => setCurrentTab('matching')}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Browse Available Machines
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeBookings.map((b) => {
              const isWorkInProgress = b.status === 'in_progress';

              return (
                <div
                  key={b.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-4 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {isWorkInProgress ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>Work in Progress</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Booked</span>
                        </span>
                      )}

                      <span className="text-base font-extrabold font-mono text-stone-900 dark:text-stone-100">
                        {formatPrice(b.totalPrice)}
                      </span>
                    </div>

                    <div className="flex items-start gap-3.5">
                      <MachineImage
                        src={b.equipmentImage}
                        alt={b.equipmentName}
                        className="w-20 h-20 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-bold text-stone-900 dark:text-stone-100 truncate">
                          {b.equipmentName}
                        </h3>
                        <p className="text-xs text-stone-600 dark:text-stone-300">
                          Work: <strong className="text-stone-900 dark:text-stone-100">{b.operationType}</strong> ({b.acreage} acres)
                        </p>
                        <p className="text-xs text-stone-500">
                          Dates: {b.startDate} to {b.endDate}
                        </p>
                        <p className="text-xs text-stone-400">
                          Owner: {b.ownerName}
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & ETA */}
                    <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                          <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                          <span>{isWorkInProgress ? '62% done • Arriving in 18 min' : 'Booked • Preparing for deployment'}</span>
                        </span>
                        <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">
                          {isWorkInProgress ? '62%' : '100%'}
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-300"
                          style={{ width: isWorkInProgress ? '62%' : '100%' }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Track on Map & Call Driver */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                    <a
                      href="tel:+15553491082"
                      className="min-h-[40px] px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Driver</span>
                    </a>

                    <button
                      onClick={() => openTrackingModal(b)}
                      className="min-h-[44px] px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>Track on Map</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed / Past Bookings */}
      {pastBookings.length > 0 && (
        <div className="space-y-3 pt-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-stone-500">
            Past Completed Bookings ({pastBookings.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pastBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-5 shadow-sm space-y-3 opacity-90"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Done
                  </span>
                  <span className="font-mono text-sm font-bold">{formatPrice(b.totalPrice)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <img src={b.equipmentImage} alt={b.equipmentName} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100">{b.equipmentName}</h4>
                    <p className="text-xs text-stone-500">{b.operationType} on {b.startDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
