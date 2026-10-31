import React from 'react';
import {
  Tractor,
  ShoppingBag,
  Users,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Radio,
  Sun,
  Check,
  Truck,
  Plus
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { MachineImage } from '../common/MachineImage';
import { HomeCarousel } from '../home/HomeCarousel';

export const FarmerDashboard: React.FC = () => {
  const {
    bookings,
    orders,
    openTrackingModal,
    setCurrentTab,
    formatPrice,
    labourJobs
  } = useApp();
  const { user } = useAuth();

  const myPostedJobs = labourJobs?.filter(j => j.farmerId === (user?.id || 'farmer-current') || j.farmerId === 'farmer-1') || [];

  // Active bookings (in progress or confirmed) and active orders (processing or shipped)
  const activeBookings = bookings.filter(b => b.status === 'in_progress' || b.status === 'confirmed');
  const activeOrders = orders.filter(o => o.status === 'processing' || o.status === 'shipped');

  // Friendly time-of-day greeting (First name only)
  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = user?.name ? user.name.split(' ')[0] : 'Harsh';

  // Singular / plural sentence builder for bookings & orders on the way
  const renderSummaryText = () => {
    const bookingCount = activeBookings.length;
    const orderCount = activeOrders.length;

    const bookingLabel = bookingCount === 1 ? 'machine booking' : 'machine bookings';
    const orderLabel = orderCount === 1 ? 'order' : 'orders';

    if (bookingCount === 0 && orderCount === 0) {
      return <span>You have no machine bookings and no orders on the way.</span>;
    }
    if (bookingCount === 0) {
      return (
        <span>
          You have no machine bookings and{' '}
          <strong className="font-semibold text-stone-900 dark:text-stone-100">{orderCount}</strong>{' '}
          {orderLabel} on the way.
        </span>
      );
    }
    if (orderCount === 0) {
      return (
        <span>
          You have{' '}
          <strong className="font-semibold text-stone-900 dark:text-stone-100">{bookingCount}</strong>{' '}
          {bookingLabel} and no orders on the way.
        </span>
      );
    }
    return (
      <span>
        You have{' '}
        <strong className="font-semibold text-stone-900 dark:text-stone-100">{bookingCount}</strong>{' '}
        {bookingLabel} and{' '}
        <strong className="font-semibold text-stone-900 dark:text-stone-100">{orderCount}</strong>{' '}
        {orderLabel} on the way.
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-16 md:pb-6 animate-in fade-in duration-200">
      {/* 1. Image Carousel at Top */}
      <HomeCarousel />

      {/* 2. Welcome Card (Single greeting, calm and hand-designed) */}
      <div className="bg-white dark:bg-stone-900 rounded-xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 dark:text-stone-100">
            {timeGreeting}, {firstName}
          </h1>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            {renderSummaryText()}
          </p>
          <p className="text-xs text-stone-400 dark:text-stone-500 pt-0.5">
            Village: {user?.villageOrDistrict || user?.location || 'Morinda Village, Rupnagar'}
          </p>
        </div>
      </div>

      {/* 3. Labour Jobs Banner (Simple, calm, no loud pills or all-caps) */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-stone-900 dark:text-stone-100">
            Need labour for harvesting or sowing?
          </h2>
          <p className="text-xs text-stone-600 dark:text-stone-400">
            Post your requirement in 1 minute or browse local labourers looking for daily farm work.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            onClick={() => setCurrentTab('post-labour-job')}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.2]" />
            <span>Post labour job</span>
          </button>
          <button
            onClick={() => setCurrentTab('my-labour-jobs')}
            className="min-h-[40px] px-3.5 py-2 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-750 text-stone-800 dark:text-stone-200 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-4 h-4 text-stone-500" />
            <span>My posted jobs ({myPostedJobs.length})</span>
          </button>
        </div>
      </div>

      {/* 4. Farm Details & Helpful Tip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Farm Details Card (No bordered boxes, simple clean label + value columns) */}
        <div className="md:col-span-2 bg-white dark:bg-stone-900 rounded-xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
            <h2 className="text-sm font-semibold text-stone-900 dark:text-stone-100">
              My Farm Details
            </h2>
            <button
              onClick={() => setCurrentTab('settings')}
              className="text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
            >
              Edit details
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-stone-100 dark:divide-stone-800">
            <div className="pt-2 sm:pt-0 sm:pr-4">
              <span className="text-xs text-stone-500 dark:text-stone-400 block mb-0.5">Land size</span>
              <span className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
                {user?.farmDetails?.acres || 45} Acres
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <span className="text-xs text-stone-500 dark:text-stone-400 block mb-0.5">Main crop</span>
              <span className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 truncate block">
                {user?.farmDetails?.primaryCrops[0] || 'Corn'}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:px-4">
              <span className="text-xs text-stone-500 dark:text-stone-400 block mb-0.5">Soil type</span>
              <span className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 truncate block">
                {user?.farmDetails?.soilType || 'Silt Loam'}
              </span>
            </div>

            <div className="pt-2 sm:pt-0 sm:pl-4">
              <span className="text-xs text-stone-500 dark:text-stone-400 block mb-0.5">Weather</span>
              <span className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500 shrink-0" />
                <span>22°C Clear</span>
              </span>
            </div>
          </div>
        </div>

        {/* Calm Helpful Tip Card (Plain white card, 1px border, future dates, normal text) */}
        <div className="bg-white dark:bg-stone-900 rounded-xl p-5 sm:p-6 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">
              Helpful tip
            </span>
            <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100">
              Good time to spray your crop
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Best dry window: <strong className="font-semibold text-stone-900 dark:text-stone-100">Nov 04 – Nov 08</strong>. Join a nearby tractor group booking to save 40% on transport.
            </p>
          </div>

          <button
            onClick={() => setCurrentTab('group-booking')}
            className="w-full py-2.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>See group booking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 5. "My Machine Bookings" Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
              <Tractor className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                My Machine Bookings
              </h2>
              <p className="text-xs text-stone-500">Track machines working on your land</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('matching')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Rent another machine</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-xl p-8 border border-stone-200 dark:border-stone-800 text-center space-y-3 shadow-xs">
            <Tractor className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              No bookings yet. Tap 'Rent a machine' to start.
            </p>
            <button
              onClick={() => setCurrentTab('matching')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Rent a machine
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookings.map((b) => {
              const isWorkInProgress = b.status === 'in_progress';
              const isBooked = b.status === 'confirmed';
              const isDone = b.status === 'completed';

              return (
                <div
                  key={b.id}
                  className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Status badge & total price (no monospace) */}
                    <div className="flex items-center justify-between">
                      {isWorkInProgress && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                          <span>In progress</span>
                        </span>
                      )}
                      {isBooked && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800/60">
                          <Check className="w-3.5 h-3.5 text-blue-600" />
                          <span>Confirmed</span>
                        </span>
                      )}
                      {isDone && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                          <span>Completed</span>
                        </span>
                      )}

                      <span className="text-base font-semibold text-stone-900 dark:text-stone-100">
                        {formatPrice(b.totalPrice)}
                      </span>
                    </div>

                    {/* Machine Photo and Information */}
                    <div className="flex items-start gap-3.5">
                      <MachineImage
                        src={b.equipmentImage}
                        alt={b.equipmentName}
                        className="w-20 h-20 rounded-lg object-cover border border-stone-200 dark:border-stone-800 shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <h3 className="text-sm sm:text-base font-semibold text-stone-900 dark:text-stone-100 truncate">
                          {b.equipmentName}
                        </h3>
                        <p className="text-xs text-stone-600 dark:text-stone-300">
                          Work: <strong className="font-semibold text-stone-900 dark:text-stone-100">{b.operationType}</strong> ({b.acreage} acres)
                        </p>
                        <p className="text-xs text-stone-500">
                          Dates: {b.startDate} to {b.endDate} ({b.totalDays} {b.totalDays === 1 ? 'day' : 'days'})
                        </p>
                      </div>
                    </div>

                    {/* Progress Indicator */}
                    <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className="text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                          {isWorkInProgress ? (
                            <>
                              <Radio className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                              <span>62% done • Arriving in 18 min</span>
                            </>
                          ) : isDone ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-stone-500" />
                              <span>Operation complete</span>
                            </>
                          ) : (
                            <>
                              <Check className="w-3.5 h-3.5 text-stone-500" />
                              <span>Machine confirmed • Scheduled</span>
                            </>
                          )}
                        </span>
                        <span className="font-semibold text-stone-700 dark:text-stone-300">
                          {isWorkInProgress ? '62%' : '100%'}
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 transition-all duration-300"
                          style={{ width: isWorkInProgress ? '62%' : '100%' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-3">
                    <span className="text-xs text-stone-400 truncate">
                      Owner: {b.ownerName.split('(')[0]}
                    </span>

                    <button
                      onClick={() => openTrackingModal(b)}
                      className="min-h-[40px] px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{isDone ? 'View details' : 'Track on map'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 6. "My Farm Supply Orders" Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                My Farm Supply Orders
              </h2>
              <p className="text-xs text-stone-500">Delivered directly to your farm gate</p>
            </div>
          </div>

          <button
            onClick={() => setCurrentTab('marketplace')}
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ Order supplies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-xl p-8 border border-stone-200 dark:border-stone-800 text-center space-y-3 shadow-xs">
            <ShoppingBag className="w-10 h-10 text-stone-300 dark:text-stone-700 mx-auto" />
            <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
              No supply orders yet. Tap 'Order supplies' to browse seeds and fertilizers.
            </p>
            <button
              onClick={() => setCurrentTab('marketplace')}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              Order supplies
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {orders.map((ord) => {
              const isDelivered = ord.status === 'delivered';
              const isShipped = ord.status === 'shipped';

              return (
                <div
                  key={ord.id}
                  className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-5 shadow-xs space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-semibold text-stone-900 dark:text-stone-100">
                          Order #{ord.id}
                        </span>
                        <span className="text-xs text-stone-400 block">Ordered on {ord.createdAt}</span>
                      </div>
                      <span className="text-base font-semibold text-stone-900 dark:text-stone-100">
                        {formatPrice(ord.total)}
                      </span>
                    </div>

                    {/* Items (wrap to two lines, no ellipsis cutting off text) */}
                    <div className="space-y-2 text-xs border-t border-stone-100 dark:border-stone-800/80 pt-2.5">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-start gap-3 text-stone-700 dark:text-stone-300">
                          <span className="leading-snug break-words line-clamp-2">• {item.product.name} (x{item.quantity})</span>
                          <span className="shrink-0 font-medium text-stone-800 dark:text-stone-200">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3-step Delivery Timeline */}
                  <div className="p-3 rounded-lg bg-stone-50 dark:bg-stone-800/50 border border-stone-200/80 dark:border-stone-700/60 space-y-2">
                    <div className="flex items-center justify-between text-xs font-medium text-stone-600 dark:text-stone-300">
                      <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Placed
                      </span>
                      <span className={`flex items-center gap-1 ${isShipped || isDelivered ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'}`}>
                        <Truck className="w-3.5 h-3.5" /> On the way
                      </span>
                      <span className={`flex items-center gap-1 ${isDelivered ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400'}`}>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Delivered
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                      <div
                        className="h-full bg-emerald-600 transition-all duration-300"
                        style={{ width: isDelivered ? '100%' : isShipped ? '66%' : '33%' }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 text-center">
                      {isDelivered ? (
                        <>Delivered on <strong className="font-semibold text-stone-700 dark:text-stone-300">{ord.estimatedDeliveryDate}</strong> at your farm gate.</>
                      ) : (
                        <>Arriving by <strong className="font-semibold text-stone-700 dark:text-stone-300">{ord.estimatedDeliveryDate}</strong> at your farm gate.</>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
