import { useEffect, useRef, useState, useCallback } from "react";

const useWebSocket = (url) => {
  const [data, setData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const wsRef = useRef(null);

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      console.log("Disconnecting...");
      clearInterval(wsRef.current);
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const connect = useCallback(() => {
    if (!url) return;

    try {
      disconnect();

      console.log("Simulating WebSocket connection to:", url);
      setIsConnected(true);

      wsRef.current = setInterval(() => {
        setData({
          type: "message",
          payload: {
            timestamp: new Date().toISOString(),
            message: "Simulated message from server",
          },
        });
      }, 5000);
    } catch (err) {
      setError(err.message);
      setIsConnected(false);
    }
  }, [url, disconnect]);

  const send = useCallback(
    (message) => {
      if (isConnected) {
        console.log("Sending message:", message);
      }
    },
    [isConnected],
  );

  useEffect(() => {
    connect();
    return () => disconnect();
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
