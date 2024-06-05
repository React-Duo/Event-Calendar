import "./Chat.css"
import { useState, useEffect, useContext } from "react"
import { getChatMessages, updateMessages, listenForChatMessages } from "../../service/database-service"
import PropTypes from "prop-types";
import AuthContext from "../../context/AuthContext";




const Chat = ({ listId, setContentIn }) => {
    const [messages, setMessages] = useState([])
    const { isLoggedIn } = useContext(AuthContext);

    const [currentMessage, setCurrentMessage] = useState({
        name: isLoggedIn.user,
        message: ''
    })



    useEffect(() => {
        const fetchMessages = async () => {
            const messagesObject = await getChatMessages(listId);
            setMessages(messagesObject || []);
        }
        fetchMessages();
    }, [listId]);

    useEffect(() => {
        const handleNewMessages = (newMessages) => {
            setMessages(newMessages);
        };
        listenForChatMessages(listId, handleNewMessages);
    }, [listId]);

    const sendMessage = async (message) => {
        if (message.message.trim() === "") return;
        const newMessages = [...messages, message];
        await updateMessages(listId, newMessages);
        setMessages(newMessages);
        setCurrentMessage({
            name: isLoggedIn.user,
            message: ''
        });
    }

    return (
        <div className="chat-container">
        <div className="message-header">
            <h2>Chat</h2>
            <button onClick={() => setContentIn("members")} className="button--icon">X</button>
        </div>
        <div className="message-area">
            {messages.map((message, index) => (
                <div key={index} className={`message ${message.name === isLoggedIn.user ? 'user-message' : ''}`}>
                    <h4>{message.name}</h4>
                    <p>{message.message}</p>
                </div>
            ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(currentMessage); }}>
            <div className="input-area">
                <input id="messageInput" type="text" placeholder="Message..." value={currentMessage.message} onChange={(e) => setCurrentMessage({ ...currentMessage, message: e.target.value })} />
                <button id="sendButton" type="submit"><i className="fa-regular fa-paper-plane fa-xl"></i></button>
            </div>
        </form>
    </div>
    )
}

Chat.propTypes = {
    listId: PropTypes.string.isRequired,
    setContentIn: PropTypes.func.isRequired
}

export default Chat