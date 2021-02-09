import React, { useEffect } from 'react';
import './App.scss';
import Wrapper from './components/Wrapper';
import ModalWindow from './components/ModalWindow';
import Uploaded from './components/Uploaded';
import { Provider } from 'react-redux';
import { store } from './store';
import { firebase } from './firebase.config';
import { connect } from 'react-redux';


const mapDispatchToProps = {
    storeUploadedFile: file => ({
        type: 'ADD_UPLOADED_FILE',
        payload: file
    }),

    storeAllUploadedFiles: files => ({
        type: 'ADD_ALL_UPLOADS',
        payload: files
    })
};

const Init = connect(null, mapDispatchToProps)(props => {
    useEffect(() => {
        firebase.storage().ref(`images/`).listAll().then(result => {
            Promise.all(result.items.map(item => {
                return new Promise((resolve) => {
                    item.getDownloadURL().then(url => {
                        resolve({ link: url });
                    }); 
                });
            }))
            .then(result => {
                props.storeAllUploadedFiles(result);
            });
        });
    });

    return props.children;
});

function App() {
    return (
        <Provider store={store}>
            <Init>
                <Wrapper />
                <Uploaded />
                <ModalWindow />
            </Init>
        </Provider>
    );
}

export default App;
