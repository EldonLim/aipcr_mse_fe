import React from "react";

interface QuickRepliesProps {
  onQuickReply: (text: string, options?: any) => void;
}

const QuickReplies: React.FC<QuickRepliesProps> = ({ onQuickReply }) => {
  const quickReplies = [
    "Tell me more about this course",
    "What are the prerequisites?",
    "How difficult is this course?",
    "Relevance and Top Topics covered"
  ];

  return (
    <div className="quick-replies">
      <div className="quick-replies-label">Quick questions:</div>
      <div className="quick-replies-buttons">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            onClick={() => onQuickReply(reply)}
            className="quick-reply-button"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies; 