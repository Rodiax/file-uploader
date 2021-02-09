const defaultState = {
    files: []
};

const fileReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'STORE_FILES':
            return {
                ...state,
                files: state.files.concat(action.payload)
            }
        case 'REMOVE_FILE':
            return {
                ...state,
                files: state.files.filter(file => file !== action.payload)
            }
        case 'CLEAR_FILES':
            return {
                ...state,
                files: []
            }
        default:
            return state;
    }
};

export default fileReducer;