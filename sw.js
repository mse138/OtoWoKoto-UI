// OtoWoKoto Service Worker
// 設計方針: キャッシュなし（常にネットワーク優先）
// 理由: 文字起こし結果・APIレスポンスをキャッシュしてはならない

const CACHE_NAME = 'otowokoто-v1';

// インストール時: 即座にアクティブ化
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// アクティブ化時: 古いキャッシュを削除
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// フェッチ: 常にネットワーク優先
// APIリクエスト・音声データはキャッシュしない
self.addEventListener('fetch', (event) => {
  // chrome-extension などは無視
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request).catch(() => {
      // オフライン時はシンプルなメッセージを返す
      return new Response(
        '<html><body style="font-family:sans-serif;text-align:center;padding:40px">' +
        '<h2>オフラインです</h2>' +
        '<p>インターネット接続を確認してください。</p>' +
        '</body></html>',
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    })
  );
});
