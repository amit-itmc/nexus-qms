// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
// import { doc, getDoc, setDoc } from 'firebase/firestore';
// import { auth, db } from '../lib/firebase';
// import { UserProfile } from '../types';

// interface AuthContextType {
//   user: User | null;
//   profile: UserProfile | null;
//   loading: boolean;
//   error: string | null;
//   signIn: () => Promise<void>;
//   logout: () => Promise<void>;
//   clearError: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       setUser(user);
//       if (user) {
//         const docRef = doc(db, 'users', user.uid);
//         const docSnap = await getDoc(docRef);
        
//         if (docSnap.exists()) {
//           setProfile(docSnap.data() as UserProfile);
//         } else {
//           // Create a default profile for new users
//           const newProfile: UserProfile = {
//             id: user.uid,
//             email: user.email || '',
//             displayName: user.displayName || '',
//             role: 'User',
//             createdAt: new Date()
//           };
//           await setDoc(docRef, newProfile);
//           setProfile(newProfile);
//         }
//       } else {
//         setProfile(null);
//       }
//       setLoading(false);
//     });

//     return unsubscribe;
//   }, []);

//   const signIn = async () => {
//     setError(null);
//     try {
//       const provider = new GoogleAuthProvider();
//       // Ensure cross-origin is handled in iframe
//       provider.setCustomParameters({ prompt: 'select_account' });
//       await signInWithPopup(auth, provider);
//     } catch (err: any) {
//       console.error("Login Hub Error:", err);
//       let message = "Login failed. Please try again.";
      
//       if (err.code === 'auth/popup-blocked') {
//         message = "Popup blocked! Please allow popups for this site.";
//       } else if (err.code === 'auth/cancelled-popup-request' || err.code === 'auth/popup-closed-by-user') {
//         message = "Login was cancelled.";
//       } else if (err.code === 'auth/unauthorized-domain') {
//         message = `Domain not authorized. Please add ${window.location.hostname} to Firebase Authorized Domains.`;
//       } else {
//         message = err.message || message;
//       }
      
//       setError(message);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const clearError = () => setError(null);

//   return (
//     <AuthContext.Provider value={{ user, profile, loading, error, signIn, logout, clearError }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }
import { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { initializeApp } from "firebase/app";

// 🔥 make sure this is YOUR config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "client-af507.firebaseapp.com",
  projectId: "client-af507",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext<any>(null);

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state:", user); // 🔍 debug
      setUser(user);
      setLoading(false); // ✅ IMPORTANT
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);