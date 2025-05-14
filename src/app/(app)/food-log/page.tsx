"use client"; 

import React, { useRef, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, FileText, UploadCloud, X, CheckCircle, ImagePlus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Image from 'next/image';

export default function FoodLogPage() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    if (isCameraOpen) {
      const getCameraPermission = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ video: true });
          setHasCameraPermission(true);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          console.error('Error accessing camera:', error);
          setHasCameraPermission(false);
          setIsCameraOpen(false); 
          toast({
            variant: 'destructive',
            title: 'Camera Access Denied',
            description: 'Please enable camera permissions in your browser settings.',
          });
        }
      };
      getCameraPermission();
    }
    return () => {
      // Stop camera stream when component unmounts or camera is closed
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
         videoRef.current.srcObject = null;
      }
    };
  }, [isCameraOpen, toast]);

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current && hasCameraPermission) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/png');
      setCapturedImage(dataUrl);
      setIsCameraOpen(false); 
      setUploadedFile(null); 
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      setCapturedImage(null); 
      // Preview for uploaded file is handled by URL.createObjectURL in Image src
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setUploadedFile(null);
    if(fileInputRef.current) fileInputRef.current.value = ""; 
    setIsCameraOpen(false); // Also close camera if it was open
  };
  
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
          <ImagePlus className="mr-3 h-10 w-10 text-primary"/>Food Log
        </h1>
      </div>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
        <CardHeader className="bg-muted/30">
          <CardTitle className="text-2xl">Log New Meal</CardTitle>
          <CardDescription>Record what you ate. Add a photo for AI-powered nutritional analysis!</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="mealDescription" className="text-base font-medium">Meal Description</Label>
            <Textarea 
              id="mealDescription" 
              placeholder="e.g., Grilled salmon with quinoa and steamed broccoli..." 
              className="min-h-[120px] text-base focus:ring-2 focus:ring-primary/50 transition-all shadow-sm" 
              rows={4}
            />
          </div>
          
          <div className="space-y-4">
            <Label className="text-base font-medium">Meal Photo (Optional)</Label>
            
            {isCameraOpen && (
              <Card className="border-primary/50 shadow-lg bg-background">
                <CardContent className="p-4">
                  <video ref={videoRef} className="w-full aspect-[4/3] rounded-md bg-muted object-cover" autoPlay muted playsInline />
                  {hasCameraPermission === false && (
                    <Alert variant="destructive" className="mt-2">
                      <Camera className="h-4 w-4" />
                      <AlertTitle>Camera Access Required</AlertTitle>
                      <AlertDescription>
                        Please allow camera access in your browser settings to use this feature.
                      </AlertDescription>
                    </Alert>
                  )}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3">
                    <Button onClick={handleCapturePhoto} disabled={!hasCameraPermission} className="w-full shadow-md py-3 text-base">
                      <Camera className="mr-2 h-5 w-5" /> Capture Photo
                    </Button>
                    <Button variant="outline" onClick={() => setIsCameraOpen(false)} className="w-full py-3 text-base">
                      <X className="mr-2 h-5 w-5" /> Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {(capturedImage || uploadedFile) && (
              <div className="relative group w-full max-w-lg mx-auto border-2 border-dashed border-primary/30 rounded-lg p-2 bg-muted/20">
                <Image 
                    src={capturedImage || (uploadedFile ? URL.createObjectURL(uploadedFile) : '')} 
                    alt="Meal preview" 
                    width={600} height={450} // Adjusted for common aspect ratios
                    className="rounded-md shadow-lg object-cover w-full aspect-[4/3]"
                    data-ai-hint="food meal"
                />
                <Button 
                  variant="destructive" 
                  size="icon" 
                  onClick={clearImage} 
                  className="absolute top-3 right-3 opacity-50 group-hover:opacity-100 transition-opacity z-10 rounded-full h-9 w-9 shadow-lg"
                  aria-label="Remove image"
                >
                  <X className="h-5 w-5"/>
                </Button>
              </div>
            )}

            {!isCameraOpen && !capturedImage && !uploadedFile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 border-2 border-dashed border-border rounded-lg bg-muted/20 hover:border-primary/30 transition-colors">
                <Button variant="outline" onClick={() => setIsCameraOpen(true)} className="py-8 text-base shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-primary/5 flex flex-col items-center justify-center h-32">
                  <Camera className="mb-2 h-8 w-8 text-primary" /> Open Camera
                </Button>
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="py-8 text-base shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:bg-primary/5 flex flex-col items-center justify-center h-32">
                  <UploadCloud className="mb-2 h-8 w-8 text-primary" /> Upload Photo
                </Button>
                <Input 
                  id="mealPhoto" 
                  type="file" 
                  accept="image/*,video/*" // Allow video for future if needed, or restrict to image/*
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 mt-2 border-t border-border/50">
            <Button size="lg" className="shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 active:scale-100 text-base px-8 py-3">
              <FileText className="mr-2 h-5 w-5" />
              Log Meal & Analyze
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="transition-all duration-300 ease-in-out hover:shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl">Past Food Entries</CardTitle>
          <CardDescription>Your logged meals and their analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">No food entries logged yet. Start logging to see your history!</p>
          {/* Placeholder for a list/table of past food entries */}
        </CardContent>
      </Card>
    </div>
  );
}
