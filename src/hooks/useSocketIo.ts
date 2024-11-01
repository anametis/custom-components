"use client";

import { useState, useEffect, useCallback } from "react";
import { io, Socket as SocketIOClient } from "socket.io-client";

interface SocketConfig {
  url?: string;
  authSession?: string;
  isDemo?: number;
  tournamentId?: number;
  autoConnect?: boolean;
}

interface MessageData {
  eventName: string;
  payload: any;
  timestamp: Date;
}

interface UseSocketIoReturn {
  socket: SocketIOClient | null;
  isConnected: boolean;
  error: string | null;
  lastMessage: MessageData | null;
  messageHistory: MessageData[];
  emit: (eventName: string, data: any) => boolean;
  subscribe: (eventName: string, callback: (data: any) => void) => () => void;
  clearHistory: () => void;
  connect: () => void;
  disconnect: () => void;
}

const useSocketIo = (config: SocketConfig = {}): UseSocketIoReturn => {
  const {
    url = "wss://ws2.qxbroker.com",
    authSession = "d0ywphfeq7EtL4x1uPoeLHNhGoQvh9araKSZIPTO",
    isDemo = 1,
    tournamentId = 0,
    autoConnect = true,
  } = config;

  const [socket, setSocket] = useState<SocketIOClient | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [lastMessage, setLastMessage] = useState<MessageData | null>(null);
  const [messageHistory, setMessageHistory] = useState<MessageData[]>([]);

  const connectSocket = useCallback(() => {
    const socketInstance: SocketIOClient = io(url, {
      transports: ["websocket"],
      upgrade: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      forceNew: true,
      query: {
        EIO: "3",
        transport: "websocket",
      },
    });

    socketInstance.on("connect", () => {
      console.log("Socket connected");
      setIsConnected(true);
      setError(null);
      socketInstance.emit("authorization", {
        session: authSession,
        isDemo,
        tournamentId,
      });
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (err: Error) => {
      console.error("Connection error:", err);
      setError(err.message);
    });

    socketInstance.on("reconnect_attempt", () => {
      console.log("Attempting to reconnect...");
    });

    socketInstance.on("reconnect", () => {
      console.log("Reconnected successfully");
    });

    socketInstance.on("42", (data: [string, any]) => {
      if (Array.isArray(data)) {
        const [eventName, payload] = data;
        const messageData: MessageData = {
          eventName,
          payload,
          timestamp: new Date(),
        };
        setLastMessage(messageData);
        setMessageHistory((prev) => [...prev, messageData]);
      }
    });

    setSocket(socketInstance);
    return socketInstance;
  }, [url, authSession, isDemo, tournamentId]);

  useEffect(() => {
    let socketInstance: SocketIOClient | null = null;
    if (autoConnect) {
      socketInstance = connectSocket();
    }

    return () => {
      if (socketInstance) {
        socketInstance.close();
      }
    };
  }, [autoConnect, connectSocket]);

  const emit = useCallback(
    (eventName: string, data: any): boolean => {
      if (!socket?.connected) {
        setError("Socket not connected");
        return false;
      }

      try {
        socket.emit(42, [eventName, data]);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred");
        return false;
      }
    },
    [socket]
  );

  const subscribe = useCallback(
    (eventName: string, callback: (data: any) => void) => {
      if (!socket) return () => {};

      const wrappedCallback = (data: [string, any]) => {
        if (Array.isArray(data) && data[0] === eventName) {
          callback(data[1]);
        }
      };

      socket.on("42", wrappedCallback);
      return () => socket.off("42", wrappedCallback);
    },
    [socket]
  );

  const clearHistory = useCallback(() => {
    setMessageHistory([]);
  }, []);

  const connect = useCallback(() => {
    if (!socket) {
      connectSocket();
    } else if (!socket.connected) {
      socket.connect();
    }
  }, [socket, connectSocket]);

  const disconnect = useCallback(() => {
    if (socket?.connected) {
      socket.disconnect();
    }
  }, [socket]);

  return {
    socket,
    isConnected,
    error,
    lastMessage,
    messageHistory,
    emit,
    subscribe,
    clearHistory,
    connect,
    disconnect,
  };
};

export default useSocketIo;