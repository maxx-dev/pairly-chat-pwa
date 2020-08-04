import { createStore } from "redux";
//import setUser from "./reducers/setUser";
import combinedReducers from "./reducers/index";

function configureStore(state) {
    //console.log('state',state);
    return createStore(combinedReducers,state);
}

export default configureStore;