import { io, Socket } from 'socket.io-client';

const getBaseUrl = () => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  if (apiUrl.includes('/api')) {
    return apiUrl.replace(/\/api.*$/, '');
  }
  return apiUrl;
};

const BASE_URL = getBaseUrl();

let socket: Socket | null = null;

export const getSocket = (): Socket | null => {
  if (!socket) {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    socket = io(BASE_URL, {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      reconnectionDelayMax: 5000,
      upgrade: true,
      rememberUpgrade: true
    });
  }

  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

