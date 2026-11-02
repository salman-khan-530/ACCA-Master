import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, firestore, isFirebaseConfigured } from '../services/firebase';
import { dbService } from '../services/dbService';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbSendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile as fbUpdateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  isFirebaseActive: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, selectedPapers?: string[]) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfileDetails: (updates: Partial<UserProfile>) => Promise<void>;
  loginDemoStudent: () => Promise<void>;
  loginDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_PROFILE_KEY = 'acca_master_active_user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_USER_PROFILE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync state changes to local cache for offline/instant resume
  useEffect(() => {
    if (userProfile) {
      localStorage.setItem(CURRENT_USER_PROFILE_KEY, JSON.stringify(userProfile));
    } else {
      localStorage.removeItem(CURRENT_USER_PROFILE_KEY);
    }
  }, [userProfile]);

  useEffect(() => {
    if (isFirebaseConfigured() && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setCurrentUser(fbUser);
        if (fbUser) {
          try {
            if (firestore) {
              const docRef = doc(firestore, 'users', fbUser.uid);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                setUserProfile(docSnap.data() as UserProfile);
              } else {
                // Initial profile creation in Firestore
                const newProfile: UserProfile = {
                  uid: fbUser.uid,
                  email: fbUser.email || '',
                  displayName: fbUser.displayName || 'ACCA Scholar',
                  role: 'student', // Always default to student!
                  selectedPapers: ['fa1'],
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                  leaderboardOptIn: true,
                  status: 'active',
                };
                await setDoc(docRef, newProfile);
                setUserProfile(newProfile);
              }
            }
          } catch (err) {
            console.error('Error fetching Firestore user profile:', err);
          }
        } else {
          // If logged out from Firebase
          setUserProfile(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // In local mode, if no active profile, default to demo student for an immediate rich experience
      if (!userProfile) {
        const localUsers = JSON.parse(localStorage.getItem('acca_master_users') || '[]');
        const demoStudent = localUsers.find((u: UserProfile) => u.uid === 'demo-student-id') || null;
        setUserProfile(demoStudent);
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string): Promise<void> => {
    if (isFirebaseConfigured() && auth) {
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      // Local mode authentication
      const localUsers: UserProfile[] = JSON.parse(localStorage.getItem('acca_master_users') || '[]');
      const user = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('No account found with this email address. Please register.');
      }
      if (user.status === 'inactive') {
        throw new Error('This account has been deactivated. Please contact support.');
      }
      setUserProfile(user);
    }
  };

  const register = async (name: string, email: string, pass: string, selectedPapers: string[] = ['fa1']): Promise<void> => {
    if (isFirebaseConfigured() && auth) {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await fbUpdateProfile(cred.user, { displayName: name });
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        email: email.toLowerCase(),
        displayName: name,
        role: 'student', // Security rule: always student on registration
        selectedPapers,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        leaderboardOptIn: true,
        status: 'active',
      };
      if (firestore) {
        await setDoc(doc(firestore, 'users', cred.user.uid), newProfile);
      }
      setUserProfile(newProfile);
    } else {
      // Local mode registration
      const localUsers: UserProfile[] = JSON.parse(localStorage.getItem('acca_master_users') || '[]');
      if (localUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email address already exists.');
      }
      const newProfile: UserProfile = {
        uid: `user-${Date.now()}`,
        email: email.toLowerCase(),
        displayName: name,
        role: 'student',
        selectedPapers,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        leaderboardOptIn: true,
        status: 'active',
      };
      localUsers.push(newProfile);
      localStorage.setItem('acca_master_users', JSON.stringify(localUsers));
      setUserProfile(newProfile);
    }
  };

  const logout = async (): Promise<void> => {
    if (isFirebaseConfigured() && auth) {
      await fbSignOut(auth);
    }
    setUserProfile(null);
    setCurrentUser(null);
  };

  const resetPassword = async (email: string): Promise<void> => {
    if (isFirebaseConfigured() && auth) {
      await fbSendPasswordResetEmail(auth, email);
    } else {
      // In local mode, simulate a successful password reset email notification
      const localUsers: UserProfile[] = JSON.parse(localStorage.getItem('acca_master_users') || '[]');
      const user = localUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error('No account found with this email address.');
      }
    }
  };

  const updateProfileDetails = async (updates: Partial<UserProfile>): Promise<void> => {
    if (!userProfile) return;
    const updated: UserProfile = { ...userProfile, ...updates, updatedAt: new Date().toISOString() };
    await dbService.updateUserProfile(userProfile.uid, updates);
    setUserProfile(updated);
  };

  const loginDemoStudent = async (): Promise<void> => {
    const localUsers: UserProfile[] = JSON.parse(localStorage.getItem('acca_master_users') || '[]');
    const demoStudent = localUsers.find((u) => u.uid === 'demo-student-id');
    if (demoStudent) {
      setUserProfile(demoStudent);
    }
  };

  const loginDemoAdmin = async (): Promise<void> => {
    const localUsers: UserProfile[] = JSON.parse(localStorage.getItem('acca_master_users') || '[]');
    const demoAdmin = localUsers.find((u) => u.uid === 'demo-admin-id');
    if (demoAdmin) {
      setUserProfile(demoAdmin);
    }
  };

  const isAdmin = userProfile?.role === 'admin';
  const isStudent = userProfile?.role === 'student';
  const isFirebaseActive = isFirebaseConfigured();

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        isStudent,
        isFirebaseActive,
        login,
        register,
        logout,
        resetPassword,
        updateProfileDetails,
        loginDemoStudent,
        loginDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
