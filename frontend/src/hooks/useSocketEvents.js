import { useEffect } from 'react';
    import { useSocket } from '../contexts/SocketContext';

    const useSocketEvents = (setMessages) => {
      const { socket } = useSocket();

      useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        const handleUpdatedMessage = (updatedMessage) => {
          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.id === updatedMessage.id ? updatedMessage : message
            ),
          );
        };

        const handleDeletedMessage = (deletedMessageId) => {
          setMessages((prevMessages) =>
            prevMessages.filter((message) => message.id !== deletedMessageId),
          );
        };

        const handleSocketError = (error) => {
          console.error('Socket.IO Error:', error);
        };

        socket.on('message', handleNewMessage);
        socket.on('messageUpdated', handleUpdatedMessage);
        socket.on('messageDeleted', handleDeletedMessage);
        socket.on('error', handleSocketError);
        socket.on('connect_error', handleSocketError);

        return () => {
          socket.off('message', handleNewMessage);
          socket.off('messageUpdated', handleUpdatedMessage);
          socket.off('messageDeleted', handleDeletedMessage);
          socket.off('error', handleSocketError);
          socket.off('connect_error', handleSocketError);
        };
      }, [socket, setMessages]);
    };

    export default useSocketEvents;
