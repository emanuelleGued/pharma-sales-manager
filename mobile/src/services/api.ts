import axios from 'axios';

const api = axios.create({
  baseURL: 'http://SEU_IP:8080',
});

export default api;