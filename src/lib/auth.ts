"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from './firebase';
import toast from 'react-hot-toast';

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Invalid email or password.",
  "auth/email-already-in-use": "This email is already registered.",
  "auth/weak-password": "Password is too weak (min 6 characters).",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/too-many-requests": "Too many attempts. Try again later.",
  "auth/network-request-failed": "Network error. Please check your internet.",
};

const getAuthErrorMessage = (errorCode: string): string => {
  return AUTH_ERROR_MESSAGES[errorCode] || "Authentication failed. Please try again.";
};

type User = {
  uid: string;
  email: string;
  role: "admin" | "user";
};

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const role: "admin" | "user" = email.includes("admin") ? "admin" : "user";
      
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role
      };
      
      setUser(userData);
      toast.success('Login successful!');
      return userData;
    } catch (error: any) {
      const friendlyMessage = getAuthErrorMessage(error.code);
      toast.error(friendlyMessage);
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const role: "admin" | "user" = email.includes("admin") ? "admin" : "user";
      
      const userData: User = {
        uid: firebaseUser.uid,
        email: firebaseUser.email!,
        role
      };
      
      setUser(userData);
      toast.success('Registration successful!');
      return userData;
    } catch (error: any) {
      const friendlyMessage = getAuthErrorMessage(error.code);
      toast.error(friendlyMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      toast.success('Logged out successfully!');
      router.push('/login');
    } catch (error: any) {
      const friendlyMessage = getAuthErrorMessage(error.code);
      toast.error(friendlyMessage);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const role: "admin" | "user" = firebaseUser.email?.includes("admin") ? "admin" : "user";
        
        const userData: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email!,
          role
        };
        
        setUser(userData);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading, login, register, logout };
};
