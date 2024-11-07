import { useContext, useEffect, useState } from 'react';
import { sendMessage, loadMessage } from "../../api/services/chat";
import { handleNotificationClick } from "../../utils/handleNotificationClick";
import { AuthContext } from "../../context/AuthContext";
import ChatItem, {ChatItemInterface} from "../ChatItem";
import { Box, Button, TextField, List } from "@mui/material";
import Header from "../Header";

const Home = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => console.log("Connected to WebSocket server");
        ws.onclose = () => console.log("Disconnected from WebSocket server");

        ws.onmessage = (event) => {
            try {
                const receivedMessage = JSON.parse(event.data);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
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

    return (
        <Box display="flex" flexDirection="column" height="100vh">
            {/* Header */}
            <Header/>

            {/* Messages Container */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    p: 2,
                }}
            >
                <List>
                    {messages.map((msg:ChatItemInterface) => (
                        <ChatItem
                            key={Number(msg.createdAt)}
                            createdAt={msg.createdAt}
                            sentBy={msg.sentBy}
                            message={msg.message}
                        />
                    ))}
                </List>
            </Box>

            {/* Input and Send Button */}
            <Box
                component="form"
                display="flex"
                alignItems="center"
                p={2}
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: 'background.paper',
                    borderTop: '1px solid #ccc',
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    sx={{ mr: 2 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSendMessage}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    Send 🚀
                </Button>
            </Box>
        </Box>
    );
};

export default Home;
