// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAnalytics, type Analytics } from "firebase/analytics";
// Import getStorage for Firebase Storage if you plan to use it.
// import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
// let storage: Storage; // Declare storage if you'll use it
let analytics: Analytics | undefined;

if (typeof window !== "undefined" && !getApps().length) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    // storage = getStorage(app); // Initialize storage
    if (firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Fallback to placeholder objects if initialization fails
    app = {} as FirebaseApp; 
    auth = {} as Auth; 
    db = {} as Firestore; 
    // storage = {} as Storage;
    analytics = undefined;
  }
} else if (getApps().length > 0) {
  app = getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  // storage = getStorage(app); // Initialize storage
  if (firebaseConfig.measurementId && typeof window !== "undefined") {
     analytics = getAnalytics(app);
  }
} else {
  // Fallback for server-side rendering or environments where Firebase might not be initialized yet.
  app = {} as FirebaseApp; 
  auth = {} as Auth; 
  db = {} as Firestore;
  // storage = {} as Storage; 
  analytics = undefined;
}


export { app, auth, db, analytics }; // Add storage to exports if used
