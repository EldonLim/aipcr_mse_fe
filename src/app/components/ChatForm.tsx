import React, { useRef, useState } from "react";
import { 
  getAllCourses, 
  getCoursesByTheme, 
  getCourseByCode, 
  searchCourses, 
  getCoursesByDifficulty, 
  getCoursesByRelevance,
  getAllThemes,
  formatCourseForDisplay,
  generateLocalResponse,
  findSimilarCourses
} from "../utils/courseInfoFormatter";
import enhancedCourseFormatter from "../utils/enhancedCourseFormatter";

interface ChatFormProps {
  chatHistory: any[];
  setChatHistory: React.Dispatch<React.SetStateAction<any[]>>;
  generateBotResponse: (history: any[]) => Promise<void>;
  selectedCourse: any;
}

const SMALL_TALK_RESPONSES: { [key: string]: string } = {
  "hi": "**Hello! 👋** How can I help you today?",
  "hello": "**Hi there!** What can I do for you?",
  "hey": "**Hey!** How can I assist you?",
  "thanks": "**You're welcome!** Let me know if you have more questions.",
  "thank you": "**You're welcome! 😊**",
  "ok": "**Alright!** If you need anything else, just ask.",
  "nice": "**Glad you think so!** Let me know if you have more questions.",
  "cool": "**😎 Happy to help!**",
  "good": "**Great!** Let me know if you need anything else.",
  "great": "**Awesome!** If you have more questions, just ask.",
  "bye": "**Goodbye!** Have a wonderful day!",
  "goodbye": "**See you later! 👋**",
  "see you": "**Take care! 👋**",
  "how are you": "**I'm doing great, thanks for asking!** How can I help you with course information?",
  "what can you do": "**I'm Lyon CourseBuddy!** I can help you with course details, comparisons, difficulty levels, and recommendations based on your interests. What would you like to know?",
  "help": "**I'm here to help!** I can tell you about courses, their difficulty, topics, and more. What would you like to know?",
  "weather": "**I'm Lyon CourseBuddy, not a weather app! 😄** Ask me about courses instead.",
  "joke": "**I'm not a comedian, but I can tell you about interesting course topics! 😊**",
  "time": "**I don't have a clock, but I can help you find the right course!**",
  "date": "**I'm focused on courses, not dates! 😄**",
  "who are you": "**I'm Lyon CourseBuddy, here to help you find the right courses!**",
};

