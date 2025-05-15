import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

interface ScheduledNotification {
  userId: string;
  notification: {
    title: string;
    body: string;
    data?: Record<string, string>;
  };
  tokens: string[];
  scheduledTime: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export const processScheduledNotifications = functions.pubsub
  .schedule('every 1 minutes')
  .onRun(async (context) => {
    const now = new Date();
    const db = admin.firestore();

    try {
      // Get notifications that are scheduled for now or earlier
      const snapshot = await db
        .collection('scheduledNotifications')
        .where('status', '==', 'pending')
        .where('scheduledTime', '<=', now.toISOString())
        .limit(100) // Process in batches
        .get();

      if (snapshot.empty) {
        console.log('No notifications to process');
        return null;
      }

      const batch = db.batch();
      const notifications: ScheduledNotification[] = [];

      snapshot.forEach((doc) => {
        const notification = doc.data() as ScheduledNotification;
        notifications.push(notification);
        
        // Mark as processing
        batch.update(doc.ref, { 
          status: 'processing',
          processStartTime: now.toISOString()
        });
      });

      await batch.commit();

      // Process each notification
      for (const notification of notifications) {
        try {
          const { tokens, notification: notificationData } = notification;
          const validTokens: string[] = [];
          const invalidTokens: string[] = [];

          // Send to each token
          for (const token of tokens) {
            try {
              await admin.messaging().send({
                token,
                notification: notificationData,
                data: notificationData.data,
              });
              validTokens.push(token);
            } catch (error: any) {
              console.error(`Error sending to token ${token}:`, error);
              
              if (error.code === 'messaging/invalid-registration-token' ||
                  error.code === 'messaging/registration-token-not-registered') {
                invalidTokens.push(token);
              }
            }
          }

          // Clean up invalid tokens
          if (invalidTokens.length > 0) {
            await Promise.all(
              invalidTokens.map(token =>
                db.doc(`users/${notification.userId}/fcmTokens/${token}`).delete()
              )
            );
          }

          // Mark notification as completed
          await db
            .collection('scheduledNotifications')
            .doc(notification.userId)
            .update({
              status: 'completed',
              completedAt: now.toISOString(),
              successCount: validTokens.length,
              failureCount: invalidTokens.length,
            });

        } catch (error) {
          console.error('Error processing notification:', error);
          
          // Mark as failed
          await db
            .collection('scheduledNotifications')
            .doc(notification.userId)
            .update({
              status: 'failed',
              error: error.message,
              failedAt: now.toISOString(),
            });
        }
      }

      return null;
    } catch (error) {
      console.error('Error in scheduled notification processor:', error);
      return null;
    }
  }); 