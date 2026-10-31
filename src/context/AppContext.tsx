import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Equipment,
  EquipmentBooking,
  MarketplaceProduct,
  CartItem,
  MarketplaceOrder,
  GroupBookingPool,
  RegionalDemandForecast,
  UserRole,
  LabourJob,
  LabourApplicant,
  LabourWorkType
} from '../types';
import {
  INITIAL_EQUIPMENT,
  INITIAL_MARKETPLACE_PRODUCTS,
  INITIAL_GROUP_POOLS,
  REGIONAL_DEMAND_FORECASTS,
  INITIAL_LABOUR_JOBS
} from '../data/mockData';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';

export type NavigationTab =
  | 'home'
  | 'matching'
  | 'marketplace'
  | 'bookings'
  | 'help'
  | 'group-booking'
  | 'crop-planner'
  | 'demand-forecast'
  | 'pricing-tool'
  | 'settings'
  | 'labour-jobs'
  | 'post-labour-job'
  | 'my-labour-jobs';

export type Currency = 'USD' | 'INR';
export type TextSize = 'normal' | 'large';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

interface AppContextType {
  // Navigation & Theme
  currentTab: NavigationTab;
  setCurrentTab: (tab: NavigationTab) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;

  // Accessibility & Currency
  textSize: TextSize;
  toggleTextSize: () => void;
  currency: Currency;
  toggleCurrency: () => void;
  formatPrice: (usdAmount: number) => string;

  // Equipment & Bookings
  equipmentList: Equipment[];
  bookings: EquipmentBooking[];
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  createBooking: (bookingData: Omit<EquipmentBooking, 'id' | 'createdAt' | 'status'>) => EquipmentBooking;
  cancelBooking: (bookingId: string) => void;
  rateBooking: (bookingId: string, rating: number) => void;

  // Group Bookings
  groupPools: GroupBookingPool[];
  joinGroupPool: (poolId: string, farmerId: string, farmerName: string, acres: number, crop: string) => boolean;
  createGroupPool: (pool: Omit<GroupBookingPool, 'id' | 'currentAcres' | 'joinedFarmers' | 'status'>) => void;

