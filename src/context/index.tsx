import React, {createContext, Dispatch} from "react";
import {Settings} from "../types";

interface ChatContextType {
    showChat: boolean,
    setShowChat: Dispatch<React.SetStateAction<boolean>>,
    showResultModal: boolean,
    setShowResultModal: Dispatch<React.SetStateAction<boolean>>,
    settings: Settings
}

const defaultContext: ChatContextType = {
    showChat: true,
    setShowChat: () => {},
    showResultModal: false,
    setShowResultModal: () => {},
    settings: {
        brand: "",
        phone: "",
        requisites: "",
        color: "",
        address: "",
        operator: "",
        subheader: "",
    },
}

const ChatContext = createContext<ChatContextType>(defaultContext);

export default ChatContext;