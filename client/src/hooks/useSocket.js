import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef(null);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5001';
    
    // Initialize Socket.IO connection
    socketRef.current = io(API_URL, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const onUrlClicked = useCallback((callback) => {
    if (socketRef.current) {
      socketRef.current.on('urlClicked', callback);
      
      return () => {
        socketRef.current?.off('urlClicked', callback);
      };
    }
  }, []);

  return {
    socket: socketRef.current,
    onUrlClicked
  };
};
