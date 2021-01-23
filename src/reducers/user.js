const user = (state, action) => {
    switch (action.type) {
        case 'CHANGE_USER':
            return action.data;
        default:
            return state || null
    }
};

export default user
