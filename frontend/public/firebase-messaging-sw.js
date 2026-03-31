importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyAVY72WZq5kD4_OwEk2TvQ4Ssg-opD0ONk",
  authDomain: "momarketplace-mock-ecommerce.firebaseapp.com",
  projectId: "momarketplace-mock-ecommerce",
  messagingSenderId: "330275743093",
  appId: "1:330275743093:web:0e6059acdb116efd03df3c",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ", payload);

  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
