self.addEventListener('push', event => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {
    data = { title: 'TowBrüx', body: event.data ? event.data.text() : 'Nová událost.' };
  }
  const title = data.title || 'TowBrüx Driver';
  const options = {
    body: data.body || 'Přišla nová zakázka.',
    icon: data.icon || './icon.svg',
    badge: data.badge || './icon.svg',
    tag: data.tag || 'towbrux-notification',
    renotify: true,
    vibrate: [180, 80, 180, 80, 300],
    data: data.data || { url: './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  const target = event.notification.data?.url || './';
  event.waitUntil((async () => {
    const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    for (const client of clients) {
      if ('focus' in client) {
        try { await client.focus(); if ('navigate' in client && target) await client.navigate(target); } catch (e) {}
        return;
      }
    }
    if (self.clients.openWindow) await self.clients.openWindow(target);
  })());
});
