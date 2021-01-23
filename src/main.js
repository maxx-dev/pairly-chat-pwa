
/*import './style/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import configureStore from "./store";
import AppMetric from "./models/AppMetric";
import MetricHelper from "./MetricHelper";
import FetchManager from "./libs/FetchManager";
let store = configureStore({view:{view:'CHATS'},user:null,toast:null,overlay:null,modal:null,connection:true});
window.appMetrics = {
    TTI:new AppMetric('TTI'),
    FCP:new AppMetric('FCP'),
    LCP:new AppMetric('LCP')
};
window.app = {
    fetchManager: new FetchManager(),
    metricHelper:new MetricHelper()
};
window.appMetrics['FCP'].setEnd(false,false, true);
if (process.env.ENV === 'PRODUCTION') console.log('VERSION',process.env.VERSION,'BUILD_TIME',process.env.BUILD_TIME);
ReactDOM.render(
    <Provider store={store}>
        {<App/>}
    </Provider>
, document.getElementById('root'));

serviceWorker.register();
*/

//import productList from './test/productList';
//import todo from './test/todo';
//import gallery from './test/gallery';
import test from './test/test';
//import grocery from './test/grocery';