import { combineReducers } from 'redux'

import view from './view'
import user from './user'
import toast from './toast'
import overlay from './overlay'
import connection from './connection'

const combinedReducers = combineReducers({
    view,
    user,
    toast,
    overlay,
    connection
});

export default combinedReducers
