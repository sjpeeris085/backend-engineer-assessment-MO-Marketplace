import { getToken } from "firebase/messaging";
import { useState } from "react";
import { messaging } from "../firebase";
// import { firebaseApp } from "../../firebase.config";

export default function RequestFcmButton() {
  const [token, setToken] = useState<string | null>(null);

  const requestPermission = async () => {
    try {
      Notification.requestPermission().then(function (permission) {
        console.log("permiss", permission);
      });

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Notification permission not granted!");
        return;
      }

      // Get token
      const fcmToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      console.log("FCM Token:", fcmToken);
      setToken(fcmToken);
    } catch (err) {
      console.error("Error getting FCM token:", err);
    }
  };

  return (
    <div>
      <button onClick={requestPermission}>Enable Notifications</button>
      {token && <p>Token: {token}</p>}
    </div>
  );
}
