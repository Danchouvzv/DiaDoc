import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import admin from 'firebase-admin';
import { z } from 'zod';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// Validation schema for notification payload
const NotificationSchema = z.object({
  userId: z.string(),
  title: z.string(),
  body: z.string(),
  scheduledTime: z.string().optional(),
  data: z.record(z.string()).optional(),
});

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validatedData = NotificationSchema.parse(payload);
    const { userId, title, body, scheduledTime, data } = validatedData;

    // Get all user's FCM tokens
    const tokensSnapshot = await getDocs(
      collection(db, 'users', userId, 'fcmTokens')
    );

    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (tokens.length === 0) {
      return NextResponse.json(
        { error: 'User has no FCM tokens registered' },
        { status: 400 }
      );
    }

    const notification = {
      title,
      body,
      data,
    };

    if (scheduledTime) {
      // Store scheduled notification in Firestore
      await addDoc(collection(db, 'scheduledNotifications'), {
        userId,
        notification,
        scheduledTime,
        tokens,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Notification scheduled successfully' 
      });
    }

    // Send immediate notification to all user's devices
    const failedTokens = [];
    
    for (const token of tokens) {
      try {
        await admin.messaging().send({
          token,
          notification,
          data,
        });
      } catch (error: any) {
        console.error(`Error sending to token ${token}:`, error);
        
        // If token is invalid, mark it for removal
        if (error.code === 'messaging/invalid-registration-token' ||
            error.code === 'messaging/registration-token-not-registered') {
          failedTokens.push(token);
        }
      }
    }

    // Clean up invalid tokens
    if (failedTokens.length > 0) {
      await Promise.all(
        failedTokens.map(token =>
          admin.firestore().doc(`users/${userId}/fcmTokens/${token}`).delete()
        )
      );
    }

    return NextResponse.json({ 
      success: true,
      invalidTokensRemoved: failedTokens.length
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid notification data', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
} 