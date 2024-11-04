import React, {useContext} from 'react';
import cl from "./Header.module.css";
import ChatContext from "../context";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'


const Header = () => {
    const {settings} = useContext(ChatContext);
    const address = Array.isArray(settings.address)
        ? settings.address.join('<br>')
        : settings.address;

    return (
        <div className={cl.header}>
            <div>
                <div className={cl.logos}>
                    <div className={cl.logosImages}>
                        <a href="/">
                            <img src="/images/logo-kan.svg" alt="КАН АВТО" />
                        </a>
                        <a href="/">
                            <img src="/images/logo.png" alt={settings.brand} />
                        </a>
                    </div>

                    <div className={cl.split}></div>

                    <div className="title"><span>Официальный дилер {settings.brand}</span> <br className={cl.break} />КАН АВТО</div>
                </div>
            </div>
            <div className={cl.address}>
                {!settings.phone ? <Skeleton width={190} height={25} /> : ''}
                <div className={cl.phone}>
                    <a href={settings.phone}>{settings.phone}</a>
                </div>
                {!settings.address ? <Skeleton width={215} height={17} /> : ''}
                <div className="address" dangerouslySetInnerHTML={{__html: address}}></div>
            </div>
        </div>
    );
};

export default Header;