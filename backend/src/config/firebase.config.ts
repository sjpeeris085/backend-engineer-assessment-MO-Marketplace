import * as dotenv from 'dotenv';

dotenv.config();

import * as admin from 'firebase-admin';

export const initializeFirebase = () => {
  if (!admin.apps.length) {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    // Validation to catch the error before Firebase throws it
    if (!projectId || !clientEmail || !privateKey) {
      console.error(
        'Firebase Initialization Failed: Missing Environment Variables',
      );
      return;
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: projectId,
        clientEmail: clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });

    console.log('Firebase Admin Initialized for HeladivaTech');
  }
};
