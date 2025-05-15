"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowRight,
  CheckCircle,
  Zap,
  Star,
  Activity,
  Layers,
  Shield,
  Heart,
  Moon,
  Sun
} from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import React, { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue, useSpring } from "framer-motion";

// Animation variants
const fadeInUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.8, 
      delay, 
      ease: [0.22, 1, 0.36, 1] 
    } 
  }
});

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

// Fix the floating animation
const floatingAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [-12, 0, -12],
    transition: { 
      repeat: Infinity, 
      repeatType: "mirror" as const, 
      duration: 3, 
      ease: "easeInOut" 
    } 
  }
};

// Enhanced feature slides with more appealing images and richer descriptions
const featureSlides = [
  {
    imageSrc: "https://images.unsplash.com/photo-1576402187878-974f70c890a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageHint: "healthy food with smartphone app",
    title: "AI-Powered Food Logging",
    description: "Snap a photo or describe your meal, and our advanced AI instantly calculates precise nutritional content, helping you make informed dietary choices.",
    icon: <Zap className="h-6 w-6 text-primary" />,
    color: "from-blue-500/20 to-cyan-400/20"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageHint: "fitness tracking with smartwatch",
    title: "Seamless Activity Tracking",
    description: "Automatically sync with your favorite devices to track workouts, steps, and daily activities to understand how they affect your glucose levels and overall health.",
    icon: <Activity className="h-6 w-6 text-green-500" />,
    color: "from-green-500/20 to-emerald-400/20"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1579684288375-d31f9722a58d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageHint: "health metrics on digital dashboard",
    title: "Comprehensive Health Metrics",
    description: "Monitor glucose levels, sleep quality, stress, and other vital health indicators in one intuitive dashboard with real-time alerts and predictive insights.",
    icon: <Layers className="h-6 w-6 text-accent" />,
    color: "from-accent/20 to-sky-400/20"
  },
];

const benefitSlides = [
 {
    imageSrc: "https://images.unsplash.com/photo-1633613286991-611fe299c4be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageHint: "AI health analysis and insights",
    title: "Personalized AI Insights",
    description: "Our advanced AI analyzes your unique health patterns to deliver personalized recommendations that help prevent glucose spikes and optimize your wellness routine.",
    icon: <Star className="h-6 w-6 text-amber-500" />,
    color: "from-amber-500/20 to-orange-400/20"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1554224155-8d04cb21ed6c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageHint: "detailed health reports and trends",
    title: "Detailed Progress Reports",
    description: "Visualize your health journey with beautiful charts and comprehensive reports that you can easily share with healthcare providers for better collaborative care.",
    icon: <Shield className="h-6 w-6 text-purple-500" />,
    color: "from-purple-500/20 to-indigo-400/20"
  },
  {
    imageSrc: "https://images.unsplash.com/photo-1560438718-eb61ede255eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    imageHint: "empowered living with health tech",
    title: "Empower Your Wellbeing",
    description: "Join a supportive community and access personalized educational resources that help you make confident decisions about your health every day.",
    icon: <Heart className="h-6 w-6 text-red-500" />,
    color: "from-red-500/20 to-rose-400/20"
  },
];

