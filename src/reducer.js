import { combineReducers } from 'redux';
import fileReducer from './reducers/files';
import uploadedReducer from './reducers/uploaded';
import modalReducer from './reducers/modal';

export default combineReducers({
    fileReducer,
    modalReducer,
    uploadedReducer
});