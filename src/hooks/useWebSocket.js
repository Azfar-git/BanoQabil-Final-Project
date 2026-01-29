import { useEffect, useRef, useState, useCallback } from 'react';

const useWebSocket = (url) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  const wsRef = useRef(null);

  const connect = useCallback(() => {
    if (!url) return;

    try {
      // In a real app, this would connect to a WebSocket server
      // For now, we'll simulate the connection
      console.log('Simulating WebSocket connection to:', url);
      setIsConnected(true);
      
      // Simulate receiving messages
      const interval = setInterval(() => {
        setData({
          type: 'message',
          payload: {
            timestamp: new Date().toISOString(),
            message: 'Simulated message from server',
          },
        });
      }, 5000);

      return () => clearInterval(interval);
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
    }
  }, [url]);

  const disconnect = useCallback(() => {
    setIsConnected(false);
  }, []);

  const send = useCallback((message) => {
    if (isConnected) {
      console.log('Sending message:', message);
      // In a real app, this would send data through WebSocket
    }
  }, [isConnected]);

  useEffect(() => {
    const cleanup = connect();
    return () => {
      cleanup?.();
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    data,
    isConnected,
    error,
    send,
    connect,
    disconnect,
  };
};

export default useWebSocket;
