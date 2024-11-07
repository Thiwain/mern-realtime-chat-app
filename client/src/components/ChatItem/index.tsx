import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import {  Typography, Button, ListItem } from "@mui/material";

export interface ChatItemInterface {
    key: number;
    createdAt: string;
    sentBy: string;
    message: string;
}

const ChatItem = ({ key, createdAt, sentBy, message }: ChatItemInterface) => {
    const { user }:any = useContext(AuthContext);
    const [color, setColor] = useState("green");

    useEffect(() => {
        setColor(sentBy === user.email ? "blue" : "green");
    }, [sentBy, user.email]);

    return (
        <ListItem
            key={key}
            sx={{
                mt: 2,
                display: "flex",
                alignItems: "center",
                padding: 0,
            }}
        >
            <Button
                variant="text"
                color="inherit"
                sx={{ minWidth: 0, color: "gray", textTransform: "none" }}
            >
                {new Date(createdAt).toLocaleTimeString()}
            </Button>
            <Typography component="span" sx={{ mx: 1, color: color, fontWeight: "bold" }}>
                {sentBy}
            </Typography>
            <Typography component="span" sx={{ color: "text.primary" }}>
                : {message}
            </Typography>
        </ListItem>
    );
};

export default ChatItem;
