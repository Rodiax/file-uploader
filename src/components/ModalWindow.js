import React, { useRef } from 'react';
import { connect } from 'react-redux';


const mapStateToProps = state => ({
    file: state.modalReducer.file,
    closed: state.modalReducer.closed,
    files: state.fileReducer.files
});

const mapDispatchToProps = {
    setModal: settings => ({
        type: 'SET_MODAL',
        payload: settings
    }),

    removeFile: file => ({
        type: 'REMOVE_FILE',
        payload: file
    })
};

const ModalWindowControls = ({ length, switchFile, currentIndex }) => {
    if (length < 2) return null;

    return (
        <div className={
            `controls-shift 
            ${currentIndex === 0 && 'justify-end'} 
            ${(currentIndex > 0 && currentIndex < length - 1) && 'justify-between'}
            ${currentIndex === length - 1 && 'justify-start'}
        `}>
            { currentIndex > 0 && <button className="controls-shift__left" onClick={() => switchFile('left')}></button> }
            { currentIndex < length - 1 && <button className="controls-shift__right" onClick={() => switchFile('right')}></button> } 
        </div> 
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(function ModalWindow(props) {
    const contentRef = useRef();

    const onClose = event => {
        if (!['modal-window', 'modal-close'].includes(event.target.id)) return;

        props.setModal({
            closed: true
        });
    };

    const onDelete = () => {
        contentRef.current.classList.add('removing');

        const transitionendEvent = () => {
            contentRef.current.classList.remove('removing');

            props.setModal({
                closed: true,
                file: null
            });

            props.removeFile(props.file);
        };

        contentRef.current.addEventListener('transitionend', transitionendEvent);
    };

    const switchFile = direction => {
        let fileIndex = props.files.indexOf(props.file);   
        
        if (direction === 'left') 
            fileIndex--;
        
        if (direction === 'right') 
            fileIndex++;

        props.setModal({
            closed: false,
            file: fileIndex > -1 ? props.files[fileIndex] : null
        });
    };

    return (
        props.file ? 
            <div className={`modal ${props.closed ? 'hidden' : ''}`} id="modal-window" onClick={onClose}>
                <div className="modal__content" ref={contentRef}>
                    <div className="modal__title">
                        <div className="modal__name">{ props.file.name }</div>
                        <div className="modal__options">
                            <span className="modal__button modal__button--delete" onClick={onDelete}>Delete</span>
                            <span className="modal__button" id="modal-close" onClick={onClose}>&times;</span>
                        </div>
                    </div>
                    <div className="modal__image">
                        <img src={props.file.result} alt={props.file.name} />
                        <div className="modal__controls">
                            <ModalWindowControls 
                                length={props.files.length} 
                                switchFile={switchFile} 
                                currentIndex={props.files.indexOf(props.file)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        : null
    );
})

