

export default class SocketManager
{
    constructor (socket)
    {
        this.socket = socket;
        this.socket.saveToCache = true;
        this.emitCache = {};
        this.emitChain = [];

        if (!navigator.onLine)
        {
            this.setShouldServeFromCache(true);
        }
    }

    isConnected ()
    {
        return this.socket.connected;
    }

    emit(eventType)
    {
        let socket = this.socket;
        if (!socket)
        {
            console.log('Socket not defined');
            return;
        }
        //console.log('args',arguments,'shouldServeFromCache',this.shouldServeFromCache,'connected',socket.connected);
        let args = Array.prototype.slice.call(arguments);
        let last = args[args.length -1];
        let customCacheKey = false;
        if (typeof last === 'object' && last && last.cacheKey)
        {
            customCacheKey = last.cacheKey;
            //console.log('emit:customCacheKey',customCacheKey);
        }
        args.push(localStorage.getItem('token'));

        if (eventType.indexOf('post:message') !== -1 && !navigator.onLine)
        {
            //console.log('args',args);
            //this.emitChain.push({eventType:eventType,args:args});
            window.app.cacheManager.set(args[1].uuid,{eventType:eventType,args:args},{db:'msgChain',transaction:'msgChain',store:'msgChain'}).then(() => {})
            if ('SyncManager' in window)
            {
                let syncKey = 'SyncMsgs_'+new Date().toISOString();
                console.log('Register Sync Msgs Event',syncKey);
                window.app.serviceWorkerRegistration.sync.register(syncKey).catch(function(err) {
                    return err;
                })
            }
            return;
        }
        if (this.shouldServeFromCache)
        {
            this.serveFromCache(socket,eventType,customCacheKey);
            return;
        }
        if (!socket.connected) // prevent sending emit when not connected
        {
            console.log(new Date(),'Socket not connected',eventType)
            return;
        }
        socket.emit.apply(socket,args);
    }

    on(name)
    {
        let socket = this.socket;
        let args = Array.prototype.slice.call(arguments);
        let last = args[args.length-1];
        let opts = {};

        if (!socket) return;
        socket.removeAllListeners(name);

        if (typeof last === 'object')
        {
            opts = args.pop();
            //console.log('opts',opts,name);
        }
        let cbIndex = args.length-1;
        let orgCb = args[cbIndex];
        args[cbIndex] = function (data) // last arg is expected to be callback
        {
            let cbArgs = Array.prototype.slice.call(arguments);
            this.parseDatesRecursive(arguments);
            let cacheEntry = this.emitCache[name];
            if (cacheEntry) delete this.emitCache[name];

            if (this.getSaveToCache())
            {
                let cbArgsClone = JSON.parse(JSON.stringify(cbArgs));
                if (cbArgsClone[0] !== 'NOT_IN_CACHE')
                {
                    //console.log('cbArgsClone',name,cbArgsClone);
                    let cacheKey = 'cache|'+name;
                    if (opts && opts.cacheKey)
                    {
                        cacheKey = opts.cacheKey
                    }
                    //console.log('set:cacheKey',cacheKey);
                    if (!this.shouldServeFromCache)
                    {
                        window.app.cacheManager.set(cacheKey,{data:cbArgsClone,route:name}).then(function (){});
                    }
                }
            }
            orgCb.apply(this,cbArgs);
        }.bind(this);
        socket.on.apply(socket,args);
    }

    serveFromCache (socket,eventType,customCacheKey)
    {
        let cacheKey = 'cache|'+eventType;
        if (customCacheKey)
        {
            cacheKey = customCacheKey
        }
        console.log('get:cacheKey',cacheKey);
        window.app.cacheManager.get(cacheKey).then(function ([err,cacheRes])
        {
            let cbList = socket['_callbacks']['$'+eventType];
            //window.app.toLog('cacheRes '+(cacheRes ? 1 : 0));
            if (cacheRes)
            {
                console.info('socket io serve from cache',eventType,'cacheRes',cacheRes);
                //console.log('socket',socket);
                if (cbList && cbList.length !== 0)
                {
                    for (let s=0;s<cbList.length;s++)
                    {
                        let callback = cbList[s];
                        callback.apply(this,cacheRes.result.data); // parsing will be done in onR func
                    }
                }
                else
                {
                    console.log(cacheRes.result.route,'not in callbacks');
                }
            }
            else
            {
                //console.log(eventType,'not in cache');
                if (cbList && cbList.length && cbList.length !== 0)
                {
                    for (let s=0;s<cbList.length;s++)
                    {
                        let callback = cbList[s];
                        callback('NOT_IN_CACHE',null); // parsing will be done in onR func
                    }
                }
            }
        });
    }

    getSaveToCache ()
    {
        return this.socket.saveToCache;
    }

    setShouldServeFromCache (shouldServeFromCache)
    {
        this.shouldServeFromCache = shouldServeFromCache;
    }

    parseDatesRecursive (data)
    {
        //console.log('cbArgs',data);
        for (let prop in data)
        {
            if (data.hasOwnProperty(prop))
            {
                let val = data[prop];
                //console.log('val',val.length,val);
                if (val && val.length === 24 && val[val.length - 1] === 'Z')
                {
                    data[prop] = new Date(Date.parse(val));
                }
                if (typeof val === 'object')
                {
                    this.parseDatesRecursive(val);
                }
            }
        }
    }

}