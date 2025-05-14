
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Key } from "lucide-react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/schemas";
import { useAuth } from "@/providers/auth-provider";
import { useState } from "react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { duration: 0.5, ease: "easeOut" } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i:number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: "easeOut" },
  }),
};

export default function ForgotPasswordPage() {
  const { sendPasswordReset } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      await sendPasswordReset(data);
      setSubmitted(true); 
    } catch (error) {
      // Error is handled by toast in useAuth
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="shadow-2xl border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden">
          <CardHeader className="space-y-2 text-center pt-10 pb-8 bg-gradient-to-b from-primary/10 to-transparent">
            <motion.div custom={0} variants={itemVariants}>
              <Mail className="mx-auto h-16 w-16 text-primary mb-4 animate-bounce" />
            </motion.div>
            <motion.div custom={1} variants={itemVariants}>
              <CardTitle className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                Check Your Email
              </CardTitle>
            </motion.div>
            <motion.div custom={2} variants={itemVariants}>
              <CardDescription className="text-md pt-1 text-muted-foreground">
                If an account with that email exists, we&apos;ve sent a password reset link.
              </CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent className="px-8 pb-10 text-center">
            <motion.div custom={3} variants={itemVariants}>
              <Link href="/login">
                <Button className="w-full sm:w-auto h-12 text-lg shadow-lg hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground">
                  Back to Sign In
                </Button>
              </Link>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="shadow-2xl border-primary/30 bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardHeader className="space-y-2 text-center pt-10 pb-8 bg-gradient-to-b from-primary/10 to-transparent">
          <motion.div custom={0} variants={itemVariants}>
            <Key className="mx-auto h-16 w-16 text-primary mb-4 animate-pulse" />
          </motion.div>
          <motion.div custom={1} variants={itemVariants}>
            <CardTitle className="text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
              Forgot Password?
            </CardTitle>
          </motion.div>
          <motion.div custom={2} variants={itemVariants}>
            <CardDescription className="text-md pt-1 text-muted-foreground">
              Enter your email and we&apos;ll send a reset link.
            </CardDescription>
          </motion.div>
        </CardHeader>
        <CardContent className="space-y-6 px-8 pb-10">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <motion.div custom={3} variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Email Address</FormLabel>
                      <FormControl>
                        <Input id="email" type="email" placeholder="your.email@example.com" {...field} className="h-12 text-base focus:ring-2 focus:ring-accent/70 transition-shadow hover:shadow-md shadow-sm border-input/70"/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              <motion.div custom={4} variants={itemVariants}>
                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg shadow-lg hover:shadow-primary/40 active:scale-[0.98] transition-all duration-200 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : <><Mail className="mr-2 h-5 w-5" /> Send Reset Link</>}
                </Button>
              </motion.div>
            </form>
          </Form>
          <motion.p custom={5} variants={itemVariants} className="mt-8 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/login" prefetch={false} className="font-medium text-primary hover:underline hover:text-accent transition-colors">
              Sign in
            </Link>
          </motion.p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
