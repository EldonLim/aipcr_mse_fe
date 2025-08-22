import React from "react";

const ChatbotIcon: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#cfcfcfff',
        borderRadius: '50%',
        width: '50px',
        height: '45px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#010147',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
      </div>
    </div>
  );
};

export default ChatbotIcon; 