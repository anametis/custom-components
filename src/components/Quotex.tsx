'use client';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client/dist/socket.io';

const Quotex: React.FC = () => {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Create socket connection using Socket.IO@2.3.0
    const socket = io('wss://ws2.qxbroker.com', {
      transports: ['websocket'],
      path: '/socket.io/',
      query: 'EIO=3&transport=websocket',
      forceNew: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Handle connection
    socket.on('connect', () => {
      console.log('Connected to socket');
      setConnected(true);
      
      // Send authorization after connection is established
      socket.emit('authorization', {
        session: 'FkFgdULj3GtOxjzak6CF59xfA47LIXaovF2El19z',
        isDemo: 0,
        tournamentId: 0,
      });
    });

    // Handle connection error
    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setConnected(false);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      setConnected(false);
    });

    // Handle authorization response
    socket.on('authorization_response', (response) => {
      console.log('Authorization response:', response);
    });

    // Cleanup function
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Quotex Socket Connection</h1>
      <div className="space-y-2">
        <p>Connection Status: {connected ? 'Connected' : 'Disconnected'}</p>
        {!connected && (
          <p className="text-red-500">
            If connection fails, please check:
            - WebSocket URL
            - Session token validity
            - Network connectivity
          </p>
        )}
      </div>
    </div>
  );
};

export default Quotex;