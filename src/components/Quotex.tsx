'use client';
import React, { useEffect } from 'react';
import { io } from "socket.io-client"; 

const Quotex:React.FC = () => {
    useEffect(() => {
    const newSocket = io("wss://ws2.qxbroker.com/socket.io", {
      path: "/?EIO=3&transport=websocket",
      transports: ["websocket"],
    });

    newSocket.on("connection", () => {
      newSocket.emit("authorization", {
        session: "FkFgdULj3GtOxjzak6CF59xfA47LIXaovF2El19z",
        isDemo: 0,
        tournamentId: 0,
      });
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);
  return (
    <div>Quotex</div>
  )
}
export default Quotex