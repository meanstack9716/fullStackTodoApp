importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyAkxCTjc9Lfe-5uPgEwFFlY1_1LXng2nc0",
  authDomain: "odotapp-c920b.firebaseapp.com",
  projectId: "todotapp-c920b",
  messagingSenderId: "123733393543",
  appId: "1:123733393543:web:e4911a481b6a47fb0ab822",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notification = payload.notification || {};
  const title = notification.title || 'Notification';
  const options = {
    body: notification.body,
    tag: notification.tag,
    icon: "/images/notification.png"
  };
  self.registration.showNotification(title, options);
});
