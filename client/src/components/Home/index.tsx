import { useEffect, useState } from 'react';
import NotificationButton from './NotificationButton';
import {sendMessage,loadMessage} from "../../api/services/chat.ts";

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

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => console.log("Connected to WebSocket server");
        ws.onclose = () => console.log("Disconnected from WebSocket server");

        ws.onmessage = (event) => {
            try {
                const receivedMessage = JSON.parse(event.data);
                // @ts-ignore
                setMessages((prevMessages) => [...prevMessages, receivedMessage]);
            } catch (error) {
                console.error("WebSocket message parsing error:", error);
            }
        };

        // Load initial messages from the API
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
        const messageData = { sentBy: 'thiwainm@gmail.com', message: newMessage };
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

    return (
        <div>
            <span>
                <label style={{ fontSize: '20px' }}>🏚️ <b>ChatRoom</b></label>&nbsp;&nbsp;&nbsp;
                <input type="button" onClick={() => console.log('Logging out...')} value="⚠️ Logout" />
            </span>
            <NotificationButton />
            <br />
            <hr />
            {/* @ts-ignore */}
            <div style={styles.scrollContainer}>
                <ul>
                    {messages.map((msg:any, index) => (
                        <li key={index} style={{marginTop:'20px'}}>
                            <button>{new Date(msg.createdAt).toLocaleTimeString()}</button>&nbsp;
                            :&nbsp;<b style={{ color: 'black' }}>{msg.sentBy}</b>&nbsp;:&nbsp;{msg.message}
                        </li>
                    ))}
                </ul>
            </div>
            <hr />
            <div>
                <span>
                    <input
                        type="text"
                        style={{ width: '85%' }}
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
