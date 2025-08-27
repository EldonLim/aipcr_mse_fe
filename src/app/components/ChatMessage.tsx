import React from "react";
import { convertToChatGPTHTML } from "../utils/chatGPTFormatter";

interface ChatMessageProps {
  chat: {
    role: string;
    text: string;
    isError?: boolean;
    interactive?: any;
    hideInChat?: boolean;
  };
}

const ChatMessage: React.FC<ChatMessageProps> = ({ chat }) => {
  if (chat.hideInChat) return null;
  const isAssistant = chat.role === "assistant";
  
  // Convert formatted text to clean HTML without markdown artifacts
  const formatTextToHTML = (text: string) => {
    if (!text) return '';
    
    // First, convert bullet points to proper HTML structure
    const formattedText = text
      // Convert various bullet point formats to clean bullet points with proper line breaks
      .replace(/^[•\-\*+]\s+(.*)$/gm, '<div class="bullet-point">• $1</div>')
      // Convert markdown bold to HTML bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert markdown italic to HTML italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert line breaks to proper HTML
      .replace(/\n/g, '<br>')
      // Clean up any remaining markdown artifacts
      .replace(/^#+\s+/gm, '') // Remove markdown headers
      .replace(/`(.*?)`/g, '<code>$1</code>'); // Convert inline code
    
    return formattedText;
  };

  return (
    <div className={`chat-message ${isAssistant ? 'assistant' : 'user'}`}>
      <div className={`message-content ${isAssistant ? 'assistant-content' : 'user-content'}`}>
        <div 
          className={`message-text ${chat.isError ? 'error-message' : ''}`}
          dangerouslySetInnerHTML={{ 
            __html: isAssistant ? formatTextToHTML(chat.text) : chat.text 
          }}
        />
        
        {chat.interactive && (
          <div className="interactive-elements">
            {/* Interactive elements can be added here */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage; 