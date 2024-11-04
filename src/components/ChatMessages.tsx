import React, {ChangeEvent, FC, Fragment, useContext, useEffect, useRef, useState} from 'react';
import cl from "./ChatMessages.module.css";
import {ChatMessage, Field, Option, OptionsType} from "../types";
import {useFetch} from "../hooks/useFetch";
import MessageService from "../API/MessageService";
import FormService from "../API/FormService";
import FloatingBlock from "./FloatingBlock";
import ChatContext from "../context";
import InputMask from "react-input-mask";

const initialState: ChatMessage[] = [];

interface LoadingComponentProps {
    name: string
}
const LoadingComponent: FC<LoadingComponentProps> = ({name}) => <div className={cl.LoadingMessage}>{name} печатает...</div>

const ChatMessages: FC = () => {
    const scrollTargetElementRef = useRef<HTMLDivElement>(null);
    const chatMessagesRef = useRef<HTMLDivElement>(null);
    const {setShowChat, setShowResultModal, settings} = useContext(ChatContext);

    const [chatMessages, setChatMessages] = useState<ChatMessage[]>(initialState);
    const [messages, setMessages] = useState<ChatMessage[]>(initialState);
    const [step, setStep] = useState<number>(0);
    const [isTyping, setIsTyping] = useState<boolean>(false);

    const [fields, setFields] = useState<Field>({});
    const [errors, setErrors] = useState<Field>({});

    const [fetchMessages, isLoading] = useFetch(async () => {
        const response = await MessageService.getActions();
        let fetchedMessages = response.data;

        if (fetchedMessages[0]?.id === 0) {
            const fetchedFields = fetchedMessages[0]?.options;
            const newFields: Field = {};

            fetchedFields.forEach((item: Option) => {
                newFields[item.name] = item.value ? item.value : undefined;
            });

            setFields({...newFields});
            fetchedMessages = fetchedMessages.splice(1);
        }

        setChatMessages(fetchedMessages);
        setStep(0);
    });

    useEffect(() => {
        fetchMessages();
    }, []);

    useEffect(() => {

        if (step < chatMessages.length && !chatMessages[step]?.isUser) {
            if (chatMessages[step]?.isUser !== true) {
                setIsTyping(true);
            }

            const intervalId = setTimeout(() => {
                //console.log('step', step + 1, 'id', chatMessages[step].id)
                setMessages([...messages, chatMessages[step]]);
                setIsTyping(false);
                setTimeout(() => scrollToEnd(), 100);

                if (!chatMessages[step].options || chatMessages[step].optionType === OptionsType.OPTIONS_FORM) {
                    setStep(step + 1);
                }
            }, chatMessages[step].delay || 1);

            return () => clearInterval(intervalId);
        }

        if (chatMessages[step]?.isUser) {
            setStep(step + 1);
        }

    }, [step, isLoading]);

    const scrollToEnd = () => {
        if (scrollTargetElementRef.current) {
            scrollTargetElementRef.current.scrollIntoView({
                behavior: 'smooth',
            });
        }
    }

    function handleOptionClick(messageId: number, option: Option) {
        //console.log(`S: ${step} M: ${messageId}, ${option.name}:${option.value} (${option.title}))`);

        setFields((prev) => ({
            ...prev,
            [option.name]: option.value,
        }));

        const newMessage: ChatMessage = {
            id: messageId + 1,
            isUser: true,
            delay: 0,
            content: option.title,
        };
        const prevMessages = messages.slice(0, messageId);
        setMessages([...prevMessages, newMessage]);
        //console.log('SS to ', messageId + 1);
        setStep(messageId);
    }

    // Form
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFields({...fields, [name]: value});
        setErrors({...errors, [name]: !value});
    };

    const [sendForm] = useFetch(async (data: Field[]) => {
        await FormService.sendForm(data);

        // Show result modal
        setShowChat(false);
        setShowResultModal(true);
    });

    const handleSubmit = async () => {
        const newErrors: Field = {};

        Object.keys(fields).forEach(key => {
            if (!fields[key]) {
                newErrors[key] = true;
            }
        });

        if (Object.keys(newErrors).length === 0) {
            await sendForm(fields);
            setShowChat(false);
            setShowResultModal(true);
        } else {
            setErrors(newErrors);
        }
    };

    return (
        <div className={cl.ChatMessages} ref={chatMessagesRef}>
            <FloatingBlock parentRef={chatMessagesRef} />

            <div className={cl.Operator}></div>

            {messages.map(message => <Fragment key={message.id}>
                {message.content && !message.optionType &&
                    <div className={message.isUser ? cl.UserMessage : cl.BotMessage} style={message.isUser ? {background: settings.color} : {}}
                         dangerouslySetInnerHTML={{ __html: message.content}}
                    ></div>
                }

                {/* AUTO */}
                {message.options?.length && message.optionType === OptionsType.OPTIONS_AUTO &&
                    <div className={cl.BotOptionsMessage} key={`${message.id}-options`}>
                        {message.options.map(option =>
                            <div className={cl.BotOptionsMessageItem} key={option.id}
                                 onClick={() => handleOptionClick(message.id, option)}
                            >
                                {option.badge && <span className={cl.OptionBadge} style={{background: settings.color}}>{option.badge}</span>}
                                <img src={option.image} alt={option.title}/>
                                <h2>{option.title}</h2>
                            </div>
                        )}
                    </div>
                }{/* END of AUTO */}

                {/* CHOICE */}
                {message.options?.length && message.optionType === OptionsType.OPTIONS_CHOICE &&
                    <div className={cl.BotOptionsChoiceMessage} key={`${message.id}-options`}>
                        {message.content && <div className={cl.BotOptionsChoiceMessageTitle}>{message.content}</div>}

                        <div className={cl.BotOptionsChoiceMessageOptions}>
                            {message.options?.map(option => {
                                if (option.dependency && (option.dependency.optionValue !== fields[option.dependency.optionName]))
                                    return false;

                                let classes = [ cl.BotOptionsChoiceMessageItem ];
                                if (fields[option.name] === option.value) {
                                    classes.push(cl.selected);
                                }

                                return <div className={classes.join(' ')} key={option.id}
                                            onClick={() => handleOptionClick(message.id, option)}
                                >
                                    {option.title}
                                </div>
                            })}
                        </div>
                    </div>
                }{/* END of CHOICE */}

                {/* FORM */}
                {message.options?.length && message.optionType === OptionsType.OPTIONS_FORM &&
                    <div className={cl.BotOptionsFormMessage}>
                        {message.options?.map(option => {
                            let classes = [ cl.BotOptionsFormMessageItem ];
                            //setFields({...fields, [option.name]: ''});

                            return <div className={classes.join(' ')} key={option.id}>
                                {option.type === "phone" ?
                                    <InputMask
                                        mask="+7 (999) 999-99-99"
                                        maskChar="_"
                                        name={option.name}
                                        placeholder={option.title}
                                        onChange={handleChange}
                                        className={errors[option.name] ? cl.error : ''}
                                    />
                                    :
                                    <input
                                        type="text"
                                        name={option.name}
                                        placeholder={option.title}
                                        onChange={handleChange}
                                        className={errors[option.name] ? cl.error : ''}
                                    />
                                }
                            </div>
                        })}
                    </div>
                }{/* END of FORM */}

                {/* NOTICE */}
                {message.content && message.optionType === OptionsType.OPTIONS_NOTICE &&
                    <div className={cl.BotOptionsNoticeMessage} dangerouslySetInnerHTML={{__html: message.content}}></div>
                }

                {/* SUBMIT */}
                {message.content && message.optionType === OptionsType.OPTIONS_SUBMIT &&
                    <div
                        className={cl.BotOptionsSubmitMessage}
                        onClick={handleSubmit}
                        style={{display: isLoading ? 'none' : 'block', background: settings.color}}
                    >
                        {message.content}
                    </div>
                }{/* END of SUBMIT */}

            </Fragment>)}

            {isTyping && <LoadingComponent name={settings.operator} />}

            <div className={cl.anchor} ref={scrollTargetElementRef}></div>
        </div>

    );
};

export default ChatMessages;