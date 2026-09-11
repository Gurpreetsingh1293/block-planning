import { io } from 'socket.io-client';

const rawUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://block-planning-backend.onrender.com' : 'http://localhost:5000');
const BACKEND_URL = rawUrl.replace(/\/+$/, '');

let socketInstance = null;

/**
 * Returns a persistent Socket.io singleton instance.
 * Automatically joins the 'join:timeline' room on connection.
 */
export function getSocket() {
  if (!socketInstance) {
    socketInstance = io(BACKEND_URL, {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketInstance.on('connect', () => {
      console.log('[Socket.io] Connected:', socketInstance.id);
      // Join the timeline room for block planning updates
      socketInstance.emit('join:timeline');
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('[Socket.io] Disconnected:', reason);
    });

    socketInstance.on('connect_error', (err) => {
      console.warn('[Socket.io] Connection error (backend may be offline):', err.message);
    });

    socketInstance.on('timeline:joined', (data) => {
      console.log('[Socket.io] Joined timeline room:', data.message);
    });
  }

  return socketInstance;
}

/**
 * Disconnect and reset the socket singleton
 */
export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}

export default getSocket;
