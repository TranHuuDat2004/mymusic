// public/service-worker.js
const CACHE_NAME = 'mymusic-audio-cache-v1';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
    const requestUrl = event.request.url;

    // Chỉ cache các request nhạc và ảnh từ bucket Supabase Storage
    if (requestUrl.includes('supabase.co/storage/v1/object/public/mymusic/')) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request.url).then((cachedResponse) => {
                    if (cachedResponse) {
                        console.log(`[Service Worker] Đang phát nhạc từ Cache: ${requestUrl}`);
                        return cachedResponse;
                    }

                    // Tải từ mạng nếu chưa được cache
                    return fetch(event.request).then((networkResponse) => {
                        // Thẻ audio của trình duyệt khi load lần đầu có thể trả về status 200 hoặc 206 (Range)
                        // Chúng ta lưu bản sao vào cache để tái sử dụng
                        if (networkResponse.status === 200 || networkResponse.status === 206) {
                            cache.put(event.request.url, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch((error) => {
                        console.error(`[Service Worker] Lỗi tải file từ mạng:`, error);
                    });
                });
            })
        );
    }
});
