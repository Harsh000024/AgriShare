import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { hasCustomAvatar } from '../utils/avatar';
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateFirebaseProfile,
  firebaseSignOut, 
  onAuthStateChanged,
  db,
  getFriendlyAuthErrorMessage,
  normalizePhoneOrEmailToAuthEmail,
  handleFirestoreError,
  OperationType 
} from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneOrEmail: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signup: (userData: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    avatar?: string;
    villageOrDistrict: string;
    role: UserRole;
    acres?: number;
    crop?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  quickLoginAs: (role: UserRole, customName?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Start with user from localStorage, or null if first time
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('agrishare_user_active') || localStorage.getItem('aagrishare_user_active');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.avatar && !hasCustomAvatar(parsed.avatar)) {
          parsed.avatar = '';
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return null; // Require login screen first
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync auth state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        try {
          const userRef = doc(db, 'users', fbUser.uid);
          const snap = await getDoc(userRef);
          if (snap.exists()) {
            const data = snap.data() as User;
            setUser(data);
          }
        } catch (err) {
          console.warn('Auth state sync notice:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('agrishare_user_active', JSON.stringify(user));
    } else {
      localStorage.removeItem('aagrishare_user_active');
      localStorage.removeItem('agrishare_user_active');
    }
  }, [user]);

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const userId = fbUser.uid;

      const userRef = doc(db, 'users', userId);
      let existingProfile: User | null = null;
      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          existingProfile = snap.data() as User;
        }
      } catch (err) {
        console.warn('Could not read existing profile from Firestore:', err);
      }

      const activeUser: User = existingProfile || {
        id: userId,
        name: fbUser.displayName || 'Farmer ' + userId.slice(0, 4),
        email: fbUser.email || `${userId}@agrishare.internal`,
        phone: fbUser.phoneNumber || '',
        role: 'farmer',
        location: 'Greenfield Village',
        villageOrDistrict: 'Greenfield Village',
        avatar: fbUser.photoURL || '',
        farmDetails: {
          acres: 40,
          primaryCrops: ['Corn', 'Wheat'],
          soilType: 'Silt Loam',
          irrigationType: 'Canal & Tubewell',
        },
        rating: 5.0,
        totalTransactions: 0,
        verified: true,
        memberSince: 'October 2026',
      };

      try {
        await setDoc(userRef, activeUser, { merge: true });
      } catch (err) {
        console.warn('Could not write user profile to Firestore:', err);
      }

      setUser(activeUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: getFriendlyAuthErrorMessage(err) };
    }
  };

  const login = async (phoneOrEmail: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!phoneOrEmail || !phoneOrEmail.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your phone number or email.' };
    }

    if (!password || password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must have at least 6 characters.' };
    }

    const { authEmail, isPhone, cleanPhone } = normalizePhoneOrEmailToAuthEmail(phoneOrEmail);

    try {
      const cred = await signInWithEmailAndPassword(auth, authEmail, password);
      const fbUser = cred.user;
      const userId = fbUser.uid;

      // Attempt to fetch profile from Firestore
      const userRef = doc(db, 'users', userId);
      let userProfile: User | null = null;
      try {
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          userProfile = snap.data() as User;
        }
      } catch (err) {
        console.warn('Firestore profile lookup error:', err);
      }

      if (!userProfile) {
        userProfile = {
          id: userId,
          name: fbUser.displayName || (isPhone ? 'Farmer ' + cleanPhone.slice(-4) : authEmail.split('@')[0]),
          email: fbUser.email || authEmail,
          phone: isPhone ? cleanPhone : (fbUser.phoneNumber || ''),
          role: 'farmer',
          location: 'Greenfield Village',
          villageOrDistrict: 'Greenfield Village',
          avatar: fbUser.photoURL || '',
          farmDetails: {
            acres: 40,
            primaryCrops: ['Corn', 'Wheat'],
            soilType: 'Silt Loam',
            irrigationType: 'Canal & Tubewell',
          },
          rating: 5.0,
          totalTransactions: 0,
          verified: true,
          memberSince: 'October 2026',
        };

        try {
          await setDoc(userRef, userProfile, { merge: true });
        } catch (err) {
          console.warn('Firestore setDoc user profile warning:', err);
        }
      }

      if (userProfile.avatar && !hasCustomAvatar(userProfile.avatar)) {
        userProfile.avatar = '';
      }

      setUser(userProfile);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: getFriendlyAuthErrorMessage(err) };
    }
  };

  const signup = async (userData: {
    name: string;
    phone: string;
    email?: string;
    password?: string;
    avatar?: string;
    villageOrDistrict: string;
    role: UserRole;
    acres?: number;
    crop?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);

    if (!userData.name || !userData.name.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your full name.' };
    }

    if (!userData.phone || !userData.phone.trim()) {
      setIsLoading(false);
      return { success: false, error: 'Please enter your phone number.' };
    }

    if (!userData.password || userData.password.length < 6) {
      setIsLoading(false);
      return { success: false, error: 'Password must have at least 6 characters.' };
    }

    const { authEmail } = normalizePhoneOrEmailToAuthEmail(userData.email?.trim() || userData.phone.trim());

    try {
      const cred = await createUserWithEmailAndPassword(auth, authEmail, userData.password);
      const fbUser = cred.user;
      const userId = fbUser.uid;

      // Update Firebase Auth user display name
      try {
        await updateFirebaseProfile(fbUser, { displayName: userData.name.trim() });
      } catch {}

      const chosenAvatar = userData.avatar && hasCustomAvatar(userData.avatar) 
        ? userData.avatar.trim() 
        : '';

      const newUser: User = {
        id: userId,
        name: userData.name.trim(),
        email: userData.email?.trim() || authEmail,
        phone: userData.phone.trim(),
        role: userData.role,
        location: userData.villageOrDistrict || 'Local Village',
        villageOrDistrict: userData.villageOrDistrict || 'Local Village',
        avatar: chosenAvatar,
        farmDetails: userData.role === 'farmer' ? {
          acres: userData.acres || 30,
          primaryCrops: [userData.crop || 'Corn'],
          soilType: 'Loam',
          irrigationType: 'Tubewell',
        } : undefined,
        rating: 5.0,
        totalTransactions: 0,
        verified: true,
        memberSince: 'Just now',
      };

      // Store in registered users local cache
      try {
        const storedList = localStorage.getItem('agrishare_registered_users') || localStorage.getItem('aagrishare_registered_users');
        const list = storedList ? JSON.parse(storedList) : [];
        list.push(newUser);
        localStorage.setItem('agrishare_registered_users', JSON.stringify(list));
      } catch {}

      // Store in Firestore
      try {
        await setDoc(doc(db, 'users', userId), newUser, { merge: true });
      } catch (fireErr) {
        console.warn('Firestore user registration write warning:', fireErr);
      }

      setUser(newUser);
      setIsLoading(false);
      return { success: true };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: getFriendlyAuthErrorMessage(err) };
    }
  };

  const logout = () => {
    try {
      firebaseSignOut(auth);
    } catch {}
    setUser(null);
    localStorage.removeItem('aagrishare_user_active');
    localStorage.removeItem('agrishare_user_active');
  };

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = {
      ...user,
      role: newRole,
    };
    setUser(updated);
    try {
      setDoc(doc(db, 'users', user.id), { role: newRole }, { merge: true });
    } catch {}
  };

  const quickLoginAs = (role: UserRole, customName?: string) => {
    const demoUser: User = {
      id: `demo-${role}`,
      name: customName || (role === 'farmer' ? 'Ramesh Kumar' : role === 'owner' ? 'Baljit Singh' : 'Rajesh Patel'),
      email: `${role}.demo@agrishare.com`,
      phone: '+91 98765 43210',
      role,
      location: 'Morinda Village',
      villageOrDistrict: 'Morinda Village, Rupnagar',
      avatar: '',
      farmDetails: role === 'farmer' ? {
        acres: 45,
        primaryCrops: ['Corn', 'Wheat'],
        soilType: 'Silt Loam',
        irrigationType: 'Canal & Tubewell',
      } : undefined,
      cooperativeName: 'Morinda Kisan Vikas Union',
      rating: 4.95,
      totalTransactions: 18,
      verified: true,
      memberSince: 'March 2024',
    };

    try {
      setDoc(doc(db, 'users', demoUser.id), demoUser, { merge: true });
    } catch {}

    setUser(demoUser);
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!user) return;
    const updated = { ...user, ...updatedData };
    setUser(updated);
    try {
      setDoc(doc(db, 'users', user.id), updatedData, { merge: true });
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        loginWithGoogle,
        signup,
        logout,
        switchRole,
        updateProfile,
        quickLoginAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
