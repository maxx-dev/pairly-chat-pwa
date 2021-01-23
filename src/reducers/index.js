import { combineReducers } from 'redux'

import view from './view'
import user from './user'
import toast from './toast'
import overlay from './overlay'
import modal from './modal'
import connection from './connection'

const combinedReducers = combineReducers({
    view,
    user,
    toast,
    overlay,
    modal,
    connection
});

export default combinedReducers
