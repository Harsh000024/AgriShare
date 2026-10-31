export type UserRole = 'farmer' | 'owner' | 'operator' | 'seller' | 'cooperative';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  location: string;
  villageOrDistrict: string;
  avatar: string;
  farmDetails?: {
    acres: number;
    primaryCrops: string[];
    soilType: string;
    irrigationType: string;
  };
  cooperativeName?: string;
  rating: number;
  totalTransactions: number;
  verified: boolean;
  memberSince: string;
}

export type EquipmentCategory = 
  | 'Tractor' 
  | 'Harvester' 
  | 'Seeder & Planter' 
  | 'Irrigation Machinery' 
  | 'Baler & Tillage';

export interface Equipment {
  id: string;
  name: string;
  model: string;
  category: EquipmentCategory;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  hourlyRate: number;
  dailyRate: number;
  location: string;
  distanceKm: number;
  image: string;
  healthScore: number; // 0 - 100
  powerHp: number;
  capacity: string;
  suitability: string[];
  features: string[];
  available: boolean;
  availableFrom: string;
  rating: number;
  reviewCount: number;
  maintenanceLastDate: string;
  operatingHours: number;
  operatorAvailable: boolean;
  transportAvailable: boolean;
  operatorDailyFee: number;
  transportFlatFee: number;
  specs: {
    fuelCapacityLiters: number;
    year: number;
    breakdownCount: number;
    condition: 'Excellent' | 'Good' | 'Fair';
  };
}

export interface EquipmentBooking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage: string;
  farmerId: string;
  farmerName: string;
  farmerLocation: string;
  ownerName: string;
  operationType: string;
  cropType: string;
  acreage: number;
  startDate: string;
  endDate: string;
  totalDays: number;
  serviceTier: 'machine_only' | 'machine_plus_operator' | 'machine_operator_transport';
  dailyRate: number;
  operatorFee: number;
  transportFee: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'dispatched' | 'in_progress' | 'completed' | 'cancelled';
  trackingLocation?: {
    lat: number;
    lng: number;
    address: string;
    speedKmh: number;
    etaMinutes: number;
    currentJobPhase: string;
  };
  hasGroupDiscount?: boolean;
  groupDiscountPercent?: number;
  ratingGiven?: number;
  createdAt: string;
}

export interface GroupBookingPool {
  id: string;
  title: string;
  equipmentCategory: EquipmentCategory;
  equipmentName: string;
  locationArea: string;
  targetAcres: number;
  currentAcres: number;
  targetFarmers: number;
  joinedFarmers: {
    farmerId: string;
    farmerName: string;
    acres: number;
    crop: string;
  }[];
  startDate: string;
  estimatedCostSavingPercent: number;
  status: 'open' | 'locked' | 'dispatched';
}

export type MarketplaceCategory = 
  | 'Seeds'
  | 'Fertilizers'
  | 'Biopesticides'
  | 'Farm Tools'
  | 'Irrigation Supplies'
  | 'Nursery Plants'
  | 'Crop Storage';

export interface MarketplaceProduct {
  id: string;
  name: string;
  category: MarketplaceCategory;
  price: number;
  unit: string;
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  sellerName: string;
  sellerLocation: string;
  stock: number;
  isOrganicCertified: boolean;
  suitableCrops: string[];
  features: string[];
  applicationRate?: string;
}

export interface CartItem {
  product: MarketplaceProduct;
  quantity: number;
}

export interface MarketplaceOrder {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  status: 'processing' | 'shipped' | 'delivered';
  estimatedDeliveryDate: string;
  createdAt: string;
}

export interface CropOperation {
  phase: string;
  weekOffset: string;
  recommendedMachinery: string[];
  recommendedInputs: string[];
  approxBookingWindow: string;
  urgency: 'high' | 'medium' | 'low';
  description: string;
  estimatedCostPerAcre: number;
}

export interface RegionalDemandForecast {
  region: string;
  cropFocus: string;
  equipmentType: EquipmentCategory;
  predictedDemandLevel: 'Very High' | 'High' | 'Moderate' | 'Low';
  peakDemandDateRange: string;
  activeMachineryDeficit: number;
  utilizationRateCurrent: number;
  recommendedPriceAdjustment: string;
  actionAdvice: string;
}

export type LabourWorkType =
  | 'Harvesting'
  | 'Sowing / Planting'
  | 'Weeding'
  | 'Spraying'
  | 'Irrigation'
  | 'Loading / Unloading'
  | 'Other';

export interface LabourApplicant {
  id: string;
  name: string;
  phone: string;
  village: string;
  appliedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface LabourJob {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerRating: number;
  isVerifiedFarmer: boolean;
  workType: LabourWorkType;
  crop: string;
  labourersNeeded: number;
  spotsFilled: number;
  payPerDay: number;
  totalDays: number;
  startDate: string;
  village: string;
  district: string;
  landmark?: string;
  distanceKm: number;
  foodProvided: boolean;
  transportProvided: boolean;
  drinkingWater: boolean;
  shelterProvided: boolean;
  extraDetails?: string;
  status: 'Open' | 'Filled' | 'Closed';
  postedAt: string;
  applicants: LabourApplicant[];
}
