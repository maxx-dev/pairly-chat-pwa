const connection = (state = null, action) => {

    switch (action.type) {
        case 'CHANGE_CONNECTION':
            return action.data;
        default:
            return state || null
    }
};

export default connection
