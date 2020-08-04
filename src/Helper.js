

export default class Helper
{
    constructor ()
    {

    }

    pad(number)
    {
       return number < 10 ? '0'+number : number;
    }

    defaultDateTimeStr (date)
    {
        return this.pad(date.getHours())+':'+this.pad(date.getMinutes())+' '+this.pad(date.getDate())+'.'+this.pad(date.getMonth() +1)+'.'+date.getFullYear()
    }

    isSameDay (d1,d2)
    {
        return d1.getDate() === d2.getDate() && d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear()
    }

    hasUnreadMsgs (msgs)
    {
        return msgs.filter((msg) => msg.state !== 2);
    }

    hasUnreadChatMsgs (chat)
    {
        return this.getUnreadMsgs(chat).length !== 0
    }

    getUnreadMsgs (msgs)
    {
        return msgs.filter((msg) => msg.state !== 2);
    }

    forceReflow (el)
    {
        if (!el)
        {
            return;
        }
        window['forceReflowAdvanced'] = el.offsetHeight; // avoid getting trashed in advanced by assigning to window
    };

    getChatMsgById (msgs,msgId)
    {
        for (let s=0;s<msgs.length;s++)
        {
            let msg = msgs[s];
            if (msg.id === msgId)
            {
                return msg
            }
        }
        return false;
    }

    isOwnMsg (user,userId)
    {
        return user.id === userId;
    }

    /**
     *
     * @param file {object}
     * @param targetUrl {string}
     * @param opts {object}
     * @param cb {function}
     * @param cbProgress {function}
     * @private
     */
    uploadFile (file,targetUrl,opts,cb,cbProgress)
    {
        let xhr = new XMLHttpRequest();
        xhr.opts = opts;
        xhr.onreadystatechange = function ()
        {
            //console.log('status',xhr.status,'readyState',xhr.readyState);
            if (xhr.status === 200 && xhr.readyState === 4)  if (cb) cb(xhr);
        };
        if (cbProgress) xhr.upload.addEventListener('progress', function (e)
        {
            let percent = e.loaded / e.total;
            if (isNaN(percent)) percent = 0;
            e.percent = parseInt(percent * 100);
            cbProgress(e);
        });
        xhr.open('PUT', targetUrl, true);
        xhr.setRequestHeader("Content-Type", opts.mimeType ||  "application/octet-stream");
        xhr.send(file);
        return xhr;
    }

    urlB64ToUint8Array (base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    userFormatDurationFromMs (ms)
    {
        let totalSecs = parseInt(ms/1000);
        let mins = parseInt(totalSecs / 60);
        let secs = parseInt(totalSecs % 60);
        return mins+':'+window.helper.pad(secs);
    }

    isMobileView ()
    {
        return window.screen.width <= 900;
    }

    loadScript (src,cb)
    {
        var script = document.createElement('script');
        if (cb) script.onload = cb;
        script.src = src;
        document.head.appendChild(script)
    }

    onAskForInstall (deferredInstallPrompt,cb)
    {
        deferredInstallPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredInstallPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                //console.log('User accepted the A2HS prompt');
            } else {
                //console.log('User dismissed the A2HS prompt');
            }
            cb(choiceResult.outcome === 'accepted');
            deferredInstallPrompt = null;
        });
    }

    clone (json)
    {
        return JSON.parse(JSON.stringify(json));
    }

    uuidv4()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c)
        {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    urlToBlob (url,cb)
    {
        let request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'blob';
        request.onload = function() {
            var reader = new FileReader();
            reader.readAsDataURL(request.response);
            reader.onload =  function(e){
                //console.log('DataURL:', e.target.result);
                cb(e.target.result);
            };
        };
        request.send();
    }

    checkPermission (key,cb)
    {
        if ('permissions' in navigator)
        {
            navigator.permissions.query({name:key}).then((result) => {
                cb(result.state === 'granted')
            })
        }
        else
        {
            cb(null)
        }
    }

    isSupported (key)
    {
        return key in window;
    }

    getChatByUserId (user,userId)
    {
        if (!user) return false;
        for (let s=0;s<user.chats.length;s++)
        {
            let chat = user.chats[s];
            if (chat.user.id === userId)
            {
                return chat
            }
        }
        return false;
    }

    getChatById (user,chatId)
    {
        if (!user) return false;
        for (let s=0;s<user.chats.length;s++)
        {
            let chat = user.chats[s];
            if (chat.userChat.chatId === chatId)
            {
                return chat
            }
        }
        return false;
    }

}