import React, {FC, useContext} from 'react';
import cl from "./Chat.module.css";
import ChatActions from "./ChatActions";
import ChatMessages from "./ChatMessages";
import ChatContext from "../context";
import Skeleton from "react-loading-skeleton";

interface ChatProps {
    visible?: boolean,
}

const Chat: FC<ChatProps> = ({visible}) => {
    const {settings} = useContext(ChatContext);

    return (
        <>
            {visible && <div className={cl.ChatWindow}>

                {!settings.color ?
                    <Skeleton height={120} borderRadius="15px 15px 0 0" />
                    :
                    <div className={cl.ChatHeader} style={{background: settings.color}}>
                        <ChatActions/>
                    </div>
                }

                {settings.subheader?.length ?
                    <div className={cl.ChatSubHeader}>
                        {settings.subheader}
                    </div>
                :""}

                <ChatMessages />
            </div>}
        </>
    );
};

export default Chat;