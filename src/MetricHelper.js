
class MetricHelper
{
    logColdStartMetrics ()
    {
        if (window.appMetrics.FCP && window.appMetrics.FCP.end) this.logColdStartMetric('FCP',window.appMetrics.FCP.end.getTime());
        if (window.appMetrics.LCP && window.appMetrics.LCP.end) this.logColdStartMetric('LCP',window.appMetrics.LCP.end.getTime());
        if (window.appMetrics.TTI && window.appMetrics.TTI.end) this.logColdStartMetric('TTI',window.appMetrics.TTI.end.getTime());
    }

    // will be replaced by window.performance.getEntries()[0], but not yet fully supported (safari...)
    logColdStartMetric (key,val)
    {
        console.info(key,val - window.performance.timing.navigationStart,'ms')
    }
}

export default MetricHelper;