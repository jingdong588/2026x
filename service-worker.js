// 服务工作者 - 缓存策略
const CACHE_NAME = '2026-new-year-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// 需要缓存的资源
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/fireworks.js',
  '/countdown.js',
  '/blessings-data.js',
  '/manifest.json',
  '/assets/icons/icon-192.png',
  '/assets/icons/icon-512.png'
];

// 安装事件
self.addEventListener('install', event => {
  console.log('Service Worker 安装中...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('缓存静态资源');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件
self.addEventListener('activate', event => {
  console.log('Service Worker 激活');

  event.waitUntil(
    Promise.all([
      // 清理旧缓存
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('删除旧缓存:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// 获取事件 - 网络优先策略
self.addEventListener('fetch', event => {
  // 只缓存同源请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // 忽略POST请求
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // 如果缓存中有，返回缓存
        if (cachedResponse) {
          return cachedResponse;
        }

        // 否则从网络获取
        return fetch(event.request)
          .then(networkResponse => {
            // 克隆响应，因为响应只能使用一次
            const responseToCache = networkResponse.clone();

            // 将响应添加到动态缓存
            caches.open(DYNAMIC_CACHE)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch(error => {
            // 网络失败，显示离线页面
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }

            // 对于其他资源，可以返回一个占位符
            return new Response('网络连接失败，请检查网络连接', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// 后台同步
self.addEventListener('sync', event => {
  if (event.tag === 'sync-blessings') {
    event.waitUntil(syncBlessings());
  }
});

// 同步祝福语
async function syncBlessings() {
  console.log('后台同步祝福语');
  // 这里可以添加同步逻辑
}

// 推送通知
self.addEventListener('push', event => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || '2026新年祝福通知',
    icon: '/assets/icons/icon-192.png',
    badge: '/assets/icons/badge.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'open',
        title: '打开应用'
      },
      {
        action: 'close',
        title: '关闭'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '2026新年祝福', options)
  );
});

// 通知点击事件
self.addEventListener('notificationclick', event => {
  console.log('通知被点击:', event.notification.tag);
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});