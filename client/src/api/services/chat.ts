import axios from "../../lib/axios";

export const sendMessage= async (reqBody:any) => {
    return axios.post('/v1/chat/send', reqBody);
}

export const loadMessage= async () => {
    return axios.get('/v1/chat/load');
}
