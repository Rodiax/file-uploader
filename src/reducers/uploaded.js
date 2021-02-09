const defaultState = {
    files: []
}

const uploadedReducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD_UPLOADED_FILE':
            return {
                ...state,
                files: state.files.concat(action.payload)
            }
        case 'ADD_ALL_UPLOADS':
            return {
                ...state,
                files: action.payload
            }
        default: 
            return state;
    }
};

export default uploadedReducer;