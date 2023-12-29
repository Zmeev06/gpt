import React, { useState, useEffect } from 'react';
import Gpt from '../components/Gpt/Gpt';
import NavigationsMidj from '../components/NavigationsMidj/NavigationsMidj';
import ChatBlock from '../components/ChatBlock/ChatBlock';
import MessageAdd from '../components/MessageAdd/MessageAdd';
import ChatBlockHead from '../components/ChatBlockHead/ChatBlockHead';
import { useRef } from 'react';
import MessageMidjorney from '../components/MessageMidjorney/MessageMidjorney';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import MessageMy from '../components/MessageMy/MessageMy';
import gptBot from '../images/chat/chatgpt_ic.png';
import { setNewStatus } from '../redux/slices/statusMidSlice';
import TokenModal from '../components/tokenModal/TokenModal';
import { MidjourneySlider } from '../components/MidjourneySlider';


const MidjourneyPage = ({ folders, chats }) => {
  const { chatId } = useParams();
  const scrollBottom = useRef();
  const [activeTab, setActiveTab] = useState('gpt');
  const [messages, setMessages] = useState([]);
  const [midjData, setMidjData] = useState(null);
  const [messagesWidth, setMessagesWidth] = useState(messages.length);
  const [myMessages, setMyMessages] = useState({ type: 'text', messages: [] });
  const [messageType, setMessageType] = useState('');
  const [isEmpty, setIsEmpty] = useState(true);
  const status = useSelector((state) => state.status);
  const [firstMessage, setFirstMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('В очереди');
  const [chatType, setChatType] = useState();
  const dispatch = useDispatch();
  const fetchStatus = useSelector(state => state.error)
  const user = useSelector(state => state.user)
  const [isEmptyMes, setIsEmptyMes] = useState(true)
  const [text, setText] = useState('');

  useEffect(() => {
    lastMessageScroll('smooth');
    if (messages.length !== messagesWidth) lastMessageScroll('smooth');
  }, []);

  function MidjCallBack(data) {
    setMidjData(data);
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  const getMessages = (id) => {
    axios
      .get(`https://ziongpt.ai/api/v1/messages/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + getCookie('token')
        }
      })

      .then((res) => {
        setMyMessages(res.data);
        if (res.data.messages.length !== 0 && res.data.type === 'image') {
          setMessageType('image');
          setIsEmpty(false);
          setFirstMessage(res.data.messages[0].prompt);
          setChatType(res.data.messages[0].ai_model);
        } else if (res.data.messages.length !== 0 && res.data.type === 'text') {
          setMessageType('text')
        } else {
          setIsEmpty(true);
        }
      });
  };

  useEffect(() => {
    dispatch(setNewStatus('ready'));
  }, [chatId]);

  useEffect(() => {
    if (status.value === 'ready') {
      setFirstMessage('');
    }

    if (chatId) {
      getMessages(chatId);
    }
    if (status.value === 'banned') {
      setStatusMessage('Ошибка');
    } else if (status.value === 'error') {
      setStatusMessage('Ошибка');
    } else if (status.value === 'ready') {
      setStatusMessage('');
    } else if (status.value === 'in_proсess') {
      setStatusMessage('Генерация...');
    } else {
      setStatusMessage('В очереди');
    }
  }, [chatId, status.value]);

  function lastMessageScroll(b) {
    if (!scrollBottom.current) return;

    scrollBottom.current.scrollIntoView({
      behavior: b || 'auto',
      block: 'end'
    });
  }

  function newChatName(e, models) {
    let model;
    if (models[0] === true) model = 'gpt-3.5-turbo';
    else if (models[1] === true) model = 'gpt-4';
    else if (models[2] === true) model = 'gpt-4-1106-preview';
    else if (models[3] === true) model = 'mj';
    else if (models[4] === true) model = 'dall-e-2';
    else if (models[5] === true) model = 'dall-e-3';
    else if (models[6] === true) model = 'sd';
    setFirstMessage(e);
    if (messages.length === 0) {
      fetch(
        `https://ziongpt.ai/api/v1/chatsession/${
          window.location.href.split('/')[window.location.href.split('/').length - 1]
        }/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Token ' + getCookie('token')
          },
          body: JSON.stringify({
            ai_model: model,
            name: e.substring(0, 15)
          })
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          setFirstMessage(data.name);
        });
    }
  }
console.log('sdc', chatType);
  return (
    <div>
      <div className="content-page">
        <div className="content">
          <div className="container-back-mid">
            {messages.length ? <ChatBlockHead type={messageType} /> : null}
          </div>
          
          <div className="container-back-mid">
            {!messages.length && (
              <NavigationsMidj activeTab={activeTab} setActiveTab={setActiveTab}/>
            )}
          </div>
          {
            activeTab === 'mj' && <div className="container-back-mid">{!messages.length && <MidjourneySlider text={text} setText={setText}/>}</div>
          }
          {activeTab === 'gpt' && (
            <div className="container-back-mid">{!messages.length && <Gpt />}</div>
          )}

          <div className="container-back-mid">
            {firstMessage && (chatType === 'mj' || myMessages.type === 'image') && (

              <MessageMy
                setMessages={setFirstMessage}
                chatId={chatId}
                newChatName={newChatName}
                index={0}
                messages={[]}
                messageText={firstMessage}
                mine
                avatar={`https://ziongpt.ai${user.avatar}`}
              />
            )}

            {myMessages.messages.map((item, index) => (
              <MessageMidjorney
                message={item}
                midjData={myMessages}
                MidjCallBack={MidjCallBack}
                type={myMessages.type}
                index={index}
                key={index}
              />
            ))}
            {fetchStatus.value === 426 ? <TokenModal /> : null}
            {messageType !== 'text' && (status.value === 'in_queue' ? (
              <MessageMy
                setMessages={setStatusMessage}
                chatId={chatId}
                newChatName={newChatName}
                index={0}
                messages={[]}
                messageText={'В очереди'}
                avatar={gptBot}
              />
            ) : status.value === 'in_process' ? (
              <MessageMy
                setMessages={setStatusMessage}
                chatId={chatId}
                newChatName={newChatName}
                index={0}
                messages={[]}
                messageText={'Генерация'}
                avatar={gptBot}
              />
            ) : status.value === 'error' ? (
              <MessageMy
                setMessages={setStatusMessage}
                chatId={chatId}
                newChatName={newChatName}
                index={0}
                messages={[]}
                messageText={'Ошибка'}
                avatar={gptBot}
              />
            ) : null)}
          </div>

          {messageType === 'text' ? <ChatBlock
            type={messageType}
            setMessages={setMessages}
            chatId={chatId}
            newChatName={newChatName}
            messages={messages}
            scrollBottom={scrollBottom}
          /> : null}
          
          <MessageAdd
            isEmpty={isEmpty}
            MidjCallBack={MidjCallBack}
            activeItems={activeTab}
            chatId={chatId}
            setMessages={setMessages}
            messages={messages}
            newChatName={newChatName}
            changeActiveItems={setActiveTab}
            setMessageType={setMessageType}
            setIsEmptyMes={setIsEmptyMes}
            text={text}
            setText={setText}
          />
        </div>

      </div>

    </div>
  );
};

export default MidjourneyPage;
