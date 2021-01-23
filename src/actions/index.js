export const changeView = (view) => {

    return {
        type: 'CHANGE_VIEW',
        view
    }
};

export const changeUser = (data) => {
    return {
        type: 'CHANGE_USER',
        data
    }
};

export const changeToast = (data) => {
    return {
        type: 'CHANGE_TOAST',
        data
    }
};

export const onAction = (data) => {
    return {
        type: 'ON_ACTION',
        data
    }
};

export const changeOverlay = (data) => {
    return {
        type: 'CHANGE_OVERLAY',
        data
    }
};

export const changeModal = (data) => {
    return {
        type: 'CHANGE_MODAL',
        data
    }
};

export const changeConnection = (data) => {
    return {
        type: 'CHANGE_CONNECTION',
        data
    }
};