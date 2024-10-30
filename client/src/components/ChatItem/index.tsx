import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext.tsx";

interface ChatItemInterface {
    key: number;
    createdAt: string;
    sentBy: string;
    message: string;
}

const ChatItem = (props: ChatItemInterface) => {
    // @ts-ignore
    const { user } = useContext(AuthContext);
    const [color, setColor] = useState('green');

    useEffect(() => {
        setColor(props.sentBy === user.email ? 'blue' : 'green');
    }, [props.sentBy, user.email]);

    return (
        <li key={props.key} style={{ marginTop: '20px' }}>
            <button>{new Date(props.createdAt).toLocaleTimeString()}</button>
            &nbsp;:&nbsp;
            <b style={{ color }}>{props.sentBy}</b>
            &nbsp;:&nbsp;{props.message}
        </li>
    );
};

export default ChatItem;
