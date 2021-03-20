import React from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/userSlice";

const ChatMessages = ({ messages }) => {
  const user = useSelector(selectUser);

  const checkDateEqual = (index) => {
    return (
      new Date(messages[index - 1]?.timestamp).toDateString() ===
      new Date(messages[index]?.timestamp).toDateString()
    );
  };
  const checkUserEqual = (index) => {
    return messages[index - 1]?.userId === messages[index]?.userId;
  };

  return messages.map((message, index) => (
    <React.Fragment key={index}>
      {!checkDateEqual(index) && (
        <span className="chat__centerTimestamp">
          {new Date(message.timestamp).toLocaleDateString() ===
          new Date().toLocaleDateString()
            ? "TODAY"
            : new Date(message.timestamp).toLocaleDateString()}
        </span>
      )}
      <p
        key={message._id}
        className={`chat__message ${
          message.userId === user._id && "chat__reciever"
        } ${(!checkDateEqual(index) || !checkUserEqual(index)) && "arrow"} ${
          message.type === "img" && "chat__img"
        }`}
      >
        {(!checkDateEqual(index) || !checkUserEqual(index)) &&
          message.userId !== user._id && (
            <span className="chat__name">{message.userName}</span>
          )}
        {message.type === "img" ? (
          <img src={message.message} alt="message" />
        ) : (
          message.message
        )}
        <span className="chat__timestamp">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </p>
    </React.Fragment>
  ));
};

export default ChatMessages;
