import { useEffect, useState } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "../firebase";

export const useFcmToken = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Request permission
        const permission = await Notification.requestPermission();

        if (permission !== "granted") {
          console.warn("Notification permission denied");
          return;
        }

        // Get token
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
        });

        if (currentToken) {
          console.log("FCM Token:", currentToken);
          setToken(currentToken);
        } else {
          console.warn("No registration token available");
        }

        // Foreground messages
        onMessage(messaging, (payload) => {
          console.log("Foreground message:", payload);
          alert(payload.notification?.title);
        });
      } catch (err) {
        console.error("FCM error:", err);
      }
    };

    init();
  }, []);

  return token;
};
