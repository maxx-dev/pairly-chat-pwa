
class CacheManager
{
    constructor (opts)
    {
        this.opts = {};
        this.dbs = {};
        this.opts = Object.assign(this.opts,opts);
    }

    async init ()
    {
        await this.initDB('cache');
        await this.initDB('msgChain');
        return true
    }

    initDB (key)
    {
        return new Promise((resolve, reject) =>
        {
            if("indexedDB" in window)
            {
                //console.log("IndexedDB Supported");
                let openRequest = indexedDB.open(key,1);
                openRequest.onupgradeneeded = function(e)
                {
                    //console.log("Upgrading...");
                    let thisDB = e.target.result;
                    if(!thisDB.objectStoreNames.contains(key))
                    {
                        thisDB.createObjectStore(key);
                    }
                };
                openRequest.onsuccess = function(e)
                {
                    //console.log("IndexedDB Success!");
                    this.dbs[key] = e.target.result;
                    resolve([null]);
                    this.getCacheSize(function (size,err)
                    {
                        if (!err)
                        {
                            //console.log('dbSize',(size/1000/1000).toFixed(2)+' MB');
                        }
                    })
                }.bind(this);
                openRequest.onerror = function(e)
                {
                    console.error("IndexedDB init Error",e);
                }.bind(this)
            }
            else
            {
                console.error('IndexedDB not supported');
                resolve(['NOT_SUPPORTED']);
            }
        })
    }

    get (key,opts = {})
    {
        return new Promise((resolve, reject) =>
        {
            //console.log('getFromCache',key);
            let transaction;
            if (!this.dbs.cache || ( opts.db && !this.dbs[opts.db]))
            {
                console.log('IndexedDB not initialized',key,'db',opts.db);
                resolve(['NOT_READY', null]);
                return;
            }
            let db = this.dbs[opts.db] || this.dbs.cache;
            transaction = db.transaction([opts.transaction || "cache"], "readwrite");
            let store = transaction.objectStore(opts.store || "cache");
            let storeRequest = store.get(key);
            storeRequest.onerror = function (e)
            {
                console.error("CACHE GET",key,e.target.error.name);
                resolve([e.target.error, null]);
            };
            storeRequest.onsuccess = function (e)
            {
                //console.log('Found in cache',key,'result',storeRequest,storeRequest.result);
                if (storeRequest.result)
                {
                    //console.log('Found in cache',key,'result',storeRequest);
                    //resolve([null,JSON.parse(storeRequest.result)]);
                    resolve([null, storeRequest.result]);
                    return;
                }
                resolve(['NOT_FOUND', null]);
            };
        })
    }

    set (key,data,opts = {})
    {
        return new Promise((resolve, reject) => {

            if (typeof key !== 'string')
            {
                console.error('IndexedDB key is not of type string',key,data);
                return;
            }
            let transaction;
            if (!this.dbs.cache || ( opts.db && !this.dbs[opts.db]))
            {
                console.log('IndexedDB not initialized',key,'db',opts.db);
                resolve(['NOT_READY', null]);
                return;
            }
            let cacheEntry = {date:new Date(),result:data};
            let OneMB = 1000 * 1000;
            if (JSON.stringify(data).length > OneMB)
            {
                console.warn('To large to cache request',key,xhr.responseText.length);
                return;
            }
            let db = this.dbs[opts.db] || this.dbs.cache;
            transaction = db.transaction([opts.transaction || "cache"], "readwrite");
            let store = transaction.objectStore(opts.store || 'cache');
            let storeRequest = store.put(cacheEntry,key);
            storeRequest.onerror = function(e)
            {
                console.log("CACHE SET",key,e.target.error.name);
                resolve([e.target.error]);
            };
            storeRequest.onsuccess = function(e)
            {
                //console.log("Saved to Cache",key);
                resolve([null])
            };
        })
    }

    /**
     * Delete FullCache
     * @return {Promise<any>}
     */
    deleteCache ()
    {
        return new Promise((resolve, reject) =>
        {
            if (!this.dbs.cache)
            {
                console.log('IndexedDB not initialized');
                resolve(['NOT_READY', null]);
                return;
            }
            let transaction = this.dbs.cache.transaction(["cache"], "readwrite");
            let store = transaction.objectStore("cache");
            let storeRequest = store.clear();
            storeRequest.onsuccess = function(e)
            {
                resolve([null])
            };
            storeRequest.onerror = function(e)
            {
                console.log("CACHE DELETE",e.target.error.name);
                resolve([e.target.error]);
            };
        })
    }

    getCacheSize (cb)
    {
        if (!this.dbs.cache)
        {
            cb([null]);
            return
        }
        let size = 0;
        let transaction = this.dbs.cache.transaction(["cache"]).objectStore("cache").openCursor();
        transaction.onsuccess = function(event)
        {
            let cursor = event.target.result;
            //console.log(cursor);
            if(cursor)
            {
                let storedObject = cursor.value;
                let json = JSON.stringify(storedObject);
                size += json.length;
                cursor.continue();
            }
            else
            {
                cb([size,null]);
            }
        }.bind(this);
        transaction.onerror = function(err)
        {
            cb([null,err]);
        }
    }

    /**
     * Online possible when STATE=UPDATEREADY which required lametrain.appcache to have changed
     */
    updateAppCache ()
    {
        let appCache = window.applicationCache;
        appCache.update();
        if (appCache.status === window.applicationCache.UPDATEREADY)
        {
            appCache.swapCache();
        }
    }

    getAppCacheState ()
    {
        let appCache = window.applicationCache;
        switch (appCache.status) {
            case appCache.UNCACHED: // UNCACHED == 0
                return 'UNCACHED';
                break;
            case appCache.IDLE: // IDLE == 1
                return 'IDLE';
                break;
            case appCache.CHECKING: // CHECKING == 2
                return 'CHECKING';
                break;
            case appCache.DOWNLOADING: // DOWNLOADING == 3
                return 'DOWNLOADING';
                break;
            case appCache.UPDATEREADY:  // UPDATEREADY == 4
                return 'UPDATEREADY';
                break;
            case appCache.OBSOLETE: // OBSOLETE == 5
                return 'OBSOLETE';
                break;
            default:
                return 'UKNOWN CACHE STATUS';
                break;
        };
    }

}

export default CacheManager;