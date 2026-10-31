import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  collection,
  onSnapshot,
  setDoc,
  getDocs,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import appletConfig from '../firebase-applet-config.json';

// Configuration loaded from environment variables with json config fallback
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || appletConfig.measurementId,
  firestoreDatabaseId: import.meta.env.VITE_FIRESTORE_DATABASE_ID || appletConfig.firestoreDatabaseId,
};

// Initialize Firebase App
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// CRITICAL: Initialize Firestore with firestoreDatabaseId from config
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

/**
 * Converts raw Firebase Auth error codes and messages into simple, friendly English.
 */
export function getFriendlyAuthErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code: string = error?.code || '';
  const message: string = error?.message || String(error);

  if (code === 'auth/unauthorized-domain' || message.includes('auth/unauthorized-domain')) {
    return 'This website is not allowed to sign in yet. Please contact support or authorize this domain in Firebase Console → Authentication → Settings → Authorized domains.';
  }
  if (code === 'auth/user-not-found' || message.includes('auth/user-not-found')) {
    return 'No account found with this email or phone. Please check your details or create an account.';
  }
  if (
    code === 'auth/wrong-password' || 
    code === 'auth/invalid-credential' || 
    code === 'auth/invalid-login-credentials' ||
    message.includes('auth/wrong-password') || 
    message.includes('auth/invalid-credential') ||
    message.includes('auth/invalid-login-credentials')
  ) {
    return 'Wrong email or password.';
  }
  if (code === 'auth/email-already-in-use' || message.includes('auth/email-already-in-use')) {
    return 'This account already exists. Please log in instead.';
  }
  if (code === 'auth/weak-password' || message.includes('auth/weak-password')) {
    return 'Password must have at least 6 characters.';
  }
  if (code === 'auth/invalid-email' || message.includes('auth/invalid-email')) {
    return 'Please enter a valid email or phone number.';
  }
  if (code === 'auth/popup-closed-by-user' || message.includes('auth/popup-closed-by-user')) {
    return 'Sign-in window was closed before completing. Please try again.';
  }
  if (code === 'auth/popup-blocked' || message.includes('auth/popup-blocked')) {
    return 'Popup was blocked by your browser. Please allow popups for this site and try again.';
  }
  if (code === 'auth/cancelled-popup-request' || message.includes('auth/cancelled-popup-request')) {
    return 'Sign-in request was cancelled. Please try again.';
  }
  if (code === 'auth/network-request-failed' || message.includes('auth/network-request-failed')) {
    return 'Network connection issue. Please check your internet connection.';
  }
  if (code === 'auth/too-many-requests' || message.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }
  if (code === 'auth/operation-not-allowed' || message.includes('auth/operation-not-allowed')) {
    return 'This sign-in method is currently disabled in Firebase Console.';
  }

  // Strip out "Firebase: Error (auth/...)" wrapper if present
  const cleaned = message.replace(/^Firebase:\s*Error\s*\((auth\/[^)]+)\)\.?/i, '').trim();
  return cleaned || 'Authentication failed. Please check your details and try again.';
}

/**
 * Normalizes user input (email or phone) into a consistent email format for Firebase Auth.
 */
export function normalizePhoneOrEmailToAuthEmail(input: string): { authEmail: string; isPhone: boolean; cleanPhone: string } {
  const trimmed = input.trim();
  if (trimmed.includes('@')) {
    return { authEmail: trimmed.toLowerCase(), isPhone: false, cleanPhone: '' };
  }

  // Extract digits for phone numbers
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length >= 7) {
    return {
      authEmail: `phone_${digits}@agrishare.internal`,
      isPhone: true,
      cleanPhone: trimmed,
    };
  }

  return {
    authEmail: trimmed.toLowerCase(),
    isPhone: false,
    cleanPhone: trimmed,
  };
}

// Standard Firestore Error Handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// CRITICAL: Validate connection to Firestore on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is offline. Checking configuration...");
      return false;
    }
    // Permissions or non-existent document are expected during initial test
    return true;
  }
}

// Trigger connection test on module load
testConnection().catch(() => {});

export {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateFirebaseProfile,
  firebaseSignOut,
  onAuthStateChanged
};
export type { FirebaseUser };
