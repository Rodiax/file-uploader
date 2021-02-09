import React, { useRef, useState } from 'react';
import { AllowedFileTypes } from '../AllowedFileTypes';
import Image from './Image';
import { v4 as uuid } from 'uuid';
import { connect } from 'react-redux';
import { firebase } from '../firebase.config'; 

const mapStateToProps = state => ({
    files: state.fileReducer.files
});

const mapDispatchToProps = {
    setModal: settings => ({
        type: 'SET_MODAL',
        payload: settings
    }),

    storeFiles: files => ({
        type: 'STORE_FILES',
        payload: files
    }),

    removeFile: file => ({
        type: 'REMOVE_FILE',
        payload: file
    }),

    clearFiles: () => ({
        type: 'CLEAR_FILES'
    }),

    storeUploadedFile: file => ({
        type: 'ADD_UPLOADED_FILE',
        payload: file
    })
};

const defaultUploadingState = { 
    status: 0, 
    uploading: false, 
    fileName: '', 
    done: false 
};

export default connect(mapStateToProps, mapDispatchToProps)(function Wrapper(props) { 
    const [progress, setProgress] = useState(Object.assign({}, defaultUploadingState));
    const fileInputRef = useRef();

    const handleFileOpen = () => fileInputRef.current.click();
    const handleModalSet = settings => props.setModal(settings);

    const storeFiles = event => {
        const files = Array.from(event.target.files);
        
        if (!files.length) return;

        props.clearFiles();
        setProgress(Object.assign({}, defaultUploadingState));

        files.forEach(file => {
            const reader = new FileReader();
            
            reader.readAsDataURL(file);    
            reader.onload = event => props.storeFiles({ 
                result: event.target.result, 
                name: file.name,
                origin: file
            });
        });
    };
    
    const uploadFiles = event => {
        Promise.all(props.files.map(file => {
            return new Promise((resolve, reject) => {
                const ref = firebase.storage().ref(`images/${file.name}`);
                const task = ref.put(file.origin);
    
                task.on('state_changed', snapshot => {
                    const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0);
    
                    setProgress({
                        uploading: true,
                        status: percentage,
                        fileName: file.name,
                        done: false
                    });
                }, error => {
                    reject(error);
                }, () => {
                   resolve(ref);
                });
            });
        }))
        .then(refs => {
            refs.forEach(ref => {
                ref.getDownloadURL().then(url => {
                    props.storeUploadedFile({
                        link: url
                    });
                });
            });

            setProgress(Object.assign({}, defaultUploadingState, { done: true }));

            props.clearFiles();
        })
        .catch(error => console.log(error));
    };

    const removeFile = file => props.removeFile(file);

    return (
        <div className="wrapper">
            <div className="wrapper__header">
                <div className="wrapper__buttons">
                    <button className="wrapper__button" onClick={handleFileOpen}>Open</button>
                    { 
                        props.files.length 
                            ? <button className="wrapper__button" onClick={uploadFiles}>Upload</button>
                            : null
                    }
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept={AllowedFileTypes.join()} 
                        multiple
                        onChange={storeFiles}
                    />
                </div>
                <div className="wrapper__progress">
                    <div className="wrapper__filename">{progress.uploading ? progress.fileName : ''}</div>
                    <div className="wrapper__status">
                        { 
                            progress.uploading 
                                ? `Status: ${progress.status}%`
                                : null
                        }
                        {
                            progress.done
                                ? `Uploading done`
                                : null
                        }
                    </div>
                </div>
            </div>
            
            <div className="wrapper__content">
                {
                    !props.files.length
                        ? <div className="wrapper__plug">Select files to upload</div>
                        : props.files.map(
                            image => <Image 
                                        key={uuid()} 
                                        file={image}
                                        removeFile={removeFile}  
                                        setModal={handleModalSet} 
                                    />)
                }
            </div>
        </div>
    );
});
