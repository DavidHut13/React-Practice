import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-a5a68.firebaseio.com'
});

export default instance;