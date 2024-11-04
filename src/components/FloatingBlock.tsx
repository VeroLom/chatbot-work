import React, {FC, RefObject, useContext, useEffect, useLayoutEffect, useState} from 'react';
import cl from './FloatingBlock.module.css'
import ChatContext from "../context";

interface FloatingBlockProps {
    parentRef: RefObject<HTMLDivElement>;
}

const FloatingBlock: FC<FloatingBlockProps> = ({parentRef}) => {
    const [isSticky, setIsSticky] = useState<boolean>(false);
    const [chatBlockWidth, setChatBlockWidth] = useState<number>(0);
    const {settings} = useContext(ChatContext);

    useLayoutEffect(() => {
        if (parentRef.current) {
            setChatBlockWidth(parentRef.current.offsetWidth);
        }
    }, [parentRef, isSticky]);

    const classes = [ cl.FloatingBlock ];
    if (isSticky) {
        classes.push(cl.active);
    }

    useEffect(() => {
        const handleScroll = () => {
            const parentElement = parentRef.current;
            if (parentElement) {
                const offsetTop = parentElement.offsetTop;
                setIsSticky(window.scrollY >= offsetTop);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [parentRef]);

    return (
        <div
            className={classes.join(' ')}
            style={{width: chatBlockWidth}}
        >
            <div className={cl.BlockTitle}>
                <img src="/images/operator.jpg" alt="" />
                <div className={cl.BlockTitleContent}>
                    <div className={cl.OperatorName}>{settings.operator}</div>
                    <div className={cl.OperatorTitle}>Оператор салона КАН АВТО</div>
                </div>
            </div>
            <a className={cl.PhoneButton} href={settings.phone} style={{background: settings.color}}>
                {settings.phone}
            </a>
        </div>
    );
};

export default FloatingBlock;