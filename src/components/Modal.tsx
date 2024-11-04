import React, {FC, ReactNode} from 'react';
import cl from './Modal.module.css';

interface ModalProps {
    content: ReactNode,
    visible?: boolean,
    setIsVisible: () => void,
    hasShadow?: boolean,
    hasCloseButton?: boolean,
}

const Modal: FC<ModalProps> = ({content, visible, setIsVisible, hasShadow, hasCloseButton}) => {
    const classes = [cl.modalWrapper];
    if (visible) {
        classes.push(cl.active);
    }
    if (hasShadow) {
        classes.push(cl.hasShadow);
    }

    return (
        <div className={classes.join(' ')}>
            <div className={cl.modalContent}>
                {hasCloseButton && <span className={cl.close} onClick={setIsVisible}>✖</span>}
                {content}
            </div>
        </div>
    );
};

export default Modal;