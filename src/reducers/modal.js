const modal = (state , action) => {

    switch (action.type) {
        case 'CHANGE_MODAL':
            return action.data;
        default:
            return state || null
    }
};

export default modal
