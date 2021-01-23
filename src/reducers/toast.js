const toast = (state = null, action) => {

    switch (action.type) {
        case 'CHANGE_TOAST':
            return action.data;
        default:
            return state || null
    }
};

export default toast
