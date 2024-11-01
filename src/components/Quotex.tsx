"use client";
import React, { useEffect } from "react";
import { io, Socket } from "socket.io-client";

const Quotex: React.FC = () => {
  useEffect(() => {
    const socket: Socket = io("wss://ws2.qxbroker.com/socket.io", {
      path: "/?EIO=3&transport=websocket",
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      socket.emit("authorization", {
        session: process.env.REACT_APP_SESSION_TOKEN || "",
        isDemo: 0,
        tournamentId: 0,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>Quotex</div>;
};

export default Quotex;