const ChatForm: React.FC<ChatFormProps> = ({ 
  chatHistory, 
  setChatHistory, 
  generateBotResponse,
  selectedCourse 
}) => {
  const [userMessage, setUserMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userMessage.trim() || isLoading) return;

    const message = userMessage.trim();
    setUserMessage("");
    setIsLoading(true);

    // Add user message to chat
    setChatHistory(prev => [...prev, { role: "user", text: message }]);

    // Add thinking indicator
    setChatHistory(prev => [...prev, { role: "assistant", text: "Thinking...", hideInChat: true }]);

    try {
      // Check for small talk first
      const lowerMessage = message.toLowerCase();
      if (SMALL_TALK_RESPONSES[lowerMessage]) {
        setChatHistory(prev => [
          ...prev.filter(msg => msg.text !== "Thinking..."),
          { role: "assistant", text: SMALL_TALK_RESPONSES[lowerMessage] }
        ]);
        setIsLoading(false);
        return;
      }

      // Check for course-specific commands
      if (message.toLowerCase().includes("show all courses")) {
        const allCourses = getAllCourses();
        const formattedCourses = allCourses.map(formatCourseForDisplay).join("\n\n");
        setChatHistory(prev => [
          ...prev.filter(msg => msg.text !== "Thinking..."),
          { role: "assistant", text: `**All Available Courses:**\n\n${formattedCourses}` }
        ]);
        setIsLoading(false);
        return;
      }

      if (message.toLowerCase().includes("show themes")) {
        const themes = getAllThemes();
        const themeList = themes.map(theme => `• ${theme}`).join("\n");
        setChatHistory(prev => [
          ...prev.filter(msg => msg.text !== "Thinking..."),
          { role: "assistant", text: `**Available Themes:**\n\n${themeList}` }
        ]);
        setIsLoading(false);
        return;
      }

      // Check for search queries
      if (message.toLowerCase().includes("search for") || message.toLowerCase().includes("find courses about")) {
        const searchTerm = message.replace(/search for|find courses about/gi, "").trim();
        if (searchTerm) {
          const searchResults = searchCourses(searchTerm);
          if (searchResults.length > 0) {
            const formattedResults = searchResults.map(formatCourseForDisplay).join("\n\n");
            setChatHistory(prev => [
              ...prev.filter(msg => msg.text !== "Thinking..."),
              { role: "assistant", text: `**Search Results for "${searchTerm}":**\n\n${formattedResults}` }
            ]);
          } else {
            setChatHistory(prev => [
              ...prev.filter(msg => msg.text !== "Thinking..."),
              { role: "assistant", text: `No courses found matching "${searchTerm}". Try different keywords or check the available themes.` }
            ]);
          }
          setIsLoading(false);
          return;
        }
      }

      // Check for difficulty queries
      if (message.toLowerCase().includes("easy courses") || message.toLowerCase().includes("beginner friendly")) {
        const easyCourses = getCoursesByDifficulty("Beginner");
        const formattedCourses = easyCourses.map(formatCourseForDisplay).join("\n\n");
        setChatHistory(prev => [
          ...prev.filter(msg => msg.text !== "Thinking..."),
          { role: "assistant", text: `**Beginner-Friendly Courses:**\n\n${formattedCourses}` }
        ]);
        setIsLoading(false);
        return;
      }

      if (message.toLowerCase().includes("advanced courses") || message.toLowerCase().includes("challenging")) {
        const advancedCourses = getCoursesByDifficulty("Advanced");
        const formattedCourses = advancedCourses.map(formatCourseForDisplay).join("\n\n");
        setChatHistory(prev => [
          ...prev.filter(msg => msg.text !== "Thinking..."),
          { role: "assistant", text: `**Advanced/Challenging Courses:**\n\n${formattedCourses}` }
        ]);
        setIsLoading(false);
        return;
      }

      // Check for career relevance queries
      if (message.toLowerCase().includes("career") || message.toLowerCase().includes("job")) {
        const careerCourses = getCoursesByRelevance("Career");
        const formattedCourses = careerCourses.map(formatCourseForDisplay).join("\n\n");
        setChatHistory(prev => [
          ...prev.filter(msg => msg.text !== "Thinking..."),
          { role: "assistant", text: `**Career-Focused Courses:**\n\n${formattedCourses}` }
        ]);
        setIsLoading(false);
        return;
      }

      // Check for similar courses queries
      if (message.toLowerCase().includes("similar courses") || message.toLowerCase().includes("show me similar") || message.toLowerCase().includes("like this")) {
        if (selectedCourse) {
          // Find courses with similar themes, difficulty, or keywords
          const similarCourses = findSimilarCourses(selectedCourse);
          if (similarCourses.length > 0) {
            const formattedCourses = similarCourses.map(formatCourseForDisplay).join("\n\n");
            setChatHistory(prev => [
              ...prev.filter(msg => msg.text !== "Thinking..."),
              { role: "assistant", text: `**Courses Similar to ${selectedCourse.course_name}:**\n\n${formattedCourses}` }
            ]);
          } else {
            setChatHistory(prev => [
              ...prev.filter(msg => msg.text !== "Thinking..."),
              { role: "assistant", text: `No similar courses found for ${selectedCourse.course_name}. Try exploring other themes or difficulty levels.` }
            ]);
          }
        } else {
          setChatHistory(prev => [
            ...prev.filter(msg => msg.text !== "Thinking..."),
            { role: "assistant", text: "To find similar courses, first select a course from a theme, then ask for similar courses." }
          ]);
        }
        setIsLoading(false);
        return;
      }

      // If no specific command, use the bot response generator
      await generateBotResponse([...chatHistory, { role: "user", text: message }]);

    } catch (error) {
      console.error("Error in chat form:", error);
      setChatHistory(prev => [
        ...prev.filter(msg => msg.text !== "Thinking..."),
        { role: "assistant", text: "Sorry, I encountered an error. Please try again.", isError: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="chat-form">
      <div className="input-group">
        <input
          ref={inputRef}
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me about courses, themes, or anything else..."
          disabled={isLoading}
          className="chat-input"
        />
        <button 
          type="submit" 
          disabled={isLoading || !userMessage.trim()}
          className="send-button"
        >
          {isLoading ? "..." : "Send"}
        </button>
      </div>
    </form>
  );
};

export default ChatForm; 