import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Deriva o host a partir do Metro/Expo (mesma lógica do DoctorService):
// em LAN/dispositivo físico usa o IP da máquina; cai para 10.0.2.2 no
// emulador Android e localhost no iOS quando não há hostUri.
const debuggerHost = Constants.expoConfig?.hostUri?.split(':')[0];
const LOCAL_API_URL = debuggerHost
  ? `http://${debuggerHost}:8080/api`
  : Platform.OS === 'android'
    ? 'http://10.0.2.2:8080/api'
    : 'http://localhost:8080/api';

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || LOCAL_API_URL,
});

export default api;