  // Farm Supplies
  products: MarketplaceProduct[];
  cart: CartItem[];
  orders: MarketplaceOrder[];
  addToCart: (product: MarketplaceProduct, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkout: (shippingAddress: string, paymentMethod: string) => MarketplaceOrder;

  // Active tracking modal
  activeTrackingBooking: EquipmentBooking | null;
  openTrackingModal: (booking: EquipmentBooking) => void;
  closeTrackingModal: () => void;

  // Selected equipment for detail/booking modal
  selectedEquipment: Equipment | null;
  setSelectedEquipment: (equipment: Equipment | null) => void;

  // Regional forecasts
  forecasts: RegionalDemandForecast[];

  // Help Modal
  isHelpOpen: boolean;
  openHelp: () => void;
  closeHelp: () => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;

  // Labour Jobs
  labourJobs: LabourJob[];
  postLabourJob: (jobData: Omit<LabourJob, 'id' | 'postedAt' | 'applicants' | 'spotsFilled' | 'status'>) => LabourJob;
  applyToJob: (jobId: string, applicant: { name: string; phone: string; village: string }) => { success: boolean; message: string };
  updateApplicantStatus: (jobId: string, applicantId: string, status: 'accepted' | 'rejected') => void;
  closeJob: (jobId: string) => void;
  reopenJob: (jobId: string) => void;
  deleteJob: (jobId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('agrishare_darkmode');
      if (stored !== null) return JSON.parse(stored);
      return false; // Light mode default for farmers
    } catch {
      return false;
    }
  });

  // Apply dark mode class to <html>
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('agrishare_darkmode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // Text size state ('normal' | 'large')
  const [textSize, setTextSize] = useState<TextSize>(() => {
    try {
      const stored = localStorage.getItem('agrishare_textsize');
      if (stored === 'large') return 'large';
    } catch { }
    return 'normal';
  });

  useEffect(() => {
    if (textSize === 'large') {
      document.documentElement.classList.add('text-lg-mode');
    } else {
      document.documentElement.classList.remove('text-lg-mode');
    }
    localStorage.setItem('agrishare_textsize', textSize);
  }, [textSize]);

  const toggleTextSize = () => {
    setTextSize((prev) => (prev === 'normal' ? 'large' : 'normal'));
  };

  // Currency standard ('INR' Rupees)
  const [currency] = useState<Currency>('INR');
  const toggleCurrency = () => { };

  const formatPrice = (amount: number): string => {
    return `₹${Math.round(amount).toLocaleString('en-IN')}`;
  };

  // Navigation tab state (defaults to 'home')
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');

  // Help modal state
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const openHelp = () => setIsHelpOpen(true);
  const closeHelp = () => setIsHelpOpen(false);

  // Equipment state
  const [equipmentList, setEquipmentList] = useState<Equipment[]>(() => {
    try {
      const stored = localStorage.getItem('agrishare_equipment');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const isStale = parsed.some((eq: any) => 
            eq.category === 'Agricultural Drone' || 
            eq.name?.toLowerCase().includes('drone') ||
            eq.name?.includes('Novo') ||
            eq.name?.includes('Tiger') ||
            eq.name?.includes('Rainstar') ||
            eq.name?.includes('ASPEE') ||
            eq.name?.includes('Fieldking') ||
            eq.image?.includes('unsplash')
          );
          if (!isStale) return parsed;
        }
      }
    } catch { }
    return INITIAL_EQUIPMENT;
  });

  useEffect(() => {
    localStorage.setItem('agrishare_equipment', JSON.stringify(equipmentList));
  }, [equipmentList]);

  // Bookings state
  const [bookings, setBookings] = useState<EquipmentBooking[]>(() => {
    try {
      const stored = localStorage.getItem('agrishare_bookings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const isStale = parsed.some((b: any) =>
            b.equipmentName?.toLowerCase().includes('drone') ||
            b.operationType?.toLowerCase().includes('drone') ||
            b.equipmentName?.includes('Novo') ||
            b.equipmentName?.includes('ASPEE') ||
            b.equipmentImage?.includes('unsplash')
          );
          if (!isStale) {
            // Ensure bookings whose dates have passed show completed
            return parsed.map((b: EquipmentBooking) => {
              if (b.endDate < '2026-10-31' && b.status !== 'cancelled') {
                return { ...b, status: 'completed' as const };
              }
              return b;
            });
          }
        }
      }
    } catch { }
    return [
      {
        id: 'book-101',
        equipmentId: 'eq-1',
        equipmentName: 'Mahindra Arjun 605 DI Ultra-1 4WD Tractor',
        equipmentImage: '/images/machines/mahindra-arjun-605-tractor.jpg',
        farmerId: 'farmer-current',
        farmerName: 'Local Farmer',
        farmerLocation: 'Morinda Village Field (Plot 4)',
        ownerName: 'Sardar Gurpreet Singh',
        operationType: 'Field Ploughing',
        cropType: 'Corn',
        acreage: 35,
        startDate: '2026-10-06',
        endDate: '2026-10-08',
        totalDays: 2,
        serviceTier: 'machine_plus_operator',
        dailyRate: 3200,
        operatorFee: 600,
        transportFee: 800,
        totalPrice: 8400,
        status: 'completed',
        trackingLocation: {
          lat: 30.7937,
          lng: 76.4988,
          address: 'Morinda Village North Gate (Job Complete)',
          speedKmh: 0,
          etaMinutes: 0,
          currentJobPhase: 'Job Completed',
        },
        hasGroupDiscount: false,
        createdAt: '2026-10-02',
      },
      {
        id: 'book-102',
        equipmentId: 'eq-3',
        equipmentName: 'Shaktiman Tractor-Mounted 600L Boom Sprayer',
        equipmentImage: '/images/machines/shaktiman-boom-sprayer.svg',
        farmerId: 'farmer-current',
        farmerName: 'Local Farmer',
        farmerLocation: 'Morinda Village Orchard Plot',
        ownerName: 'Kuldeep Singh Sidhu (Morinda Agro Equip)',
        operationType: 'Foliar Nutrient Boom Spray',
        cropType: 'Wheat',
        acreage: 20,
        startDate: '2026-11-04',
        endDate: '2026-11-05',
        totalDays: 1,
        serviceTier: 'machine_operator_transport',
        dailyRate: 2400,
        operatorFee: 600,
        transportFee: 350,
        totalPrice: 2850,
        status: 'confirmed',
        hasGroupDiscount: true,
        groupDiscountPercent: 15,
        createdAt: '2026-10-28',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('agrishare_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Real-time Firestore listeners for bookings and orders
  useEffect(() => {
    const pathForBookings = 'bookings';
    const unsubBookings = onSnapshot(collection(db, pathForBookings), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreBookings: EquipmentBooking[] = [];
        snapshot.forEach((d) => {
          firestoreBookings.push(d.data() as EquipmentBooking);
        });
        if (firestoreBookings.length > 0) {
          setBookings(firestoreBookings);
        }
      }
    }, (error) => {
      console.warn('Firestore Bookings listener notice:', error.message);
    });

    const pathForOrders = 'orders';
    const unsubOrders = onSnapshot(collection(db, pathForOrders), (snapshot) => {
      if (!snapshot.empty) {
        const firestoreOrders: MarketplaceOrder[] = [];
        snapshot.forEach((d) => {
          firestoreOrders.push(d.data() as MarketplaceOrder);
        });
        if (firestoreOrders.length > 0) {
          setOrders(firestoreOrders);
        }
      }
    }, (error) => {
      console.warn('Firestore Orders listener notice:', error.message);
    });

    return () => {
      unsubBookings();
      unsubOrders();
    };
  }, []);

  // Auto-purge any stale cached drone/Novo/foreign records from browser localStorage on load
  useEffect(() => {
    try {
      const keys = ['agrishare_bookings', 'agrishare_equipment', 'agrishare_grouppools'];
      keys.forEach((key) => {
        const val = localStorage.getItem(key);
        if (val && (
          val.toLowerCase().includes('drone') ||
          val.includes('Novo') ||
          val.includes('Tiger') ||
          val.includes('Rainstar') ||
          val.includes('ASPEE') ||
          val.includes('Fieldking')
        )) {
          localStorage.removeItem(key);
        }
      });
    } catch {}
  }, []);

  // Group pools
  const [groupPools, setGroupPools] = useState<GroupBookingPool[]>(() => {
    try {
      const stored = localStorage.getItem('agrishare_grouppools');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const isStale = parsed.some((p: any) =>
            p.equipmentCategory === 'Agricultural Drone' ||
            p.title?.toLowerCase().includes('drone') ||
            p.equipmentName?.toLowerCase().includes('drone') ||
            p.equipmentName?.includes('ASPEE')
          );
          if (!isStale) return parsed;
        }
      }
    } catch { }
    return INITIAL_GROUP_POOLS;
  });

  useEffect(() => {
    localStorage.setItem('agrishare_grouppools', JSON.stringify(groupPools));
  }, [groupPools]);

  // Farm Supplies & Cart
  const [products] = useState<MarketplaceProduct[]>(INITIAL_MARKETPLACE_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('agrishare_cart');
      if (stored) return JSON.parse(stored);
    } catch { }
    return [
      {
        product: INITIAL_MARKETPLACE_PRODUCTS[1], // AgriBoost NPK
        quantity: 3,
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('agrishare_cart', JSON.stringify(cart));
  }, [cart]);

  // Orders
  const [orders, setOrders] = useState<MarketplaceOrder[]>(() => {
    try {
      const stored = localStorage.getItem('agrishare_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Ensure orders whose arrival date has passed show delivered
          return parsed.map((o: MarketplaceOrder) => {
            if (o.estimatedDeliveryDate < '2026-10-31') {
              return { ...o, status: 'delivered' as const };
            }
            return o;
          });
        }
      }
    } catch { }
    return [
      {
        id: 'ord-8821',
        userId: 'farmer-current',
        items: [
          { product: INITIAL_MARKETPLACE_PRODUCTS[0], quantity: 2 },
          { product: INITIAL_MARKETPLACE_PRODUCTS[2], quantity: 1 },
        ],
        subtotal: 4550,
        deliveryFee: 0,
        discount: 200,
        total: 4350,
        shippingAddress: 'Morinda Village Farmstead, GT Road, Gate 2',
        paymentMethod: 'Pay After Delivery / Cash',
        status: 'delivered',
        estimatedDeliveryDate: '2026-10-07',
        createdAt: '2026-10-03',
      },
      {
        id: 'ord-8822',
        userId: 'farmer-current',
        items: [
          { product: INITIAL_MARKETPLACE_PRODUCTS[1], quantity: 3 },
        ],
        subtotal: 2850,
        deliveryFee: 0,
        discount: 100,
        total: 2750,
        shippingAddress: 'Morinda Village Farmstead, GT Road, Gate 2',
        paymentMethod: 'UPI / Online',
        status: 'shipped',
        estimatedDeliveryDate: '2026-11-04',
        createdAt: '2026-10-30',
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('agrishare_orders', JSON.stringify(orders));
  }, [orders]);

  // Modals & Selected items
  const [activeTrackingBooking, setActiveTrackingBooking] = useState<EquipmentBooking | null>(null);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [forecasts] = useState<RegionalDemandForecast[]>(REGIONAL_DEMAND_FORECASTS);

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      title: 'Tip: Good time to spray your crop',
      message: 'Weather will be dry Nov 04-08. Book a boom sprayer or join a group to save 40%.',
      time: '1 hour ago',
      read: false,
      type: 'info',
    },
    {
      id: 'notif-2',
      title: 'Tractor on the way',
      message: 'Mahindra Arjun 605 Tractor completed ploughing. Driver: Sardar Gurpreet Singh.',
      time: '2 hours ago',
      read: false,
      type: 'success',
    },
    {
      id: 'notif-3',
      title: 'Supplies Order Delivered',
      message: 'Order #ord-8821 was delivered to your farm gate.',
      time: 'Yesterday',
      read: true,
      type: 'info',
    },
  ]);

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Labour Jobs state
  const [labourJobs, setLabourJobs] = useState<LabourJob[]>(() => {
    try {
      const stored = localStorage.getItem('agrishare_labour_jobs');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch { }
    return INITIAL_LABOUR_JOBS;
  });

  useEffect(() => {
    localStorage.setItem('agrishare_labour_jobs', JSON.stringify(labourJobs));
  }, [labourJobs]);

  const postLabourJob = (jobData: Omit<LabourJob, 'id' | 'postedAt' | 'applicants' | 'spotsFilled' | 'status'>): LabourJob => {
    const newJob: LabourJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      postedAt: new Date().toISOString().split('T')[0],
      applicants: [],
      spotsFilled: 0,
      status: 'Open'
    };

    setLabourJobs((prev) => [newJob, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'Labour Job Posted Successfully!',
        message: `Your requirement for ${newJob.labourersNeeded} labourers for ${newJob.crop} (${newJob.workType}) is live.`,
        time: 'Just now',
        read: false,
        type: 'success',
      },
      ...prev,
    ]);

    return newJob;
  };

  const applyToJob = (
    jobId: string,
    applicantData: { name: string; phone: string; village: string }
  ): { success: boolean; message: string } => {
    const job = labourJobs.find((j) => j.id === jobId);
    if (!job) {
      return { success: false, message: 'Job posting not found.' };
    }

    const cleanInputPhone = applicantData.phone.replace(/\D/g, '');
    const alreadyApplied = job.applicants.some(
      (a) => a.phone.replace(/\D/g, '') === cleanInputPhone
    );
    if (alreadyApplied) {
      return {
        success: false,
        message: 'This mobile number has already applied for this job.'
      };
    }

    if (job.status === 'Filled' || job.status === 'Closed') {
      return { success: false, message: 'Sorry, this job is already filled or closed.' };
    }

    const newApplicant: LabourApplicant = {
      id: `app-${Date.now()}`,
      name: applicantData.name.trim(),
      phone: applicantData.phone.trim(),
      village: applicantData.village.trim(),
      appliedAt: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setLabourJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        const newSpotsFilled = j.spotsFilled + 1;
        const newStatus = newSpotsFilled >= j.labourersNeeded ? 'Filled' : j.status;
        return {
          ...j,
          spotsFilled: newSpotsFilled,
          status: newStatus,
          applicants: [newApplicant, ...j.applicants]
        };
      })
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Labour Job Applicant!',
        message: `${applicantData.name} (${applicantData.village}, ${applicantData.phone}) applied for ${job.workType} in ${job.crop}.`,
        time: 'Just now',
        read: false,
        type: 'success',
      },
      ...prev,
    ]);

    return {
      success: true,
      message: `Application submitted successfully! Farmer ${job.farmerName} will call you shortly.`
    };
  };

  const updateApplicantStatus = (jobId: string, applicantId: string, status: 'accepted' | 'rejected') => {
    setLabourJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        return {
          ...j,
          applicants: j.applicants.map((a) => (a.id === applicantId ? { ...a, status } : a))
        };
      })
    );
  };

  const closeJob = (jobId: string) => {
    setLabourJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'Closed' } : j))
    );
  };

  const reopenJob = (jobId: string) => {
    setLabourJobs((prev) =>
      prev.map((j) => {
        if (j.id !== jobId) return j;
        return {
          ...j,
          status: j.spotsFilled >= j.labourersNeeded ? 'Filled' : 'Open'
        };
      })
    );
  };

  const deleteJob = (jobId: string) => {
    setLabourJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  // Cart operations
  const addToCart = (product: MarketplaceProduct, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const checkout = (shippingAddress: string, paymentMethod: string): MarketplaceOrder => {
    const subtotal = cart.reduce((acc, i) => acc + i.product.price * i.quantity, 0);
    const deliveryFee = subtotal > 1500 ? 0 : 150;
    const discount = subtotal > 3000 ? 250 : 0;
    const total = subtotal + deliveryFee - discount;

    const newOrder: MarketplaceOrder = {
      id: `ord-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: 'farmer-current',
      items: [...cart],
      subtotal,
      deliveryFee,
      discount,
      total,
      shippingAddress,
      paymentMethod,
      status: 'processing',
      estimatedDeliveryDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();

    // Persist to Firestore
    try {
      setDoc(doc(db, 'orders', newOrder.id), newOrder);
    } catch (err) {
      console.warn('Failed to sync order to Firestore:', err);
    }

    return newOrder;
  };

  // Equipment bookings operations
  const createBooking = (bookingData: Omit<EquipmentBooking, 'id' | 'createdAt' | 'status'>): EquipmentBooking => {
    const newBooking: EquipmentBooking = {
      ...bookingData,
      id: `book-${Date.now().toString().slice(-4)}`,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      trackingLocation: {
        lat: 44.512,
        lng: -89.589,
        address: 'Machine scheduled for your farm in ' + bookingData.farmerLocation,
        speedKmh: 20,
        etaMinutes: 30,
        currentJobPhase: 'Booked and ready for work',
      }
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Persist to Firestore
    try {
      setDoc(doc(db, 'bookings', newBooking.id), newBooking);
    } catch (err) {
      console.warn('Failed to sync booking to Firestore:', err);
    }

    return newBooking;
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );

    // Persist status update to Firestore
    try {
      setDoc(doc(db, 'bookings', bookingId), { status: 'cancelled' }, { merge: true });
    } catch (err) {
      console.warn('Failed to update booking in Firestore:', err);
    }
  };

  const rateBooking = (bookingId: string, rating: number) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, ratingGiven: rating } : b))
    );
  };

  const addEquipment = (equipmentData: Omit<Equipment, 'id'>) => {
    const newEq: Equipment = {
      ...equipmentData,
      id: `eq-${Date.now().toString().slice(-4)}`,
    };
    setEquipmentList((prev) => [newEq, ...prev]);
  };

  // Group booking pools
  const joinGroupPool = (
    poolId: string,
    farmerId: string,
    farmerName: string,
    acres: number,
    crop: string
  ): boolean => {
    let success = false;
    setGroupPools((prev) =>
      prev.map((pool) => {
        if (pool.id === poolId) {
          if (pool.joinedFarmers.some((f) => f.farmerId === farmerId)) {
            return pool;
          }
          const updatedAcres = pool.currentAcres + acres;
          success = true;
          return {
            ...pool,
            currentAcres: updatedAcres,
            joinedFarmers: [
              ...pool.joinedFarmers,
              { farmerId, farmerName, acres, crop }
            ],
            status: updatedAcres >= pool.targetAcres ? 'locked' : 'open',
          };
        }
        return pool;
      })
    );
    return success;
  };

  const createGroupPool = (poolData: Omit<GroupBookingPool, 'id' | 'currentAcres' | 'joinedFarmers' | 'status'>) => {
    const newPool: GroupBookingPool = {
      ...poolData,
      id: `pool-${Date.now().toString().slice(-4)}`,
      currentAcres: 0,
      joinedFarmers: [],
      status: 'open',
    };
    setGroupPools((prev) => [newPool, ...prev]);
  };

  const openTrackingModal = (booking: EquipmentBooking) => {
    setActiveTrackingBooking(booking);
  };

  const closeTrackingModal = () => {
    setActiveTrackingBooking(null);
  };

  return (
    <AppContext.Provider
      value={{
        currentTab,
        setCurrentTab,
        isDarkMode,
        toggleDarkMode,
        textSize,
        toggleTextSize,
        currency,
        toggleCurrency,
        formatPrice,
        equipmentList,
        bookings,
        addEquipment,
        createBooking,
        cancelBooking,
        rateBooking,
        groupPools,
        joinGroupPool,
        createGroupPool,
        products,
        cart,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkout,
        activeTrackingBooking,
        openTrackingModal,
        closeTrackingModal,
        selectedEquipment,
        setSelectedEquipment,
        forecasts,
        isHelpOpen,
        openHelp,
        closeHelp,
        notifications,
        markNotificationAsRead,
        labourJobs,
        postLabourJob,
        applyToJob,
        updateApplicantStatus,
        closeJob,
        reopenJob,
        deleteJob,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
