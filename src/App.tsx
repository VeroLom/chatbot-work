import React, {useEffect, useState} from 'react';
import Chat from "./components/Chat";
import Header from "./components/Header";
import cl from "./App.module.css";
import Modal from "./components/Modal";
import ChatContext from "./context";
import {useFetch} from "./hooks/useFetch";
import SettingsService from "./API/SettingsService";
import {Settings} from "./types";

const initialState: Settings = {
    brand: "",
    address: "",
    color: "",
    phone: "",
    requisites: "[ООО \"ДИЛЕР\"]",
    operator: "",
    subheader: "",
};

function App() {
    const [modalActive, setModalActive] = useState<boolean>(false);
    const [showChat, setShowChat] = useState(true);
    const [showResultModal, setShowResultModal] = useState(false);

    const [settings, setSettings] = useState(initialState);
    const [fetchSettings] = useFetch(async () => {
        const response = await SettingsService.getActions();
        setSettings({...response.data});
    });

    useEffect(() => {
        fetchSettings();
    }, []);

    function handleClick() {
        setModalActive(false);
    }

    return (
        <ChatContext.Provider value={{
            showChat,
            setShowChat,
            showResultModal,
            setShowResultModal,
            settings
        }}>
            <div className={cl.wrapper}>
                <div className={cl.bg}></div>

                <Header />

                {showChat && <div className={cl.container}>
                    <h1>Онлайн-калькулятор стоимости {settings.brand}<br className={cl.break} /> в Казани <span className={cl.disclaimer} onClick={() => setModalActive(true)}></span></h1>
                    <h2>Узнайте реальную стоимость {settings.brand} от официального дилера</h2>

                    <Chat visible={showChat}/>
                </div>}

                <div className={cl.requisites} dangerouslySetInnerHTML={{__html: settings.requisites}}></div>

                <Modal
                    visible={modalActive}
                    setIsVisible={handleClick}
                    hasShadow={true}
                    hasCloseButton={true}
                    content={<div>Изложенная на данном сайте информация носит ознакомительный характер не является публичной офертой, определяемой положениями статей 435 и 437 Гражданского Кодекса Российской Федерации. Подробности актуальных предложений доступны в салоне {settings.brand} КАН АВТО. Указанные на сайте цены, комплектации и технические характеристики, а также условия гарантии могут быть изменены в любое время без специального уведомления. Внешний вид товара, включая цвет, могут отличаться от представленных на фотографиях. Товар сертифицирован.</div>}
                />

                <Modal
                    visible={showResultModal}
                    setIsVisible={() => {}}
                    content={
                        <div style={{textAlign: 'center', padding: '3rem 4rem 4rem'}}>
                            <img style={{width: 68, marginBottom: '.75rem'}} src="/images/success-icon.png" alt="" />
                            <div style={{fontSize: 24, fontWeight: 700, marginBottom: '1rem'}}>Ваша заявка принята!</div>
                            <div style={{fontSize: 24, fontWeight: 700}}>Благодарим за обращение<br />и скоро свяжемся с Вами.</div>
                        </div>
                    }
                />

            </div>
        </ChatContext.Provider>
    );
}

export default App;
