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
import React, { createContext, useContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  profile: { displayName: string; email: string; role: string } | null;
  loading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      await signInWithPopup(auth, provider);
    } catch (err: unknown) {
      console.error('Login error:', err);

      let message = 'Login failed. Please try again.';

      if (typeof err === 'object' && err !== null && 'code' in err) {
        const code = String(err.code);

        if (code === 'auth/popup-blocked') {
          message = 'Popup blocked. Please allow popups for this site.';
        } else if (
          code === 'auth/cancelled-popup-request' ||
          code === 'auth/popup-closed-by-user'
        ) {
          message = 'Login was cancelled.';
        } else if (code === 'auth/unauthorized-domain') {
          message = `Domain not authorized. Add ${window.location.hostname} in Firebase Authorized Domains.`;
        }
      }

      if (
        message === 'Login failed. Please try again.' &&
        typeof err === 'object' &&
        err !== null &&
        'message' in err &&
        typeof err.message === 'string'
      ) {
        message = err.message;
      }

      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    await signOut(auth);
  };

  const clearError = () => setError(null);

  const profile = user
    ? {
        displayName: user.displayName ?? '',
        email: user.email ?? '',
        role: 'User',
      }
    : null;

  return (
    <AuthContext.Provider value={{ user, profile, loading, error, signIn, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
