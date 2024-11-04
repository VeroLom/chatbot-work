import React, {useEffect, useState} from 'react';
import cl from './ChatActions.module.css';
import {useFetch} from "../hooks/useFetch";
import ActionService from "../API/ActionService";
import {Action} from "../types";

const initialState: Action[] = [
    { id: 1, title: '' },
    { id: 2, title: '' },
    { id: 3, title: '' },
    { id: 4, title: '' },
];

const ChatActions = () => {
    const [actions, setActions] = useState([...initialState]);
    const [fetchActions] = useFetch(async () => {
        const response = await ActionService.getActions();
        setActions([...response.data]);
        //setActions([]);
    });

    useEffect(() => {
        fetchActions();
    }, []);

    return (
        <div className={cl.Actions}>
            {actions.length && actions.map(action =>
                <div className={cl.ActionItem} key={action.id}>
                    {action.icon && <img src={action.icon} alt="" />}
                    {action.title}
                </div>
            )}
        </div>
    );
};

export default ChatActions;