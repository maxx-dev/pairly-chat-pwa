const overlay = (state = null, action) => {

    switch (action.type) {
        case 'CHANGE_OVERLAY':
            return action.data;
        default:
            return state || null
    }
};

export default overlay
