import React, { useState, useEffect } from 'react'
import Midjourney from '../components/Midjourney/Midjourney'
import Gpt from '../components/Gpt/Gpt'
import NavigationsMidj from '../components/NavigationsMidj/NavigationsMidj'
import ChatBlock from '../components/ChatBlock/ChatBlock'
import MessageAdd from '../components/MessageAdd/MessageAdd'
import SendMessage from '../images/chat/sendMes.svg'
import GptUser from '../images/chat/mi_ic.png';
import GptAva from '../images/chat/chatgpt_ic.png'
import ChatBlockHead from '../components/ChatBlockHead/ChatBlockHead'
import MidjourneyTabs from '../components/MidjourneyTabs/MidjourneyTabs'
import ModalDelete from '../components/ModelDelete/ModalDelete'
import { useParams } from 'react-router-dom';
import { useRef } from 'react'
import MessageMidjorney from '../components/MessageMidjorney/MessageMidjorney'


const MidjourneyPage = ({ folders, chats }) => {
    const { chatId } = useParams();
    const scrollBottom = useRef();
    const [activeItems, setActiveItems] = useState([false, true, false, false, false, false, false,]);
    const [messages, setMessages] = useState(
        []
    )
    const [midjData, setMidjData] = useState('')
    const [messagesWidth, setMessagesWidth] = useState(messages.length)


    setTimeout(() => {
        lastMessageScroll('smooth');
        if (messages.length != messagesWidth) lastMessageScroll('smooth');
    }, [])

    function MidjCallBack(data) {
        setMidjData(data)
    }


    function lastMessageScroll(b) {

        if (!scrollBottom.current) return;

        scrollBottom.current.scrollIntoView({
            behavior: b || 'auto',
            block: 'end',
        });
    }



    function newChatName(e, models) {
        let model;
        if (models[0] == true) model = 'gpt-3.5-turbo'
        else if (models[1] == true) model = 'gpt-4'
        else if (models[2] == true) model = 'gpt-4-1106-preview'
        else if (models[3] == true) model = 'mj'
        else if (models[4] == true) model = 'dall-e-2'
        else if (models[5] == true) model = 'dall-e-3'
        else if (models[6] == true) model = 'sd'

        if (messages.length == 0) {

            fetch(`http://mindl.in:8000/api/v1/chatsession/${window.location.href.split('/')[window.location.href.split('/').length - 1]}/`, {

                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Token " + document.cookie.split('=')[1],
                },
                body: JSON.stringify({
                    "ai_model": model,
                    "name": e.substring(0, 15)
                })
            }).then(response => response.json())
                .then(data => console.log(data));
        }
    }



    return (
        <div>
            <div className="content-page">
                <div className="content">


                    <div className="container-back-mid">
                        {messages.length ? <ChatBlockHead /> : null}
                    </div>

                    <div className="container-back-mid">
                        {!messages.length && <NavigationsMidj activeItems={activeItems} setActiveItems={setActiveItems} />}
                    </div>

                    {activeItems[0] || activeItems[1] || activeItems[2] ? (
                        <div className="container-back-mid">
                            {!messages.length && <Gpt />}
                        </div>
                    ) : null}
                    {activeItems[3] || activeItems[4] || activeItems[5] || activeItems[6] ? (
                        <div className="container-back-mid">
                            {!messages.length && <MessageMidjorney midjData={midjData} />}
                        </div>
                    ) : null}



                    <ChatBlock setMessages={setMessages} chatId={chatId} newChatName={newChatName} messages={messages} scrollBottom={scrollBottom} />
                    <MessageAdd MidjCallBack={MidjCallBack} activeItems={activeItems} chatId={chatId} setMessages={setMessages} messages={messages} newChatName={newChatName} />
                </div>
            </div>

        </div>
    )
}

export default MidjourneyPage