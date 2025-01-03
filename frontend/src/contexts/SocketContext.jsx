import React, { createContext, useContext, useState, useEffect } from 'react';
    import { io } from 'socket.io-client';

    const SocketContext = createContext();

    export const useSocket = () => useContext(SocketContext);

    export const SocketProvider = ({ children }) => {
      const [socket, setSocket] = useState(null);

      useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
          const newSocket = io('http://localhost:3000', {
            extraHeaders: {
              Authorization: `Bearer ${token}`,
            },
          });
          setSocket(newSocket);

          return () => newSocket.close();
        }
      }, []);

      return (
        <SocketContext.Provider value={{ socket }}>
          {children}
        </SocketContext.Provider>
      );
    };
