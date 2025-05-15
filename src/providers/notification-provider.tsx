import React, { createContext, useContext, useEffect, useState } from 'react';
import { MessagingService } from '@/lib/firebase-messaging';
import { useAuth } from './auth-provider';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

interface NotificationContextType {
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
  isSupported: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const { user } = useAuth();
  const messagingService = MessagingService.getInstance();

  useEffect(() => {
    const checkSupport = () => {
      const isSupported = 'Notification' in window &&
        'serviceWorker' in navigator &&
        'PushManager' in window;
      setIsSupported(isSupported);
      return isSupported;
    };

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/',
        });
        console.log('Service Worker registered with scope:', registration.scope);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    const initializeNotifications = async () => {
      if (!checkSupport() || !user) return;

      try {
        // Register service worker first
        await registerServiceWorker();

        // Check current permission
        const permission = await Notification.permission;
        setHasPermission(permission === 'granted');

        if (permission === 'granted') {
          const token = await messagingService.requestPermission(user.uid);
          if (!token) {
            console.warn('Failed to get FCM token');
            return;
          }
        }

        // Set up message listener for foreground notifications
        const unsubscribe = messagingService.onMessageListener();

        // Check permission status periodically
        const permissionCheck = setInterval(async () => {
          const currentPermission = await Notification.permission;
          if (currentPermission === 'denied') {
            await messagingService.checkAndUpdatePermission(user.uid);
            setHasPermission(false);
            clearInterval(permissionCheck);
          }
        }, 60000); // Check every minute

        return () => {
          if (typeof unsubscribe === 'function') {
            unsubscribe();
          }
          clearInterval(permissionCheck);
        };
      } catch (error) {
        console.error('Error initializing notifications:', error);
        toast.error('Failed to initialize notifications. Please try again later.');
      }
    };

    initializeNotifications();
  }, [user]);

  const requestPermission = async () => {
    if (!user || !isSupported) return;

    try {
      const token = await messagingService.requestPermission(user.uid);
      if (token) {
        setHasPermission(true);
        toast.success('Notifications enabled successfully!');
      } else {
        toast.error('Failed to enable notifications. Please check your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications. Please try again.');
    }
  };

  return (
    <NotificationContext.Provider value={{ hasPermission, requestPermission, isSupported }}>
      {children}
    </NotificationContext.Provider>
  );
}; 