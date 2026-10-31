import React from 'react';
import { Tractor, ShieldCheck, HeartHandshake, Phone, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentTab, openHelp } = useApp();

  return (
    <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-900 text-stone-300 dark:bg-black transition-colors pt-8 pb-16 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Safe payments trust badge strip */}
        <div className="mb-6 p-3 rounded-2xl bg-stone-800/80 border border-stone-700/80 flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold text-center">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Safe payments • Trusted sellers • 24/7 Field Support</span>
        </div>

        {/* Simple 3 Value cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pb-8 border-b border-stone-800 text-xs">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Safe Payments</h4>
              <p className="text-stone-400 mt-0.5 leading-relaxed">
                You only pay after the machine finishes the work and you are satisfied.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Inspected Machines</h4>
              <p className="text-stone-400 mt-0.5 leading-relaxed">
                Tractors and harvesters are checked for health before coming to your field.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">24/7 Field Helpline</h4>
              <p className="text-stone-400 mt-0.5 leading-relaxed">
                If any machine breaks down, a standby replacement is dispatched within 2 hours.
              </p>
            </div>
          </div>
        </div>

        {/* Links and tagline */}
        <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-600 to-green-700 flex items-center justify-center text-white shadow-sm">
              <Tractor className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight">
                Agri<span className="text-emerald-400">Share</span>
              </span>
              <p className="text-[11px] text-stone-400">Rent what you need. Buy only what you must own.</p>
            </div>
          </div>

          {/* Clean Navigation Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-400 font-medium">
            <button onClick={() => setCurrentTab('home')} className="hover:text-emerald-400">Home</button>
            <span>•</span>
            <button onClick={() => setCurrentTab('matching')} className="hover:text-emerald-400">Find Machines</button>
            <span>•</span>
            <button onClick={() => setCurrentTab('labour-jobs')} className="text-emerald-400 font-bold hover:underline">Labour Jobs</button>
            <span>•</span>
            <button onClick={() => setCurrentTab('marketplace')} className="hover:text-emerald-400">Farm Supplies</button>
            <span>•</span>
            <button onClick={() => setCurrentTab('group-booking')} className="hover:text-emerald-400">Group Booking</button>
            <span>•</span>
            <button onClick={() => setCurrentTab('crop-planner')} className="hover:text-emerald-400">Crop Planner</button>
            <span>•</span>
            <button onClick={openHelp} className="text-emerald-400 hover:underline font-bold">Help & Support</button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-t border-stone-800 text-center text-xs text-stone-500">
          <p>© {new Date().getFullYear()} AgriShare. Built with pride for farmers.</p>
        </div>
      </div>
    </footer>
  );
};
