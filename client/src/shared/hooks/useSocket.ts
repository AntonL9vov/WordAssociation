import { useEffect, useRef, useState } from 'react';
import { SocketService } from '../api/socket';
import { useSocketStore } from '../stores/socket-store';

export const useSocket = (gameId: string | undefined, userId: string | undefined) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<SocketService | null>(null);
  const setSocket = useSocketStore((state) => state.setSocket);

  useEffect(() => {
    if (!gameId || !userId) {
      return;
    }

    let mounted = true;

    const initializeSocket = async () => {
      try {
        // Clean up existing socket
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
        }

        // Create new socket
        const newSocket = new SocketService(gameId, userId);
        socketRef.current = newSocket;
        setSocket(newSocket);

        // Wait for connection
        await newSocket.waitForConnection();
        
        if (mounted) {
          setIsConnected(true);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Socket connection failed');
          setIsConnected(false);
        }
      }
    };

    initializeSocket();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
      setError(null);
    };
  }, [gameId, setSocket]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
  };
};