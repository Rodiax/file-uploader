
const defaultState = {
    closed: true,
    file: null
};

const modalReducer = (state = defaultState, action) => {
    switch(action.type) {
        case 'SET_MODAL':
            return {
                ...state,
                closed: action.payload.closed,
                file: action.payload.file
            }
        default:
            return state;
    }
};

export default modalReducer