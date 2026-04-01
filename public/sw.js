/**
 * Service Worker - 离线支持
 * 缓存策略：优先网络，回退缓存（Network First with Cache Fallback）
 */

const CACHE_NAME = 'bookmark-manager-v1';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const API_CACHE = `${CACHE_NAME}-api`;
const IMAGE_CACHE = `${CACHE_NAME}-images`;

// 需要预缓存的静态资源
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
];

// 安装：预缓存关键资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Pre-caching static assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.error('[SW] Pre-cache failed:', err);
      })
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith(CACHE_NAME) && 
              ![STATIC_CACHE, API_CACHE, IMAGE_CACHE].includes(name))
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 判断请求类型
const isAPIRequest = (url) => url.pathname.startsWith('/api/');
const isImageRequest = (request) => request.destination === 'image';
const isStaticAsset = (request) => 
  ['style', 'script', 'font', 'document'].includes(request.destination);

// 获取缓存策略
function getCacheStrategy(request) {
  const url = new URL(request.url);
  
  // API 请求：网络优先，失败时使用缓存
  if (isAPIRequest(url)) {
    return 'network-first';
  }
  
  // 图片：缓存优先，带过期策略
  if (isImageRequest(request)) {
    return 'cache-first';
  }
  
  // 静态资源：缓存优先
  if (isStaticAsset(request)) {
    return 'cache-first';
  }
  
  // 默认：网络优先
  return 'network-first';
}

// 网络优先策略
async function networkFirstStrategy(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// 缓存优先策略
async function cacheFirstStrategy(request, cacheName) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // 后台更新缓存（Stale-While-Revalidate）
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse.ok) {
          caches.open(cacheName).then((cache) => {
            cache.put(request, networkResponse);
          });
        }
      })
      .catch(() => {/* 忽略后台更新错误 */});
    
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  
  if (networkResponse.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, networkResponse.clone());
  }
  
  return networkResponse;
}

// 获取缓存名称
function getCacheNameForRequest(request) {
  const url = new URL(request.url);
  
  if (isAPIRequest(url)) {
    return API_CACHE;
  }
  
  if (isImageRequest(request)) {
    return IMAGE_CACHE;
  }
  
  return STATIC_CACHE;
}

// 拦截请求
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 跳过非 GET 请求
  if (request.method !== 'GET') {
    return;
  }
  
  // 跳过 chrome-extension 和第三方资源
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }
  
  const strategy = getCacheStrategy(request);
  const cacheName = getCacheNameForRequest(request);
  
  event.respondWith(
    (async () => {
      try {
        if (strategy === 'network-first') {
          return await networkFirstStrategy(request, cacheName);
        } else {
          return await cacheFirstStrategy(request, cacheName);
        }
      } catch (error) {
        console.error('[SW] Fetch failed:', error);
        
        // 返回离线页面（如果是页面请求）
        if (request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        
        throw error;
      }
    })()
  );
});

// 后台同步
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-bookmarks') {
    console.log('[SW] Background sync: sync-bookmarks');
    event.waitUntil(syncBookmarks());
  }
});

// 模拟后台同步书签
async function syncBookmarks() {
  // 从 IndexedDB 获取待同步的书签
  // 实际实现需要 IndexedDB 操作
  console.log('[SW] Syncing bookmarks...');
}

// 推送通知
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || '您有新的通知',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: data.tag || 'default',
    requireInteraction: false,
    data: data.data || {},
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || '书签管理器',
      options
    )
  );
});

// 通知点击
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // 如果已有窗口打开，聚焦它
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // 否则打开新窗口
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

// 消息处理（来自主应用）
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});
