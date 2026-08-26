self.addEventListener('install',event=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));

self.addEventListener('push',event=>{
  let data={};
  try{data=event.data?event.data.json():{}}catch(e){data={title:'TowBrüx',body:'Nová zpráva'}}

  const title=data.title||'TowBrüx Driver';
  const options={
    body:data.body||'Přišla nová zakázka od dispečera.',
    icon:data.icon||'icon.svg',
    badge:data.badge||'icon.svg',
    tag:data.tag||'towbrux-job',
    renotify:true,
    data:{url:data.url||'./',...(data.data||{})}
  };

  event.waitUntil(self.registration.showNotification(title,options));
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  const url=event.notification.data?.url||'./';
  event.waitUntil((async()=>{
    const list=await clients.matchAll({type:'window',includeUncontrolled:true});
    for(const client of list){
      if('focus' in client){await client.focus();try{await client.navigate(url)}catch(e){}return}
    }
    if(clients.openWindow) return clients.openWindow(url);
  })());
});
