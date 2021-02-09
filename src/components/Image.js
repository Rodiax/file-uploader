import React, { useRef } from 'react';

export default function Image({ file, setModal, removeFile }) {
    const wrapperRef = useRef();

    const onRemove = () => {
        wrapperRef.current.classList.add('removing');
        
        wrapperRef.current.addEventListener('transitionend', () => {
            removeFile(file);
        });
    };
    
    return (
        <div className="wrapper__image picture-preview" ref={wrapperRef}>
            <div className="picture-preview__description">
                <span className="picture-preview__title">{file.name}</span>
                <span onClick={onRemove}>&times;</span>
            </div>
            <img className="picture-preview__image" src={file.result} alt={file.name} onClick={() => setModal({ file, closed: false })} />
        </div>
    );    
}
