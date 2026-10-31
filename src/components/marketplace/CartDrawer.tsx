import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Truck,
  CheckCircle2,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateCartQuantity, checkout, clearCart, formatPrice } = useApp();
  const { user } = useAuth();

  const [address, setAddress] = useState(user?.villageOrDistrict || user?.location || 'Morinda Village, GT Road Farm Gate 2');
  const [paymentMethod, setPaymentMethod] = useState('Pay on Delivery / Cash');
  const [showConfirmStep, setShowConfirmStep] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const discount = subtotal > 3000 ? 250 : 0;
  const grandTotal = subtotal + deliveryFee - discount;

  const handleFinalOrder = () => {
    if (cart.length === 0) return;

    const newOrder = checkout(address, paymentMethod);
    try {
      confetti({ particleCount: 80, spread: 70 });
    } catch { }

    setOrderConfirmed(newOrder.id);
    setTimeout(() => {
      setOrderConfirmed(null);
      setShowConfirmStep(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white dark:bg-stone-900 h-full shadow-2xl border-l border-stone-200 dark:border-stone-800 flex flex-col justify-between text-stone-900 dark:text-stone-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Farm Supplies Cart</h3>
              <span className="text-xs text-stone-500">{cart.length} different items</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          {orderConfirmed ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold">Order Placed!</h4>
              <p className="text-sm text-stone-500">
                Order <strong>#{orderConfirmed}</strong> is confirmed. We will deliver it directly to your farm gate.
              </p>
            </div>
          ) : showConfirmStep ? (
            /* Confirmation Step */
            <div className="space-y-4 py-2">
              <h4 className="text-base font-bold text-stone-900 dark:text-stone-100">
                Confirm your order details
              </h4>
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 space-y-2 text-xs sm:text-sm">
                <div className="flex justify-between">
                  <span className="text-stone-500">Delivery Address:</span>
                  <strong className="text-stone-900 dark:text-stone-100 text-right">{address}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment:</span>
                  <strong className="text-stone-900 dark:text-stone-100 text-right">{paymentMethod}</strong>
                </div>
                <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between font-bold text-base">
                  <span>Total to Pay:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConfirmStep(false)}
                  className="flex-1 min-h-[48px] py-3 rounded-2xl bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 font-bold text-xs"
                >
                  Change Items
                </button>
                <button
                  type="button"
                  onClick={handleFinalOrder}
                  className="flex-1 min-h-[48px] py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                >
                  Yes, Place Order
                </button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400 space-y-3">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
              <p className="text-sm font-semibold">Your cart is empty.</p>
              <p className="text-xs text-stone-500">
                Browse seeds, fertilizers, and tools in Farm Supplies.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {subtotal >= 1500 ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-bold">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Free Gate Delivery Qualified!</span>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
                  <span>Add {formatPrice(1500 - subtotal)} more for Free Gate Delivery</span>
                  <Truck className="w-4 h-4 text-amber-600" />
                </div>
              )}

              {/* Items */}
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {cart.map((item) => (
                  <div key={item.product.id} className="py-3 flex items-start gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-stone-200 dark:border-stone-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 dark:text-stone-100 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-xs text-stone-500">
                        {formatPrice(item.product.price)} / {item.product.unit}
                      </p>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 px-1 py-0.5">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-emerald-600"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-2.5 font-mono text-xs font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-emerald-600"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs sm:text-sm font-bold">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-stone-400 hover:text-rose-500 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && !showConfirmStep && !orderConfirmed && (
          <div className="p-5 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/90 space-y-3.5">
            <div className="space-y-2 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Delivery Farm Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-xs"
                >
                  <option value="Pay on Delivery / Cash">Pay on Delivery / Cash</option>
                  <option value="UPI / Online Transfer">UPI / Online Transfer</option>
                  <option value="Harvest Credit Settlement">Harvest Credit Settlement</option>
                </select>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Subtotal</span>
                <span className="font-mono text-stone-900 dark:text-stone-100">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-stone-600 dark:text-stone-400">
                <span>Gate Delivery</span>
                <span className="font-mono text-stone-900 dark:text-stone-100">
                  {deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-stone-200 dark:border-stone-700 flex justify-between font-bold text-base">
                <span>Total:</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => setShowConfirmStep(true)}
              className="w-full min-h-[48px] py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Review Order ({formatPrice(grandTotal)})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
