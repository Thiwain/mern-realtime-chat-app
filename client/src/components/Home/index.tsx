import {useContext, useEffect, useState} from 'react';
import {sendMessage,loadMessage} from "../../api/services/chat.ts";
import {handleNotificationClick} from "../../utils/handleNotificationClick.tsx";
import {AuthContext} from "../../context/AuthContext.tsx";
import ChatItem from "../ChatItem";
import {logoutRequest} from "../../api/services/auth.ts";

const styles = {
    scrollContainer: {
        height: '80vh',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px',
    },
};

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // @ts-ignore
    const {user}=useContext(AuthContext);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => console.log("Connected to WebSocket server");
        ws.onclose = () => console.log("Disconnected from WebSocket server");

        ws.onmessage = (event) => {
            try {
                const receivedMessage = JSON.parse(event.data);
                // @ts-ignore
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
                handleNotificationClick(receivedMessage.message);
            } catch (error) {
                console.error("WebSocket message parsing error:", error);
            }
        };

        loadMessage()
            .then((response) => {
                if (response.status === 200) {
                    setMessages(response.data.messages);
                }
            })
            .catch((error) => {
                console.error('Error loading messages:', error);
                alert('Failed to load messages.');
            });

        return () => {
            ws.close();
        };
    }, []);

    const handleSendMessage = async () => {
        const messageData = { sentBy: user.email, message: newMessage };
        try {
            const response = await sendMessage(messageData);
            if (response.status === 201) {
                setNewMessage('');
            } else {
                alert('Error sending message.');
            }
        } catch (error) {
            console.error("Send message error:", error);
            alert('Failed to send message.');
        }
    };

    const handleLogout=async ()=>{
        try {
            await logoutRequest();
            setTimeout(() => {
                window.location.reload();
            }, 200);
        } catch (error) {
            console.error('Error logging out', error);
            alert('Failed to log out. Please try again.');
        }
    }

    return (
        <div>
            <span>
                <label style={{ fontSize: '20px' }}>🏚️ <b>ChatRoom</b></label>&nbsp;&nbsp;&nbsp;
                <input type="button" onClick={handleLogout} value="⚠️ Logout" />
            </span>
            <br />
            <hr />
            {/* @ts-ignore */}
            <div style={styles.scrollContainer}>
                <ul>
                    {messages.map((msg: any) => (
                        <ChatItem
                            key={msg.createdAt} // Use unique identifier if available
                            createdAt={msg.createdAt}
                            sentBy={msg.sentBy}
                            message={msg.message}
                        />
                    ))}
                </ul>
            </div>
            <hr/>
            <div>
                <span>
                    <input
                        type="text"
                        style={{width: '85%'}}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    &nbsp;&nbsp;
                    <input type="button" value={'send 🚀'} style={{ width: '13%' }} onClick={handleSendMessage} />
                </span>
            </div>
            <hr />
        </div>
    );
};

export default Home;
