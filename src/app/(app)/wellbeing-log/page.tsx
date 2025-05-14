"use client"; 

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SmilePlus, Zap, Brain, Meh, Frown, Laugh, Smile as SmileIcon, Star } from "lucide-react"; 
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function WellbeingLogPage() {
  const [energyLevel, setEnergyLevel] = React.useState(5);
  const [mood, setMood] = React.useState("neutral");

  const moodOptions = [
    { value: "terrible", label: "Terrible", icon: Frown },
    { value: "bad", label: "Bad", icon: Meh },
    { value: "neutral", label: "Okay", icon: SmileIcon },
    { value: "good", label: "Good", icon: SmilePlus },
    { value: "great", label: "Great!", icon: Laugh },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <Star className="mr-3 h-10 w-10 text-primary"/>Wellbeing Log
        </h1>
      </div>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-2xl">How Are You Feeling Today?</CardTitle>
          <CardDescription>Capture your subjective feelings, mood, and energy levels.</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="space-y-3">
            <Label htmlFor="mood" className="text-base font-medium">Overall Mood</Label>
            <RadioGroup 
              value={mood} 
              onValueChange={setMood} 
              id="mood" 
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3"
            >
              {moodOptions.map(option => {
                const IconComponent = option.icon;
                return (
                  <Label 
                    key={option.value} 
                    htmlFor={`mood-${option.value}`} 
                    className={cn(
                      "flex flex-col items-center justify-center space-y-2 p-4 border rounded-lg cursor-pointer transition-all duration-200 ease-in-out hover:shadow-lg",
                      mood === option.value 
                        ? "bg-primary/10 border-primary ring-2 ring-primary/70 shadow-xl scale-105" 
                        : "border-input hover:border-primary/50 hover:bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value={option.value} id={`mood-${option.value}`} className="sr-only" />
                    <IconComponent className={cn("h-8 w-8", mood === option.value ? "text-primary" : "text-muted-foreground group-hover:text-primary/80")} />
                    <span className={cn("text-sm sm:text-base", mood === option.value ? "font-semibold text-primary" : "text-foreground")}>{option.label}</span>
                  </Label>
                );
              })}
            </RadioGroup>
          </div>
          
          <div className="space-y-4">
            <Label htmlFor="energyLevel" className="text-base font-medium">Energy Level: <span className="font-bold text-primary text-lg">{energyLevel}</span>/10</Label>
            <div className="flex items-center gap-4">
              <Zap className="h-7 w-7 text-yellow-400" />
              <Slider 
                value={[energyLevel]} 
                onValueChange={(value) => setEnergyLevel(value[0])}
                max={10} 
                step={1} 
                id="energyLevel" 
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-base font-medium">Additional Notes (Optional)</Label>
            <Textarea 
              id="notes" 
              placeholder="Any specific feelings, symptoms, or observations? e.g., Woke up feeling refreshed, slight headache in the afternoon..." 
              className="min-h-[100px] text-base focus:ring-2 focus:ring-primary/50 shadow-sm"
              rows={3}
            />
          </div>

          <div className="flex justify-end pt-4 mt-2 border-t border-border/50">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-100 text-base px-8 py-3">
              <Brain className="mr-2 h-5 w-5" />
              Log Wellbeing
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Wellbeing History</CardTitle>
          <CardDescription>Track your mood and energy trends over time.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No wellbeing entries logged yet. Start today to build your history!</p>
          {/* Placeholder for wellbeing history, maybe a chart or list */}
        </CardContent>
      </Card>
    </div>
  );
}
