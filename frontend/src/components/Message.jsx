import React, { useState } from 'react';
    import axios from 'axios';

    const Message = ({ message, onUpdate, onDelete }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedContent, setEditedContent] = useState(message.content);

      const handleEdit = async () => {
        if (isEditing) {
          try {
            const response = await axios.patch(`http://localhost:3000/messages/${message.id}`, {
              content: editedContent,
            });
            onUpdate(response.data);
            setIsEditing(false);
          } catch (error) {
            console.error('Error updating message:', error);
          }
        } else {
          setIsEditing(true);
        }
      };

      const handleDelete = async () => {
        try {
          await axios.delete(`http://localhost:3000/messages/${message.id}`);
          onDelete(message.id);
        } catch (error) {
          console.error('Error deleting message:', error);
        }
      };

      return (
        <div className="mb-4 p-3 bg-white rounded-lg shadow">
          <div className="font-bold">{message.sender.username}</div>
          {isEditing ? (
            <input
              type="text"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full p-2 border rounded"
            />
          ) : (
            <div>{message.content}</div>
          )}
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2">
              {message.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={`http://localhost:3000/${attachment}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-blue-500 hover:underline"
                >
                  Attachment {index + 1}
                </a>
              ))}
            </div>
          )}
          <div className="mt-2">
            <button onClick={handleEdit} className="mr-2 px-4 py-2 bg-blue-500 text-white rounded">
              {isEditing ? 'Save' : 'Edit'}
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-500 text-white rounded">
              Delete
            </button>
          </div>
        </div>
      );
    };

    export default Message;
