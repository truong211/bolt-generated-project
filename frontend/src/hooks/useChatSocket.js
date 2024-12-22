import { useEffect } from 'react';
    import { useSocket } from '../contexts/SocketContext';

    const useChatSocket = (setMessages) => {
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

        socket.on('message', handleNewMessage);
        socket.on('messageUpdated', handleUpdatedMessage);
        socket.on('messageDeleted', handleDeletedMessage);

        return () => {
          socket.off('message', handleNewMessage);
          socket.off('messageUpdated', handleUpdatedMessage);
          socket.off('messageDeleted', handleDeletedMessage);
        };
      }, [socket, setMessages]);
    };

    export default useChatSocket;
