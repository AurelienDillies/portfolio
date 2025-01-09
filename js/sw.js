self.addEventListener('install', event => {
    console.log('Service Worker installing.');
    // Add a call to skipWaiting here if needed
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating.');
    // Add a call to clients.claim() here if needed
});

self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
    // You can add custom fetch handling here
});
