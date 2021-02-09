import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { v4 as uuid } from 'uuid';


const mapStateToProps = state => ({
    files: state.uploadedReducer.files
});

const Uploaded = connect(mapStateToProps)((props) => {
    if (!props.files.length) return null;

    const contentRef = useRef();
    const bodyRef = useRef();
    const buttonUpRef = useRef();
    const buttonDownRef = useRef();

    const pictureHeight = 88;

    const handleClick = direction => {
        const content = contentRef.current;
        
        if (direction === 'down') {
            if (content.clientHeight + content.offsetTop > bodyRef.current.clientHeight) {
                content.style.top = content.offsetTop - pictureHeight + "px";
                content.classList.add('moving');
            }
        } else {
            if (content.offsetTop + pictureHeight <= 0) {
                content.style.top = content.offsetTop + pictureHeight + "px";
                content.classList.add('moving');
            }
        }

        const transitionendEvent = () => {
            handleButtonsAppearing(content);

            content.classList.remove('moving');
            content.removeEventListener('transitionend', transitionendEvent);
        };

        content.addEventListener('transitionend', transitionendEvent);

    };

    const handleButtonsAppearing = content => {
        if (content.offsetTop + pictureHeight > 0) {                                        // Button UP
            buttonUpRef.current.classList.add('hidden');
        } else {
            buttonUpRef.current.classList.remove('hidden');
        }

        if (content.clientHeight + content.offsetTop <= bodyRef.current.clientHeight) {     // Button Down
            buttonDownRef.current.classList.add('hidden');
        } else {
            buttonDownRef.current.classList.remove('hidden');
        }
    };

    useEffect(() => {
        if (!contentRef.current) return;

        new ResizeObserver(() => {
            if (contentRef.current.clientHeight > bodyRef.current.clientHeight) {
                buttonDownRef.current.classList.remove('hidden');
            }
        }).observe(contentRef.current);
    });

    return (
        <div className="uploaded">
            <div className="uploaded__header">Uploaded files</div>
            <div className="uploaded__body" ref={bodyRef}>
                <button ref={buttonUpRef} onClick={() => handleClick('up')} className="uploaded__button uploaded__button--up hidden"></button>
                <button ref={buttonDownRef} onClick={() => handleClick('down')} className="uploaded__button uploaded__button--down hidden"></button>
                <div className="uploaded__content" ref={contentRef}>
                    {
                        props.files.map(file => {
                            return (
                                <a key={uuid()} href={file.link} target="_blank" rel="noreferrer">
                                    <img className="uploaded__picture" src={file.link} alt=""/>
                                </a>
                            );
                        })
                    }
                </div>
            </div>
        </div>
    );
});

export default Uploaded;