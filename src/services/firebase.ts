import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, User as FirebaseUser, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, onSnapshot, Unsubscribe } from 'firebase/firestore';

export interface FirebaseConfigParams {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

const FB_CONFIG_STORAGE_KEY = 'pulseflow_custom_firebase_config';

export function getSavedFirebaseConfig(): FirebaseConfigParams | null {
  try {
    const raw = localStorage.getItem(FB_CONFIG_STORAGE_KEY) || localStorage.getItem('synctrack_custom_firebase_config');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to parse saved Firebase config', e);
  }

  // Check Vite environment variables
  if (import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
      appId: import.meta.env.VITE_FIREBASE_APP_ID || ''
    };
  }

  return null;
}

export function saveCustomFirebaseConfig(config: FirebaseConfigParams | null): void {
  if (!config) {
    localStorage.removeItem(FB_CONFIG_STORAGE_KEY);
    localStorage.removeItem('synctrack_custom_firebase_config');
  } else {
    localStorage.setItem(FB_CONFIG_STORAGE_KEY, JSON.stringify(config));
  }
}

class FirebaseService {
  app: FirebaseApp | null = null;
  auth: Auth | null = null;
  db: Firestore | null = null;
  isConfigured: boolean = false;

  constructor() {
    this.init();
  }

  init(): boolean {
    const config = getSavedFirebaseConfig();
    if (!config || !config.apiKey || !config.projectId) {
      this.isConfigured = false;
      return false;
    }

    try {
      const apps = getApps();
      this.app = apps.length ? apps[0] : initializeApp(config);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);
      this.isConfigured = true;
      return true;
    } catch (err) {
      console.error('Firebase initialization error:', err);
      this.isConfigured = false;
      return false;
    }
  }

  async signInWithGoogle(): Promise<FirebaseUser | null> {
    if (!this.auth) {
      throw new Error('Firebase Auth is not configured. Using Demo Account mode.');
    }
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    return result.user;
  }

  async signOut(): Promise<void> {
    if (this.auth) {
      await fbSignOut(this.auth);
    }
  }

  // Real-time Cloud Sync to Firestore
  async syncUserData(userId: string, data: Record<string, any>): Promise<void> {
    if (!this.db || !this.isConfigured) return;
    try {
      const userDocRef = doc(this.db, 'users', userId);
      await setDoc(userDocRef, { ...data, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn('Firestore sync failed, local state preserved:', err);
    }
  }

  // Real-time listener for multi-device sync
  listenToUserData(userId: string, onUpdate: (data: any) => void): Unsubscribe | null {
    if (!this.db || !this.isConfigured) return null;
    try {
      const userDocRef = doc(this.db, 'users', userId);
      return onSnapshot(userDocRef, (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data());
        }
      }, (err) => {
        console.warn('Firestore snapshot error:', err);
      });
    } catch (err) {
      console.warn('Failed to attach Firestore snapshot listener:', err);
      return null;
    }
  }

  // Real-time Duo Collaboration Room
  async syncDuoRoom(pairCode: string, payload: Record<string, any>): Promise<void> {
    if (!this.db || !this.isConfigured) return;
    try {
      const roomRef = doc(this.db, 'duo_rooms', pairCode);
      await setDoc(roomRef, { ...payload, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      console.warn('Duo room sync failed:', err);
    }
  }

  listenToDuoRoom(pairCode: string, onUpdate: (data: any) => void): Unsubscribe | null {
    if (!this.db || !this.isConfigured) return null;
    try {
      const roomRef = doc(this.db, 'duo_rooms', pairCode);
      return onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
          onUpdate(snapshot.data());
        }
      }, (err) => {
        console.warn('Duo room listener error:', err);
      });
    } catch (err) {
      console.warn('Failed to listen to duo room:', err);
      return null;
    }
  }
}

export const firebaseService = new FirebaseService();
