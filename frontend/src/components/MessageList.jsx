import React from 'react';

    const MessageList = ({ messages, loggedInUserId }) => {
      return (
        <div className="grid grid-cols-12 gap-y-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`col-start-${message.sender.id === loggedInUserId ? '6' : '1'} col-end-${
                message.sender.id === loggedInUserId ? '13' : '8'
              } p-3 rounded-lg`}
            >
              <div
                className={`flex ${
                  message.sender.id === loggedInUserId ? 'flex-row-reverse' : 'flex-row'
                } items-center`}
              >
                <div
                  className={`relative ${
                    message.sender.id === loggedInUserId ? 'ml-3' : 'mr-3'
                  } text-sm bg-white py-2 px-4 shadow rounded-xl`}
                >
                  <div>{message.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    };

    export default MessageList;
