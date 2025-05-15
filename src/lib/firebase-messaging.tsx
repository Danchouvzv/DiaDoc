import { getMessaging, getToken, onMessage, deleteToken } from 'firebase/messaging';
import { app } from './firebase';
import { toast } from 'react-hot-toast';
import { doc, setDoc, deleteDoc, collection, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Notification component
const NotificationToast = ({ t, title, body }: { t: any; title: string; body: string }) => (
  <div
    className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {title}
          </p>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {body}
          </p>
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200 dark:border-gray-700">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Close
      </button>
    </div>
  </div>
);

export class MessagingService {
  private static instance: MessagingService;
  private messaging = getMessaging(app);

  private constructor() {}

  public static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  public async requestPermission(userId: string): Promise<string | null> {
    try {
      const permission = await Notification.requestPermission();
      
      // If permission was denied, clean up any existing tokens
      if (permission === 'denied') {
        await this.cleanupTokens(userId);
        return null;
      }

      if (permission === 'granted') {
        const token = await this.getToken();
        if (token) {
          await this.saveToken(userId, token);
        }
        return token;
      }

      console.warn('Notification permission denied');
      return null;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      throw error;
    }
  }

  private async getToken(): Promise<string> {
    try {
      const currentToken = await getToken(this.messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
      });

      if (!currentToken) {
        throw new Error('No registration token available');
      }

      return currentToken;
    } catch (error) {
      console.error('Error getting token:', error);
      throw error;
    }
  }

  private async saveToken(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        fcmTokens: { [token]: true }
      });
    } catch (error) {
      console.error('Error saving token:', error);
      throw error;
    }
  }

  private async cleanupTokens(userId: string): Promise<void> {
    try {
      const currentToken = await this.getToken();
      if (currentToken) {
        const tokenDoc = doc(collection(db, 'users', userId, 'fcmTokens'), currentToken);
        await deleteDoc(tokenDoc);
        await deleteToken(this.messaging);
      }
    } catch (error) {
      console.error('Error cleaning up tokens:', error);
      // Don't throw here as this is cleanup code
    }
  }

  public onMessageListener() {
    return onMessage(this.messaging, (payload) => {
      console.log('Message received:', payload);
      
      if (payload.notification) {
        const { title, body } = payload.notification;
        toast.custom((t) => (
          <NotificationToast t={t} title={title || 'New Notification'} body={body || ''} />
        ));
      }
    });
  }

  public async checkAndUpdatePermission(userId: string): Promise<void> {
    if ('Notification' in window) {
      const permission = await Notification.permission;
      if (permission === 'denied') {
        await this.cleanupTokens(userId);
      }
    }
  }
} 