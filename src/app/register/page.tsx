"use client";

import Link from "next/link";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterSchema, type RegisterFormData } from "@/lib/schemas";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingInput } from "@/components/ui/floating-input";
import { PasswordStrengthBar } from "@/components/ui/password-strength-bar";
import { GlassmorphicSubmitButton } from "@/components/ui/glassmorphic-submit-button";
import { GlassmorphicContainer } from "@/components/ui/glassmorphic-container";
import { Confetti } from "@/components/ui/confetti";
import { UserPlus, Mail, KeyRound, Check, User } from "lucide-react";

const GoogleIcon = () => <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M21.35 11.1h-9.03v2.74h5.39c-.24 1.69-1.64 3.29-3.55 3.29-2.26 0-4.1-1.84-4.1-4.1s1.84-4.1 4.1-4.1c1.08 0 2.06.42 2.82 1.1l2.03-2.03C17.01 6.66 15.13 6 12.96 6c-3.7 0-6.71 3.01-6.71 6.71s3.01 6.71 6.71 6.71c3.46 0 6.42-2.68 6.71-6.08h.01z"></path></svg>;
const AppleIcon = () => <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M17.22 6.53c-.31.02-.6.04-.89.07-.82.03-1.67.13-2.55.33-.81.2-1.6.49-2.35.87-.77.4-1.52.91-2.21 1.55-.65.58-1.21 1.26-1.68 2.03-.47.79-.78 1.64-.92 2.56-.14.9-.09 1.81.11 2.71.21.89.59 1.76 1.12 2.58.52.78 1.18 1.52 1.94 2.13.72.58 1.52 1.07 2.38 1.45.8.35 1.62.59 2.48.71.42.04.84.06 1.26.06.42 0 .83-.02 1.25-.06.9-.12 1.78-.42 2.59-.89.79-.47 1.49-1.08 2.05-1.81.52-.68.9-1.46 1.12-2.31.21-.86.25-1.74.11-2.62-.13-.85-.45-1.67-.93-2.41-.5-.76-1.13-1.43-1.89-1.98-.73-.53-1.55-.93-2.43-1.19-.87-.26-1.78-.39-2.7-.39zm.97-2.18c.3-.38.57-.79.79-1.23.23-.45.4-.92.51-1.41.04-.2.07-.4.09-.61-.07.01-.13.01-.2.01-.72 0-1.44-.12-2.14-.35-.74-.24-1.45-.58-2.08-1.03-.55-.4-.99-.83-1.32-1.28-.06-.08-.11-.16-.15-.25-.01.08-.02.17-.02.25 0 .68.11 1.34.33 1.98.22.66.54 1.29.95 1.87.41.58.91 1.11 1.49 1.57.58.45 1.23.82 1.94 1.1.33.13.67.23 1.01.31.27.05.53.08.8.08.09 0 .17-.01.26-.02z"></path></svg>;

// Staggered animation variants for child elements
const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export default function RegisterPage() {
  const { signUp } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setIsSubmitting(true);
    setIsError(false);
    
    try {
      await signUp(data);
      setIsSuccess(true);
    } catch (error) {
      console.error("Sign up submission error:", error);
      setIsError(true);
      
      // Reset error state after shake animation completes
      setTimeout(() => setIsError(false), 500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-background/80">
      {isSuccess && <Confetti numberOfPieces={150} recycle={false} />}
      
      <GlassmorphicContainer isError={isError}>
        {/* Logo and Title */}
        <motion.div 
          className="flex flex-col items-center mb-8"
          variants={childVariants}
        >
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center mb-4">
            <User className="h-10 w-10 text-accent" />
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Create an Account
          </h1>
          <p className="text-[rgba(255,255,255,0.6)] mt-2 text-center">
            Join DiaDoc and take control of your health journey
          </p>
        </motion.div>

        {isSuccess ? (
          <motion.div 
            className="text-center py-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500/30 to-green-400/30 flex items-center justify-center mx-auto mb-6">
              <Check className="h-10 w-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
            <p className="text-[rgba(255,255,255,0.6)] mb-6">
              Your DiaDoc account has been successfully created.
            </p>
            <Link 
              href="/login" 
              className="text-accent hover:text-primary transition-colors duration-200"
            >
              Continue to Login
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <motion.div variants={childVariants}>
              <FloatingInput
                label="Email"
                type="email"
                {...form.register("email")}
                error={!!form.formState.errors.email}
              />
              {form.formState.errors.email && (
                <p className="text-red-400 text-xs mt-1 ml-1">
                  {form.formState.errors.email.message}
                </p>
              )}
            </motion.div>
            
            <motion.div variants={childVariants}>
              <FloatingInput
                label="Full Name"
                type="text"
                {...form.register("fullName")}
                error={!!form.formState.errors.fullName}
              />
              {form.formState.errors.fullName && (
                <p className="text-red-400 text-xs mt-1 ml-1">
                  {form.formState.errors.fullName.message}
                </p>
              )}
            </motion.div>
            
            <motion.div variants={childVariants}>
              <FloatingInput
                label="Password"
                type="password"
                {...form.register("password")}
                error={!!form.formState.errors.password}
              />
              <PasswordStrengthBar
                password={form.watch("password")}
                className="mt-1"
              />
              {form.formState.errors.password && (
                <p className="text-red-400 text-xs mt-1 ml-1">
                  {form.formState.errors.password.message}
                </p>
              )}
            </motion.div>
            
            <motion.div variants={childVariants}>
              <FloatingInput
                label="Confirm Password"
                type="password"
                {...form.register("confirmPassword")}
                error={!!form.formState.errors.confirmPassword}
              />
              {form.formState.errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 ml-1">
                  {form.formState.errors.confirmPassword.message}
                </p>
              )}
            </motion.div>
            
            <motion.div variants={childVariants}>
              <GlassmorphicSubmitButton
                text={isSubmitting ? "Creating Account..." : "Sign Up"}
                loading={isSubmitting}
                className="w-full mt-2"
              />
            </motion.div>
            
            <motion.div 
              variants={childVariants}
              className="relative flex items-center gap-4 py-2"
            >
              <div className="flex-grow h-px bg-[rgba(255,255,255,0.1)]"></div>
              <span className="text-[rgba(255,255,255,0.4)] text-sm">or continue with</span>
              <div className="flex-grow h-px bg-[rgba(255,255,255,0.1)]"></div>
            </motion.div>
            
            <motion.div variants={childVariants} className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200 text-[rgba(255,255,255,0.8)]"
              >
                <GoogleIcon />
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2.5 px-4 border border-[rgba(255,255,255,0.1)] rounded-lg bg-[rgba(255,255,255,0.03)] hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200 text-[rgba(255,255,255,0.8)]"
              >
                <AppleIcon />
                Apple
              </button>
            </motion.div>
            
            <motion.p variants={childVariants} className="text-center text-[rgba(255,255,255,0.6)] text-sm mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-accent hover:text-primary transition-colors">
                Sign in
              </Link>
            </motion.p>
          </form>
        )}
      </GlassmorphicContainer>
    </div>
  );
}
