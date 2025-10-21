import { useEffect, useRef, useState } from "react";
import { SocketService } from "../api/socket";
import { useSocketStore } from "../stores/socket-store";

export const useSocket = (
  gameId: string | undefined,
  userId: string | undefined
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<SocketService | null>(null);
  const setSocket = useSocketStore((state) => state.setSocket);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const initializeSocket = async () => {
      try {
        if (!gameId || !userId) {
          throw new Error("Game ID or user ID is required");
        }
        const newSocket = new SocketService(gameId, userId);
        socketRef.current = newSocket;
        setSocket(newSocket);
        await newSocket.waitForConnection();
        if (!signal.aborted) {
          setIsConnected(true);
          setError(null);
        }
      } catch (err) {
        if (!signal.aborted) {
          setError(
            err instanceof Error ? err.message : "Socket connection failed"
          );
          setIsConnected(false);
        }
      }
    };

    initializeSocket();

    return () => {
      controller.abort();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
      setError(null);
    };
  }, [gameId, userId, setSocket]);

  return {
    socket: socketRef.current,
    isConnected,
    error,
  };
};
