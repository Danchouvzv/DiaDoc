"use client";

import type { User } from "firebase/auth";
import { onAuthStateChanged, signOut as firebaseSignOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail as firebaseSendPasswordResetEmail, updateProfile } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/firebase";
import type { LoginFormData, RegisterFormData, ForgotPasswordFormData } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (data: LoginFormData) => Promise<User | null>;
  signUp: (data: RegisterFormData) => Promise<User | null>;
  signOut: () => Promise<void>;
  sendPasswordReset: (data: ForgotPasswordFormData) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signIn = async (data: LoginFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      toast({ title: "Login Successful", description: "Welcome back!" });
      router.push("/dashboard");
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast({ variant: "destructive", title: "Login Failed", description: error.message || "An unexpected error occurred." });
      return null;
    }
  };

  const signUp = async (data: RegisterFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateProfile(userCredential.user, { displayName: data.fullName });
      // Re-fetch user to get displayName (or rely on onAuthStateChanged)
      setUser({ ...userCredential.user, displayName: data.fullName }); 
      toast({ title: "Registration Successful", description: "Your account has been created." });
      router.push("/dashboard");
      return userCredential.user;
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast({ variant: "destructive", title: "Registration Failed", description: error.message || "An unexpected error occurred." });
      return null;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      toast({ title: "Logged Out", description: "You have been successfully logged out." });
      router.push("/login");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast({ variant: "destructive", title: "Logout Failed", description: error.message || "An unexpected error occurred." });
    }
  };
  
  const sendPasswordReset = async (data: ForgotPasswordFormData) => {
    try {
      await firebaseSendPasswordResetEmail(auth, data.email);
      toast({ title: "Password Reset Email Sent", description: "Check your inbox for a password reset link." });
    } catch (error: any)
    {
      console.error("Password reset error:", error);
      toast({ variant: "destructive", title: "Password Reset Failed", description: error.message || "An unexpected error occurred." });
      throw error; // Re-throw to allow form to handle it if needed
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, sendPasswordReset }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
