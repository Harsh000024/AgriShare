import React, { useState } from 'react';
import { 
  X, 
  Phone, 
  MessageCircle, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Headphones, 
  Clock 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const HelpModal: React.FC = () => {
  const { isHelpOpen, closeHelp } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [callNotice, setCallNotice] = useState(false);

  if (!isHelpOpen) return null;

  const faqs = [
    {
      q: 'How do I rent a tractor or machine?',
      a: 'Go to "Find Machines", pick your crop and work (like ploughing or harvest), choose your dates, and tap "Rent". An operator can also come with the machine.'
    },
    {
      q: 'Can I get a driver/operator with the machine?',
      a: 'Yes! Every machine has an option: "Machine Only" or "Machine + Operator". If you do not want to drive yourself, choose "Machine + Operator".'
    },
    {
      q: 'What if the machine breaks down while working?',
      a: 'You are protected! Our field coordinator will send a replacement machine from the nearest village within 2 hours. You only pay for actual work done.'
    },
    {
      q: 'When do I have to pay?',
      a: 'You only pay after the work is completed and you are happy. You can pay with cash, bank transfer, or post-harvest credit.'
    },
    {
      q: 'How does Group Booking save money?',
      a: 'When 2 or more nearby farmers share the same harvester or tractor on consecutive days, the transport fee is split. Everyone saves up to 40%.'
    },
    {
      q: 'How does the Labour Jobs board work?',
      a: 'Labourers can open "Labour Jobs" without logging in, view daily work, see pay rates and facilities (food/transport), and apply with just their name and phone. Farmers can post jobs and review applicants directly from their dashboard.'
    },
    {
      q: 'How are machine operators verified?',
      a: 'All machine operators and drivers are background-checked, license-verified, and experienced for safe and efficient field operations.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 p-6 space-y-5 text-stone-900 dark:text-stone-100 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Help & Support</h3>
              <p className="text-xs text-stone-500">We are here to help you 24/7</p>
            </div>
          </div>
          <button 
            onClick={closeHelp}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Immediate Call / WhatsApp Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <a
            href="tel:+18005552474"
            onClick={() => {
              setCallNotice(true);
              setTimeout(() => setCallNotice(false), 2500);
            }}
            className="min-h-[48px] p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>Call Agent</span>
          </a>

          <a
            href="https://wa.me/15553491082?text=Hello%20AgriShare%20I%20need%20help%20with%20machinery"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[48px] p-3 rounded-2xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {callNotice && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs font-semibold text-center">
            Connecting you to your local village agricultural helpline (+1 800 555-AGRI)...
          </div>
        )}

        {/* Support hours & trust guarantee */}
        <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/60 text-xs space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>Safe Payments & Breakdown Help Guarantee</span>
          </div>
          <p className="text-stone-600 dark:text-stone-300">
            If a machine stops working or doesn't arrive on time, call us immediately. A standby replacement is dispatched at no extra cost.
          </p>
        </div>

        {/* FAQs */}
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-stone-800 dark:text-stone-200">
            Common Questions
          </h4>
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {faqs.map((faq, i) => (
              <div key={i} className="py-2.5">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left flex items-center justify-between text-sm font-semibold text-stone-800 dark:text-stone-200 hover:text-emerald-600"
                >
                  <span>{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
                </button>
                {openFaq === i && (
                  <p className="mt-1.5 text-xs text-stone-600 dark:text-stone-400 leading-relaxed pr-4">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Safe payments trust badge */}
        <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Safe payments • Trusted sellers • 24/7 Field Support</span>
        </div>

        <button
          onClick={closeHelp}
          className="w-full py-3 rounded-2xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-sm font-bold transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};
