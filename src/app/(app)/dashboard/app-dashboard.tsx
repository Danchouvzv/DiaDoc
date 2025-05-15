// This file has been renamed to app-dashboard.tsx to avoid route conflicts
// with src/app/dashboard/page.tsx

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, TrendingUp, BarChart2, PieChart, ListChecks } from "lucide-react";
import { motion } from "framer-motion";
import React from "react"; // Added React for potential future hook usage

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
};

const recentEntryVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.07,
      duration: 0.3,
      ease: "easeOut",
    },
  }),
};

export default function DashboardPage() {
  const summaryCards = [
    {
      title: "Glucose Levels",
      icon: TrendingUp,
      value: "102",
      unit: "mg/dL",
      change: "+2.1% from last week",
      colorClass: "text-primary",
      chartHint: "graph chart",
      chartText: "Glucose Chart Placeholder"
    },
    {
      title: "Activity Levels",
      icon: BarChart2,
      value: "7,830",
      unit: "Steps",
      change: "Target: 10,000 steps",
      colorClass: "text-accent",
      chartHint: "fitness graph",
      chartText: "Activity Chart Placeholder"
    },
    {
      title: "Calorie Intake",
      icon: PieChart,
      value: "1,850",
      unit: "kcal",
      change: "Target: 2,000 kcal",
      colorClass: "text-destructive",
      chartHint: "nutrition data",
      chartText: "Calorie Summary Placeholder"
    },
  ];

  const recentEntries = [
    {title: "Morning Run", details: "5km, 30 minutes", time: "1 hour ago", icon: TrendingUp},
    {title: "Lunch: Salad", details: "Chicken salad with mixed greens", time: "3 hours ago", icon: PieChart},
    {title: "Evening Walk", details: "3km, 45 minutes", time: "Yesterday", icon: BarChart2}
  ];

  return (
    <div className="flex flex-col gap-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex items-center justify-between mb-4"
      >
        <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 active:scale-100">
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Entry
          </Button>
        </motion.div>
      </motion.div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {summaryCards.map((card, index) => (
          <motion.custom
            key={card.title}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={index}
            whileHover={{ y: -5, scale: 1.02, boxShadow: "0px 10px 25px -5px hsl(var(--primary) / 0.15)" }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
            className="h-full" // Ensure motion div takes full height for card
          >
            <Card className="h-full flex flex-col transition-all duration-300 ease-in-out shadow-lg hover:shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">{card.title}</CardTitle>
                <card.icon className={`h-5 w-5 ${card.colorClass}`} />
              </CardHeader>
              <CardContent className="flex flex-col flex-grow">
                <div className={`text-3xl font-bold ${card.colorClass}`}>{card.value} <span className="text-sm font-normal text-muted-foreground">{card.unit}</span></div>
                <p className="text-xs text-muted-foreground pt-1">
                  {card.change}
                </p>
                <div className="mt-4 flex-grow min-h-[10rem] w-full bg-muted/30 rounded-lg flex items-center justify-center text-muted-foreground border-2 border-dashed border-border/50 p-4 shadow-inner" data-ai-hint={card.chartHint}>
                  {card.chartText}
                </div>
              </CardContent>
            </Card>
          </motion.custom>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: summaryCards.length * 0.1 + 0.2, ease: "easeOut" }}
      >
        <Card className="transition-all duration-300 ease-in-out hover:shadow-xl shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl flex items-center"><ListChecks className="mr-2 h-6 w-6 text-primary" />Recent Entries</CardTitle>
            <CardDescription>Your latest logged activities and meals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentEntries.map((entry, i) => (
                 <motion.custom
                  key={i}
                  variants={recentEntryVariants}
                  initial="hidden"
                  animate="visible"
                  custom={i}
                  whileHover={{ backgroundColor: "hsl(var(--muted) / 0.8)", x: 2, boxShadow: "0px 4px 15px -3px hsl(var(--primary) / 0.1)"}}
                  className="flex items-center justify-between p-4 bg-muted/40 rounded-lg transition-colors duration-200 ease-in-out border border-transparent hover:border-primary/30"
                >
                  <div className="flex items-center gap-3">
                    <entry.icon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{entry.title}</p>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{entry.time}</span>
                </motion.custom>
              ))}
              {recentEntries.length === 0 && <p className="text-center text-muted-foreground pt-4">No recent entries.</p>}
              {recentEntries.length > 0 && <p className="text-center text-muted-foreground pt-4 text-sm">No more recent entries.</p>}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
