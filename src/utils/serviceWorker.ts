/**
 * Service Worker 注册和管理工具
 */

interface SWConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
}

// 检查浏览器是否支持 Service Worker
export function isServiceWorkerSupported(): boolean {
  return 'serviceWorker' in navigator;
}

// 检查是否处于离线状态
export function isOffline(): boolean {
  return !navigator.onLine;
}

// 注册 Service Worker
export async function registerServiceWorker(config: SWConfig = {}): Promise<void> {
  if (!isServiceWorkerSupported()) {
    console.log('[SW] Service Worker not supported');
    return;
  }

  const { onUpdate, onSuccess, onOffline, onOnline } = config;

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('[SW] Registered:', registration.scope);

    // 处理更新
    registration.onupdatefound = () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.onstatechange = () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // 有新版本可用
            console.log('[SW] New content available');
            onUpdate?.(registration);
          } else {
            // 首次安装完成
            console.log('[SW] Content cached for offline use');
            onSuccess?.(registration);
          }
        }
      };
    };

    // 监听网络状态变化
    window.addEventListener('offline', () => {
      console.log('[SW] App is offline');
      onOffline?.();
    });

    window.addEventListener('online', () => {
      console.log('[SW] App is online');
      onOnline?.();
    });

    // 定期检查更新
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000); // 每小时检查一次

  } catch (error) {
    console.error('[SW] Registration failed:', error);
  }
}

// 注销 Service Worker
export async function unregisterServiceWorker(): Promise<void> {
  if (!isServiceWorkerSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  const result = await registration.unregister();
  console.log('[SW] Unregistered:', result);
}

// 跳过等待，立即激活新版本的 SW
export function skipWaiting(): void {
  if (!isServiceWorkerSupported()) return;

  navigator.serviceWorker.ready.then((registration) => {
    registration.waiting?.postMessage('skipWaiting');
  });
}

// 清理所有缓存
export async function clearAllCaches(): Promise<void> {
  if (!('caches' in window)) return;

  const cacheNames = await caches.keys();
  await Promise.all(cacheNames.map((name) => caches.delete(name)));
  console.log('[SW] All caches cleared');
}

// 发送消息到 Service Worker
export async function sendMessageToSW(message: unknown): Promise<void> {
  if (!isServiceWorkerSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  registration.active?.postMessage(message);
}

// 后台同步
export async function requestBackgroundSync(tag: string): Promise<void> {
  if (!isServiceWorkerSupported()) return;

  const registration = await navigator.serviceWorker.ready;
  
  if ('sync' in registration) {
    await (registration as ServiceWorkerRegistration & { sync: { register: (tag: string) => Promise<void> } }).sync.register(tag);
    console.log('[SW] Background sync registered:', tag);
  } else {
    console.log('[SW] Background sync not supported');
  }
}

// 显示更新提示
export function showUpdateNotification(onUpdate: () => void): void {
  // 创建自定义更新提示
  const notification = document.createElement('div');
  notification.className = `
    fixed bottom-4 right-4 z-50 
    bg-violet-600 text-white px-6 py-4 rounded-lg shadow-lg
    flex items-center gap-4 animate-in slide-in-from-bottom-4
  `;
  notification.innerHTML = `
    <div>
      <p class="font-medium">新版本可用</p>
      <p class="text-sm text-violet-200">点击刷新以获取最新内容</p>
    </div>
    <button id="sw-update-btn" class="bg-white text-violet-600 px-4 py-2 rounded-md font-medium hover:bg-violet-50 transition-colors">
      刷新
    </button>
  `;

  document.body.appendChild(notification);

  document.getElementById('sw-update-btn')?.addEventListener('click', () => {
    onUpdate();
    notification.remove();
  });
}

// 初始化离线支持
export function initOfflineSupport(config: SWConfig = {}): void {
  // 注册 Service Worker
  if (process.env.NODE_ENV === 'production' || import.meta.env.PROD) {
    registerServiceWorker({
      ...config,
      onUpdate: (registration) => {
        showUpdateNotification(() => {
          skipWaiting();
          window.location.reload();
        });
        config.onUpdate?.(registration);
      },
    });
  }

  // 处理手动刷新
  let refreshing = false;
  navigator.serviceWorker?.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    window.location.reload();
  });
}
