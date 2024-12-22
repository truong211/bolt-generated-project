import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { useSocket } from '../contexts/SocketContext';
    import { useAuth } from '../contexts/AuthContext';

    const UserList = ({ onSelectUser }) => {
      const [users, setUsers] = useState([]);
      const { socket } = useSocket();
      const { user: loggedInUser } = useAuth();

      useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await axios.get('http://localhost:3000/users');
            const usersData = response.data;

            // Initialize unreadMessages for each user
            if (loggedInUser) {
              const loggedInUserData = usersData.find((user) => user.id === loggedInUser.userId);
              if (loggedInUserData && loggedInUserData.unreadMessages) {
                usersData.forEach((user) => {
                  user.unreadCount = loggedInUserData.unreadMessages[user.id] || 0;
                });
              }
            }

            setUsers(usersData);
          } catch (error) {
            console.error('Error fetching users:', error);
          }
        };

        fetchUsers();
      }, [loggedInUser]);

      useEffect(() => {
        if (!socket) return;

        const handleNewMessage = (newMessage) => {
          if (loggedInUser && newMessage.sender.id !== loggedInUser.userId) {
            setUsers((prevUsers) =>
              prevUsers.map((user) =>
                user.id === newMessage.sender.id
                  ? { ...user, unreadCount: (user.unreadCount || 0) + 1 }
                  : user,
              ),
            );
          }
        };

        const handleMessagesMarkedAsRead = (senderId) => {
          setUsers((prevUsers) =>
            prevUsers.map((user) => (user.id === senderId ? { ...user, unreadCount: 0 } : user)),
          );
        };

        socket.on('message', handleNewMessage);
        socket.on('messagesMarkedAsRead', handleMessagesMarkedAsRead);

        return () => {
          socket.off('message', handleNewMessage);
          socket.off('messagesMarkedAsRead', handleMessagesMarkedAsRead);
        };
      }, [socket, loggedInUser]);

      const handleUserSelection = (user) => {
        onSelectUser(user);
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === user.id ? { ...u, unreadCount: 0 } : u)),
        );
        if (socket) {
          socket.emit('markAsRead', user.id);
        }
      };

      return (
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">Users</h3>
          <ul>
            {users.map((user) => (
              <li
                key={user.id}
                onClick={() => handleUserSelection(user)}
                className="cursor-pointer hover:bg-gray-100 p-2"
              >
                {user.username}
                {user.unreadCount > 0 && (
                  <span className="ml-2 text-red-500">({user.unreadCount})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    };

    export default UserList;
