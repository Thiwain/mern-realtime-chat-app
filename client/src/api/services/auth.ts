import LoginInterface from '../../interfaces/loginInterFace';
import axios from '../../lib/axios';

export const loginRequest = async (reqBody: LoginInterface) => {
    return axios.post('/v1/auth/login', reqBody);
};

export const signupRequest = async (reqBody: any) => {
    return axios.post('/v1/auth/signup', reqBody);
};

export const logoutRequest = async () => {
    return axios.post('/v1/logout');
};


export const validateAuthRequest = async () => {
    try {
        const response = await axios.get('/v1/validate',{});
        return response;
    } catch (error) {
        console.error('Validation failed:', error);
        throw error;
    }
};