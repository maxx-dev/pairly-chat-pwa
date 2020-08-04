import React from 'react';
import ReactDOM from 'react-dom';
import './style/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import configureStore from "./store";
let store = configureStore({view:{view:'CHATS'},user:null,toast:null,overlay:null,connection:true});
//console.log('store',store);
if (process.env.ENV === 'PRODUCTION') console.log('VERSION',process.env.VERSION);

ReactDOM.render(
    <Provider store={store}>
        {<App/>}
    </Provider>
, document.getElementById('root'));

serviceWorker.register();
