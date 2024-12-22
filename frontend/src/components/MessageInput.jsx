import React, { useState } from 'react';

    const MessageInput = ({ onSendMessage }) => {
      const [message, setMessage] = useState('');
      const [files, setFiles] = useState([]);

      const handleFileChange = (event) => {
        setFiles(event.target.files);
      };

      const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('content', message);
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        onSendMessage(formData);
        setMessage('');
        setFiles([]);
      };

      return (
        <form onSubmit={handleSubmit} className="flex flex-col w-full">
          <input
            type="file"
            onChange={handleFileChange}
            multiple
            className="mb-2"
          />
          <div className="flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter a message"
              className="flex-grow px-4 py-2 rounded-lg focus:outline-none"
            />
            <button type="submit" className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-lg">
              Send
            </button>
          </div>
        </form>
      );
    };

    export default MessageInput;
