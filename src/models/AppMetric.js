export default class AppMetric {

    constructor(title)
    {
        this.title = title;
        this.end = null;
    }

    setEnd (end,doLog,saveToServer)
    {
        this.end = end || new Date();
        if (doLog) this.log();
        if (saveToServer) this.saveToServer();
    }

    log ()
    {
        if (localStorage.getItem('logAppMetrics'))
        {
            console.info(this.title,this.end)
        }
    }

    saveToServer ()
    {
        let appMetric = {appType:'PWA',title:this.title,value:0,end:this.end.getTime(),text:this.text};
        window.app.fetchManager.post('api/dashboard/appMetric',{data:appMetric}).then( ([err,data]) =>
        {
            //console.log('api/auth',data);

        });
    }
}