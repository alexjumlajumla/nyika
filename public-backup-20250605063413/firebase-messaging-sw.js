// Empty service worker to prevent 404 errors
// Firebase will be properly initialized when needed
console.log('Firebase service worker loaded');

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activated');
});
