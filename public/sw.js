
const version = /*SW-VERSION*/'1.4.93'/*SW-VERSION*/;
let cacheKey = 'app-'+version;
let sharedFiles = [];
const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/offline.html',
    '/main.js',
    '/[ChatContainer].bundle.js',
    '/vendors~[ChatContainer].bundle.js',
    '/manifest.json',
    '/sw.js',
    '/favicon.ico',
    '/assets/icons/icon@144.png',
];
console.log('[SW] RUN ServiceWorker',cacheKey);
self.addEventListener('install', (event) => {
    console.log('[SW] Install',version);
    event.waitUntil(caches.open(cacheKey).then(function(cache)
        {
            return cache.addAll(FILES_TO_CACHE);
        }).then(function()
        {
            console.log('[SW] Install completed',version);
        }).catch (function (e)
        {
            console.error('[SW] Installation failed',cacheKey,e,arguments);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
    //console.log('[SW] Activate');
    evt.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== cacheKey) {
                    console.log('[SW] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) =>
{
    //console.log('[SW] Fetch', event.request.url);
    if (event.request.url && (
        event.request.url.indexOf('/socket.io/') !== -1 ||
        event.request.url.indexOf('/sockjs-node/') !== -1 ||
        (event.request.url.indexOf('/api/') !== -1 && event.request.url.indexOf('/api/media') === -1) ||
        event.request.url.indexOf('s3.eu-central-1.amazonaws.com') !== -1 ||
        event.request.url.indexOf('googleapis.com') !== -1 ||
        event.request.url.indexOf('api-eu.mixpanel.com') !== -1 ||
        event.request.url.indexOf('gstatic.com') !== -1)
    )
    {
        return
    }
    //console.log('[SW] Fetch', event.request.url);
    let handleClientSide = true;
    const pathname = (new URL(event.request.url)).pathname;
    //console.log('url',event.request.url,'pathname:',pathname);
    if (handleClientSide && pathname === '/share-target') {

        event.respondWith(Response.redirect('/'));
        event.waitUntil(async function ()
        {
            const data = await event.request.formData();
            const client = await self.clients.get(event.resultingClientId || event.clientId);
            const mediaFiles = data.getAll('media');
            for (const mediaFile of mediaFiles) {
                console.log('mediaFile',mediaFile);
                sharedFiles.push({file:mediaFile,type:mediaFile.type,name:mediaFile.name,size:mediaFile.size});
                //client.postMessage({ action: 'SHARED_FILE', mediaFile:mediaFile  });
            }
        }());
        return;
    }

    let corsRequest = new Request(event.request.url, {mode: 'no-cors'}); // important to avoid CORS error with socket.io
    event.respondWith( // Cache First
        caches.open(cacheKey).then(function(cache) {
            return cache.match(event.request).then(function (response) {
                //console.log('[SW] From Cache',response ? response.status : false,response ? response.url : false);
                return response || fetch(corsRequest).then(function(response) {
                    if (event.request.url && (
                        event.request.url.indexOf('sockjs-node/') === -1
                        && event.request.url.indexOf('hot-update.js') === -1
                        && event.request.url.indexOf('/api/media') !== -1
                        && event.request.url.indexOf('chrome-extension://')) === -1
                    )
                    {
                        //console.log('[SW] PUT INTO CACHE',version,event.request.url);
                        return cache.put(event.request, response.clone()).then(function ()
                        {
                            return response;
                        });
                    }
                    //cache.put(event.request, response.clone());
                    return response;
                });
            }).catch(function() {  // If both fail, show a generic fallback:
                return caches.match('/offline.html');
            })
        })
    );

    /*event.respondWith(fetch(corsRequest).catch(error => // Network first
    {
        let cacheHit = caches.match(event.request.url);
        //console.log('[SW] CacheHit',cacheHit,event.request.url);
        if (cacheHit)
        {
            return cacheHit;
        }
    }).then(function (response)
    {
        //console.log('[SW] Network Req Success',event.request.url);
        if (response)
        {
            return caches.open(cacheKey).then(function (cache)
            {
                //console.log(event.request);
                if (event.request.url && (
                    event.request.url.indexOf('sockjs-node/') === -1
                    && event.request.url.indexOf('hot-update.js') === -1
                    && event.request.url.indexOf('/api/media') !== -1
                    && event.request.url.indexOf('chrome-extension://')) === -1
                )
                {
                    //console.log('[SW] PUT INTO CACHE',version,event.request.url);
                    return cache.put(event.request, response.clone()).then(function ()
                    {
                        return response;
                    });
                }
                else
                {
                    return response;
                }
            });
        }
    }));*/
});

// Push Notifications
self.addEventListener('push', function(e) {
    console.log('[SW] Push',e.data.text());
    let data = JSON.parse(e.data.text());
    const title = data.title;
    const options = {
        body: data.body,
        icon: data.icon || 'assets/icons/icon-72x72.png',
        badge: data.badge || 'assets/icons/icon-192x192.png'
    };
    e.waitUntil(self.registration.showNotification(title, options));
});

// Handle Push Notification Clicks
self.addEventListener('notificationclick', function(e) {
    console.log('[SW] Notification click Received.');
    e.notification.close();
    const rootUrl = new URL('/', location).origin+'?pushActivate=1';
    console.log('[SW] event',e,'rootUrl',rootUrl);
    //console.log('data',e.notification.data);
    e.waitUntil(clients.matchAll().then(matchedClients =>
        {
            for (let client of matchedClients)
            {
                if (client.url.indexOf(rootUrl) >= 0)
                {
                    return client.focus();
                }
            }
            return clients.openWindow(rootUrl).then(function (client) { client.focus(); });
        })
    );
    self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({action:'PUSH',data:e.notification.data}));
    })
});

// Communication with page
self.addEventListener("message", async (e) => { // msg from app
    //client.postMessage(`Pong: ${ e.data }`);
    //console.log('onMessage:',e,'clientId',e.source ? e.source.id : false,'data',e.data);
    let client;
    if (e.source && e.source.id)
    {
        client = await clients.get(e.source ? e.source.id :false);
    }
    if (e.data.action === 'SKIP_WAITING')
    {
        self.skipWaiting();
    }
    if (e.data.action === 'VERSION')
    {
        client ? client.postMessage({action:'VERSION',version:version}) : false;
    }
    if (e.data.action === 'HAS_SHARED_FILES')
    {
        //console.log('hasSharedFiles Respond',sharedFiles,"client",client);
        client ? client.postMessage({action:'SHARED_FILES',sharedFiles:sharedFiles}) : false;
        sharedFiles = [];
    }
});

// Background Sync
self.addEventListener('sync', function(event) {

    console.log(new Date().toISOString(),'Sync Event',event.tag);
    if (event.tag.indexOf('SyncMsgs') !== -1)
    {
        // Background Sync Bug Chrome, calls this before connection is fully reestablished
        event.waitUntil(setTimeout(getChainedMsgs.bind(self),3000));
    }
});

async function getFromDB (key)
{
    return new Promise(function(resolve, reject) {
        var db = indexedDB.open(key);
        db.onsuccess = function(event) {
            this.result.transaction(key).objectStore(key).getAll().onsuccess = function(event) {
                resolve([null,event.target.result]);
            }
        };
        db.onerror = function(err) {
            resolve([err,null]);
        }
    });
}

async function deleteDB (key)
{
    return new Promise(function(resolve, reject)
    {
        var db = indexedDB.open(key);
        db.onsuccess = function(event) {
            let transaction = this.result.transaction([key], "readwrite");
            let store = transaction.objectStore(key);
            let storeRequest = store.clear();
            storeRequest.onsuccess = function (e)
            {
                resolve([null])
            };
            storeRequest.onerror = function (e)
            {
                console.log("CACHE DELETE", e.target.error.name);
                resolve([e.target.error]);
            };
        }
    })
}

async function getChainedMsgs ()
{
    //console.log('self',self);
    let [err,res] = await getFromDB('msgChain');
    if (err) console.log(err);
    //console.log('res',res);
    for (let s=0;s<res.length;s++)
    {
        let event = res[s].result;
        console.log('event',event);
        //console.log('token',event.args[2]);
        if (event.eventType === 'post:message')
        {
            try
            {
                let response = await fetch(self.location.origin + '/api/chats/message', {
                    method: 'post',
                    headers: {'Content-Type': "application/json", 'Token': event.args[2]},
                    body: JSON.stringify({msg: event.args[1]}),
                });
                console.log('response',response);
                try {
                    let data = await response.json();
                    console.log('data',data);
                }
                catch (e)
                {

                }
            }
            catch (e)
            {
                console.log('Fetch failed',e);
            }
        }
    }
    await deleteDB('msgChain');
}
if (typeof module !== 'undefined' && module.exports)
{
    module.exports = version;
}