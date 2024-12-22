import React, { useState, useEffect, useMemo } from 'react';
    import axios from 'axios';
    import MessageList from '../components/MessageList';
    import MessageInput from '../components/MessageInput';
    import UserList from '../components/UserList';
    import { useSocket } from '../contexts/SocketContext';
    import { useAuth } from '../contexts/AuthContext';

    const ChatPage = () => {
      const [messages, setMessages] = useState([]);
      const [selectedUser, setSelectedUser] = useState(null);
      const { socket } = useSocket();
      const { user: loggedInUser } = useAuth();

      const fetchMessages = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get('http://localhost:3000/messages', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      useEffect(() => {
        fetchMessages();
      }, []);

      useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          if (
            !selectedUser ||
            (newMessage.sender.id !== selectedUser.id && newMessage.receiver?.id !== selectedUser.id)
          ) {
            if (Notification.permission === 'granted') {
              new Notification(`New message from ${newMessage.sender.username}`, {
                body: newMessage.content,
              });
            }
          }
        };

        const handleMessageUpdated = (updatedMessage) => {
          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.id === updatedMessage.id ? updatedMessage : message
            )
          );
        };

        const handleMessageDeleted = (deletedMessageId) => {
          setMessages((prevMessages) =>
            prevMessages.filter((message) => message.id !== deletedMessageId)
          );
        };

        socket.on('message', handleNewMessage);
        socket.on('messageUpdated', handleMessageUpdated);
        socket.on('messageDeleted', handleMessageDeleted);

        return () => {
          socket.off('message', handleNewMessage);
          socket.off('messageUpdated', handleMessageUpdated);
          socket.off('messageDeleted', handleMessageDeleted);
        };
      }, [socket, selectedUser]);

      const handleSendMessage = async (formData) => {
        try {
          const token = localStorage.getItem('token');
          if (selectedUser) {
            formData.append('receiverId', selectedUser.id);
          }
          await axios.post('http://localhost:3000/messages', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Error sending message:', error);
        }
      };

      const handleUpdateMessage = async (updatedMessage) => {
        try {
          const token = localStorage.getItem('token');
          await axios.patch(`http://localhost:3000/messages/${updatedMessage.id}`, updatedMessage, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Error updating message:', error);
        }
      };

      const handleDeleteMessage = async (messageId) => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://localhost:3000/messages/${messageId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      };

      const handleSelectUser = (user) => {
        setSelectedUser(user);
        fetchMessages();
      };

      const filteredMessages = useMemo(
        () =>
          selectedUser
            ? messages.filter(
                (message) =>
                  (message.sender.id === loggedInUser.userId && message.receiver?.id === selectedUser.id) ||
                  (message.sender.id === selectedUser.id && message.receiver?.id === loggedInUser.userId),
              )
            : messages.filter((message) => !message.receiver),
        [messages, selectedUser, loggedInUser],
      );

      useEffect(() => {
        if (Notification.permission !== 'granted') {
          Notification.requestPermission();
        }
      }, []);

      return (
        <div className="flex h-screen antialiased text-gray-800">
          <div className="flex flex-row h-full w-full overflow-x-hidden">
            <div className="flex flex-col py-8 pl-6 pr-2 w-64 bg-white flex-shrink-0">
              <UserList onSelectUser={handleSelectUser} />
            </div>
            <div className="flex flex-col flex-auto h-full p-6">
              <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-gray-100 h-full p-4">
                <div className="flex flex-col h-full overflow-x-auto mb-4">
                  <div className="flex flex-col h-full">
                    <MessageList messages={filteredMessages} loggedInUserId={loggedInUser?.userId} />
                  </div>
                </div>
                <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                  <MessageInput onSendMessage={handleSendMessage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    export default ChatPage;