export default function LandingPage() {
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  );

  // Theme state
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  // Toggle theme function
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };
  
  // Set theme class on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Mouse movement tracking for parallax effects
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  
  // Create springy mouse values for smoother motion
  const springX = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  const springY = useSpring(useMotionValue(0), { stiffness: 50, damping: 20 });
  
  useEffect(() => {
    // Update spring values when mouse moves
    springX.set(mousePosition.x / 40); // Divide to reduce sensitivity
    springY.set(mousePosition.y / 40);
  }, [mousePosition, springX, springY]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroBgY = useTransform(heroScrollYProgress, [0, 1], ["0%", "25%"]);
  const heroOpacity = useTransform(heroScrollYProgress, [0, 0.8], [1, 0.3]);
  const heroScale = useTransform(heroScrollYProgress, [0, 0.8], [1, 1.1]);

  // Define floating shapes for the hero background
  const shapes = [
    { size: 60, color: "accent", delay: 0, top: "15%", left: "10%" },
    { size: 80, color: "primary", delay: 1, top: "60%", left: "5%" },
    { size: 50, color: "accent", delay: 2, top: "20%", left: "85%" },
    { size: 70, color: "primary", delay: 0.5, top: "75%", left: "80%" },
    { size: 40, color: "accent", delay: 1.5, top: "40%", left: "50%" },
  ];

  useEffect(() => {
    // Add advanced animations
    const styleSheetContent = `
      @keyframes pulse-slow {
        0%, 100% { opacity: 0.5; transform: scale(1); filter: brightness(0.95) blur(2px); }
        50% { opacity: 0.7; transform: scale(1.03); filter: brightness(1) blur(0); }
      }
      .animate-pulse-slow {
        animation: pulse-slow 12s infinite cubic-bezier(0.4, 0, 0.6, 1);
      }
      
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-15px); }
      }
      .animate-float {
        animation: float 8s infinite ease-in-out;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .animate-shimmer {
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
        background-size: 200% 100%;
        animation: shimmer 8s infinite linear;
      }
    `;
    
    if (typeof window !== 'undefined') {
      if (!document.getElementById('advanced-animations-style')) {
        const styleElement = document.createElement("style");
        styleElement.id = 'advanced-animations-style';
        styleElement.type = "text/css";
        styleElement.innerText = styleSheetContent;
        document.head.appendChild(styleElement);
      }
    }
  }, []);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="dark:bg-gray-900 bg-gray-50 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-gray-900/70 border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-white font-bold text-lg mr-2">
                  D
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">DiaDoc</span>
              </div>
              <div className="flex items-center space-x-3">
                {/* Theme toggle button */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {isDarkMode ? (
                    <Sun size={18} className="transition-all" />
                  ) : (
                    <Moon size={18} className="transition-all" />
                  )}
                </button>
                
                <Link href="/login">
                  <Button variant="outline" className="border-primary/20 text-primary hover:bg-primary/10 hover:text-primary/90">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-md hover:shadow-lg transition-all duration-200">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section 
          ref={heroRef}
          className="relative py-24 md:py-32 lg:py-44 bg-background text-center overflow-hidden"
        >
          {/* Background image with parallax effect */}
          <motion.div 
            style={{ 
              y: heroBgY, 
              opacity: heroOpacity, 
              scale: heroScale 
            }} 
            className="absolute inset-0 z-0"
          >
            <Image 
              src="/medical-diabetes-bg.png" 
              alt="Diabetes medical background" 
              fill
              sizes="100vw"
              quality={100}
              priority
              className="object-cover opacity-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent" />
          </motion.div>
          
          {/* Floating shapes that react to mouse movement */}
          {shapes.map((shape, index) => (
            <motion.div
              key={index}
              style={{
                x: springX,
                y: springY,
                width: `${shape.size}px`,
                height: `${shape.size}px`,
                top: shape.top,
                left: shape.left,
                backgroundColor: `hsl(var(--${shape.color}))`,
                transform: `translateX(calc(-50% + ${index % 2 === 0 ? '-' : ''}5px)) translateY(calc(-50% + ${index % 3 === 0 ? '-' : ''}5px))`,
              }}
              custom={index}
              variants={fadeInUp(0.5 + index * 0.1)}
              initial="hidden"
              animate="visible"
              className="absolute rounded-full blur-xl opacity-30 z-0"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 4 + index,
                  repeat: Infinity,
                  delay: shape.delay,
                }}
                className="w-full h-full rounded-full"
              />
            </motion.div>
          ))}
          
          <div className="container relative px-4 md:px-6 z-10">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto"
            >
              <motion.div
                variants={fadeInUp(0.2)}
                className="mb-4 inline-block"
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                  The Smart Diabetes Companion
                </span>
              </motion.div>
              
              <motion.h1 
                variants={fadeInUp(0.3)}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground mb-6"
              >
                Take <span className="text-primary font-bold">Control</span> of Your Health
              </motion.h1>
              
              <motion.p 
                variants={fadeInUp(0.4)}
                className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-white font-medium drop-shadow-lg bg-primary/10 backdrop-blur-sm p-4 rounded-lg"
              >
                DiaDoc is your personal diabetes companion, empowering you with AI-driven insights and intuitive tools to manage your health journey effortlessly.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp(0.5)}
                className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-5"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 25px rgba(0, 163, 255, 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button 
                    size="lg" 
                    asChild 
                    className="w-full sm:w-auto text-lg px-8 py-6 shadow-lg bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white transition-all duration-300 rounded-xl"
                  >
                    <Link href="/register">Get Started Free</Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 15px rgba(0, 221, 255, 0.3)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto mt-4 sm:mt-0"
                >
                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild 
                    className="w-full sm:w-auto text-lg px-8 py-6 shadow-md border-[1.5px] border-primary/30 hover:border-accent/50 hover:bg-primary/5 transition-all duration-300 rounded-xl"
                  >
                    <Link href="#features">Learn More</Link>
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Update the floating motion divs to use the new animation format */}
              <motion.div
                variants={fadeInUp(0.7)}
                className="mt-16 flex justify-center space-x-8"
              >
                <motion.div 
                  initial="initial"
                  animate="animate"
                  variants={floatingAnimation}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-2">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">Track Health</span>
                </motion.div>
                
                <motion.div 
                  initial="initial"
                  animate="animate"
                  variants={floatingAnimation}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-2">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <span className="text-sm text-muted-foreground">AI Insights</span>
                </motion.div>
                
                <motion.div 
                  initial="initial"
                  animate="animate"
                  variants={floatingAnimation}
                  transition={{ delay: 1.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-2">
                    <Heart className="h-6 w-6 text-green-500" />
                  </div>
                  <span className="text-sm text-muted-foreground">Live Better</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
          
          {/* Subtle wave divider */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
          <svg className="absolute bottom-0 left-0 right-0 text-background fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 60">
            <path d="M0,0V60H1440V0C1280,40 1120,60 960,60C800,60 640,40 480,40C320,40 160,60 0,0Z" />
          </svg>
        </motion.section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-28 bg-background relative overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-primary/5 to-primary/10 blur-3xl opacity-60" />
            <div className="absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-accent/5 to-accent/10 blur-3xl opacity-50" />
            <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-green-500/5 to-green-500/10 blur-3xl opacity-50" />
          </div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16 md:mb-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-accent/10 text-accent border border-accent/20">
                  Powerful Features
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-4">
                Discover DiaDoc <span className="text-primary">Features</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Everything you need for smarter health management, beautifully designed and easy to use.
              </p>
            </motion.div>
            
            <Carousel
              opts={{ align: "start", loop: true }}
              plugins={[autoplayPlugin.current]}
              onMouseEnter={autoplayPlugin.current.stop}
              onMouseLeave={autoplayPlugin.current.reset}
              className="w-full max-w-5xl mx-auto"
            >
              <CarouselContent>
                {featureSlides.map((slide, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3 cursor-pointer">
                    <motion.div
                      initial={{ opacity: 0, y: 50, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.7, delay: index * 0.15 }}
                      className="p-2 h-full"
                    >
                      <motion.div
                        whileHover={{ 
                          y: -12,
                          scale: 1.03, 
                          boxShadow: "0px 15px 40px -10px rgba(0, 0, 0, 0.2)" 
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="h-full rounded-2xl bg-gradient-to-br from-background to-background border border-border/70 overflow-hidden relative group"
                      >
                        {/* Color overlay that appears on hover */}
                        <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"
                          style={{ 
                            background: `linear-gradient(135deg, ${slide.color})`,
                          }}
                        />
                        
                        {/* Card content */}
                        <div className="flex flex-col h-full">
                          <div className="relative h-52 overflow-hidden">
                            <Image
                              src={slide.imageSrc}
                              alt={slide.title}
                              fill
                              sizes="(max-width: 768px) 100vw, 33vw"
                              className="object-cover transition-all duration-700 group-hover:scale-110"
                              data-ai-hint={slide.imageHint}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40 group-hover:opacity-30 transition-opacity" />
                            
                            {/* Icon overlay */}
                            <motion.div 
                              className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br p-0.5 shadow-lg"
                              style={{ 
                                background: `linear-gradient(135deg, ${slide.color})`,
                              }}
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              <div className="h-full w-full rounded-full bg-background/90 flex items-center justify-center">
                                {slide.icon}
                              </div>
                            </motion.div>
                          </div>
                          
                          <div className="p-6 flex-grow flex flex-col">
                            <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                              {slide.title}
                            </h3>
                            <p className="text-base text-muted-foreground flex-grow">
                              {slide.description}
                            </p>
                            
                            <motion.div 
                              className="mt-4 inline-flex items-center text-primary group-hover:text-accent transition-colors"
                              whileHover={{ x: 5 }}
                            >
                              <span className="mr-2 font-medium">Learn more</span>
                              <ArrowRight className="h-4 w-4" />
                            </motion.div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-[-20px] sm:left-[-50px] bg-background border border-border hover:bg-accent/5 hover:border-accent/50 transition-colors" />
              <CarouselNext className="right-[-20px] sm:right-[-50px] bg-background border border-border hover:bg-accent/5 hover:border-accent/50 transition-colors" />
            </Carousel>
            
            {/* Additional indicators for carousel */}
            <div className="flex justify-center mt-12 gap-2">
              {featureSlides.map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-2 h-2 rounded-full bg-muted"
                  whileHover={{ scale: 1.5, backgroundColor: "hsl(var(--primary))" }}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 md:py-28 relative overflow-hidden">
          {/* Background with gradient and texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background">
            <div className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />
          </div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16 md:mb-20"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20">
                  Your Health Journey
                </span>
              </motion.div>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-4">
                Unlock Your Health <span className="text-accent">Potential</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Go beyond tracking. Gain understanding and achieve your wellness goals with powerful AI capabilities.
              </p>
            </motion.div>
            
            {/* Benefits cards with enhanced animations */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {benefitSlides.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.7, 
                      delay: index * 0.1,
                      ease: [0.22, 1, 0.36, 1]
                    }
                  }}
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <motion.div 
                    className="h-full rounded-2xl border border-border/50 overflow-hidden group"
                    whileHover={{ 
                      y: -10, 
                      boxShadow: "0 20px 40px -15px rgba(0,0,0,0.2)",
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={benefit.imageSrc}
                        alt={benefit.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:filter group-hover:brightness-110"
                        data-ai-hint={benefit.imageHint}
                      />
                      
                      {/* Overlay with gradient that changes on hover */}
                      <div 
                        className="absolute inset-0 opacity-60 group-hover:opacity-70 transition-opacity duration-500"
                        style={{ 
                          background: `linear-gradient(to bottom, transparent, ${benefit.color})` 
                        }}
                      />
                      
                      {/* Animated icon */}
                      <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/90 shadow-lg flex items-center justify-center"
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 10 }}
                      >
                        {React.cloneElement(benefit.icon, { className: 'h-8 w-8' })}
                      </motion.div>
                    </div>
                    
                    <div className="p-6 bg-card">
                      <h3 className="text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
                        {benefit.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {benefit.description}
                      </p>
                      
                      {/* Interactive button that appears on hover */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-5"
                      >
                        <motion.button
                          className="group/btn inline-flex items-center text-sm font-medium text-primary hover:text-accent transition-colors"
                          whileHover={{ x: 5 }}
                        >
                          <span className="mr-2">Explore feature</span>
                          <svg 
                            className="w-4 h-4 transition-transform duration-200 group-hover/btn:translate-x-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
            
            {/* Added stats section */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center"
            >
              {[
                { value: "10K+", label: "Active Users", color: "primary" },
                { value: "87%", label: "Improved Control", color: "accent" },
                { value: "24/7", label: "Health Monitoring", color: "green-500" },
                { value: "15M+", label: "Data Points Analyzed", color: "amber-500" },
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="flex flex-col items-center"
                >
                  <motion.span 
                    className={`text-4xl md:text-5xl font-bold mb-2 text-${stat.color}`}
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: index }}
                  >
                    {stat.value}
                  </motion.span>
                  <span className="text-muted-foreground text-sm md:text-base">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-28 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <svg className="absolute top-0 right-0 h-full text-primary opacity-[0.02]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.9997 0L14.9996 8.99991H24L16.4995 14.4998L19.4994 23.4997L11.9997 17.9998L4.50106 23.4997L7.49998 14.4998L0 8.99991H9.00053L11.9997 0Z"></path>
            </svg>
            <svg className="absolute bottom-0 left-0 h-full text-accent opacity-[0.02] transform rotate-180" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.9997 0L14.9996 8.99991H24L16.4995 14.4998L19.4994 23.4997L11.9997 17.9998L4.50106 23.4997L7.49998 14.4998L0 8.99991H9.00053L11.9997 0Z"></path>
            </svg>
          </div>
          
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 mb-4 inline-block">
                Success Stories
              </span>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mt-4">
                Hear from our <span className="text-accent">Community</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
                Real stories from people who transformed their health journey with DiaDoc.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                {
                  quote: "DiaDoc completely changed how I manage my condition. The AI insights helped me identify patterns I never noticed before.",
                  author: "Alex Thompson",
                  role: "Type 1 Diabetes, Using DiaDoc for 8 months",
                  avatar: "https://randomuser.me/api/portraits/men/32.jpg"
                },
                {
                  quote: "The food logging is so easy - just snap a photo and it calculates everything! My glucose levels have never been more stable.",
                  author: "Sarah Williams",
                  role: "Type 2 Diabetes, Using DiaDoc for 1 year",
                  avatar: "https://randomuser.me/api/portraits/women/44.jpg"
                },
                {
                  quote: "As a doctor, I recommend DiaDoc to all my diabetes patients. The detailed reports help us make better treatment decisions together.",
                  author: "Dr. Michael Chen",
                  role: "Endocrinologist, Healthcare Provider",
                  avatar: "https://randomuser.me/api/portraits/men/46.jpg"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div 
                    className="bg-card border border-border/50 p-6 rounded-2xl h-full flex flex-col relative"
                    whileHover={{ 
                      y: -10, 
                      boxShadow: "0 15px 30px -10px rgba(0,0,0,0.1)"
                    }}
                  >
                    <svg className="text-primary/20 mb-4 h-8 w-8" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                    
                    <p className="text-foreground italic mb-6 flex-grow">"{testimonial.quote}"</p>
                    
                    <div className="flex items-center mt-4">
                      <Image 
                        src={testimonial.avatar} 
                        alt={testimonial.author}
                        width={48}
                        height={48}
                        className="rounded-full mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Background with gradient animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-95 z-0 overflow-hidden">
            {/* Animated background patterns */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(255,255,255,0.2)_0%,_transparent_50%)]"></div>
              <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(0,0,0,0.15)_0%,_transparent_50%)]"></div>
            </div>
            
            {/* Decorative elements */}
            <motion.div 
              className="absolute top-20 left-40 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.15, 0.1],
                rotate: [0, 90]
              }}
              transition={{ duration: 15, repeat: Infinity }}
            />
            <motion.div 
              className="absolute bottom-20 right-40 w-72 h-72 rounded-full bg-white opacity-10 blur-3xl"
              animate={{ 
                scale: [1.2, 1, 1.2],
                opacity: [0.15, 0.1, 0.15],
                rotate: [90, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, delay: 5 }}
            />
          </div>
          
          <div className="container px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center text-white">
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
              >
                Ready to Transform Your Health Journey?
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                className="text-xl md:text-2xl font-light mb-10 max-w-3xl mx-auto opacity-90"
              >
                Join thousands who are already taking control of their diabetes with personalized AI insights, simplified tracking, and a supportive community.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                className="flex flex-col sm:flex-row justify-center gap-4 items-center"
              >
                <motion.div
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 0 25px rgba(255, 255, 255, 0.5)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="secondary"
                    asChild
                    className="w-full sm:w-auto text-lg px-10 py-7 rounded-xl font-semibold shadow-xl bg-white text-primary hover:bg-white/90 border-0"
                  >
                    <Link href="/register">Sign Up Now</Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 25px rgba(0, 0, 0, 0.2)" 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto"
                >
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto text-lg px-10 py-7 rounded-xl font-semibold border-white text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <Link href="/login">Already have an account?</Link>
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.6 }}
                className="mt-16 flex flex-col items-center"
              >
                <p className="text-white/70 text-sm uppercase tracking-wider mb-5">Trusted by healthcare professionals</p>
                <div className="flex flex-wrap justify-center gap-8 items-center">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 w-32 bg-white/20 rounded-lg backdrop-blur-sm flex items-center justify-center">
                      <span className="text-white text-opacity-90 font-medium">Partner {i}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}