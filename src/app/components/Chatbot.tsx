'use client'

import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import ntuMascot from '../../../public/ntuMascot.png'; 
import './chatbot.css'
import './globals.css'
import ChatIcon from '@mui/icons-material/Chat';
import CloseIcon from '@mui/icons-material/Close';
import ThemeSelector from "./ThemeSelector";
import ChatForm from "./ChatForm";
import CourseSelector from "./CourseSelector";
import ChatMessage from "./ChatMessage";
import enhancedCourseFormatter from "../utils/enhancedCourseFormatter";
import { convertToChatGPTHTML } from "../utils/chatGPTFormatter";
import { generateLocalResponse } from "../utils/courseInfoFormatter";
import { sendChat } from "../utils/chatApi";
import QuickReplies from "./QuickReplies";

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  isError?: boolean;
  interactive?: any;
  isEnhanced?: boolean;
}

interface Theme {
  id: string;
  name: string;
  description: string;
}

interface ChatbotCourse {
  course: string;
  course_name: string;
  course_description: string;
  keywords?: string;
  Keywords?: string;
}

interface QuickReplyOptions {
  introOnly?: boolean;
}

export const ChatbotPage = () => {
    const chatBodyRef = useRef<HTMLDivElement>(null);
    const [showChatbot, setShowChatbot] = useState(false);
    const [currentView, setCurrentView] = useState<'themes' | 'courses' | 'questionnaire' | 'chat'>('themes');
    const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
    const [selectedCourse, setSelectedCourse] = useState<ChatbotCourse | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [hasIntroduced, setHasIntroduced] = useState(false);

    const handleThemeSelect = (theme: Theme) => {
        setSelectedTheme(theme);
        setCurrentView('courses');
    };

    // Core bot response flow: tries local formatter first for instant responses, then API as fallback
    const generateBotResponse = async (history: ChatMessage[]) => {
        // Helper function to update chat history
        const updateHistory = (text: string, isError = false, interactive: any = null) => {
        setChatHistory((prev: ChatMessage[]) => [
            ...prev.filter((msg: ChatMessage) => msg.text != "Thinking..."),
            { role: "assistant", text, isError, interactive }
        ]);
        };

        // Get the last user message
        const lastUserMessage = history[history.length - 1]?.text || '';

        try {
        // Module-specific questions: reply with explanation only, no greeting
        const lower = lastUserMessage.toLowerCase();
        if (selectedCourse && (lower.includes('explain what is taught') || lower.includes('tell me more about this module') || lower.includes('what is taught') || lower.includes('tell me more'))) {
            const explanation = `**${selectedCourse.course} — What You'll Learn**\n\n${selectedCourse.course_description}\n\n**Keywords:** ${selectedCourse.keywords || selectedCourse.Keywords || ''}`.trim();
            updateHistory(convertToChatGPTHTML(explanation));
            return;
        }

        // Prioritize improved local formatter for instant responses
        try {
            const response = generateLocalResponse(lastUserMessage, selectedCourse);
            updateHistory(convertToChatGPTHTML(response), false, null);
            
            // DISABLED: API enhancement was overwriting good local responses
            // If you want to re-enable this later, uncomment the code below
            /*
            setTimeout(async () => {
            try {
                const apiText = await sendChat(history, { selectedCourse: selectedCourse?.course });
                // Only update if the API response is different/better
                if (apiText && apiText !== response.text) {
                setChatHistory((prev: ChatMessage[]) => [
                    ...prev.slice(0, -1), // Remove the last response
                    { role: "assistant", text: convertToChatGPTHTML(apiText), isEnhanced: true }
                ]);
                }
            } catch (apiErr) {
                // Silently fail - local response is already shown
                console.log('API enhancement failed, keeping local response');
            }
            }, 100); // Small delay to not interfere with instant response
            */
            
            return;
        } catch (localErr) {
            console.warn('Local formatter failed, trying enhanced formatter fallback.', localErr);
            
            // Fallback to enhanced formatter
            try {
            const response = enhancedCourseFormatter.generateSmartResponse(lastUserMessage, selectedCourse);
            updateHistory(response.text, false, response.interactive || null);
            return;
            } catch (enhancedErr) {
            console.warn('Enhanced formatter also failed, trying API fallback.', enhancedErr);
            }
        }

        // Fallback: Try API if local formatter completely fails
        try {
            const apiText = await Promise.race([
            sendChat(history, { selectedCourse: selectedCourse?.course }),
            new Promise<string>((_, reject) => setTimeout(() => reject(new Error('Chat API timeout')), 2000))
            ]);
            updateHistory(convertToChatGPTHTML(apiText || ''));
            return;
        } catch (apiErr) {
            console.warn('Chat API unavailable, using basic local response.', apiErr);
        }

        // Final fallback: Basic local response
        try {
            const response = generateLocalResponse(lastUserMessage, selectedCourse);
            updateHistory(convertToChatGPTHTML(response || ''));
        } catch (finalErr) {
            console.error('All response methods failed:', finalErr);
            updateHistory(convertToChatGPTHTML("I'm having trouble understanding. Could you rephrase your question?"), true);
        }
        } catch (error) {
        console.error('Bot response error:', error);
        updateHistory(convertToChatGPTHTML("Sorry, I encountered an error. Please try again."), true);
        }
    };

    const handleBackToThemes = () => {
        setCurrentView('themes');
        setSelectedTheme(null);
        setSelectedCourse(null);
    };

    const handleCourseSelect = (course: ChatbotCourse) => {
        setSelectedCourse(course);
        setCurrentView('chat');
        setHasIntroduced(false);
        
        // Initialize chat with personalized welcome message
        const welcomeResponse = generateWelcomeMessage(null, course);
        setChatHistory([{ role: "assistant", text: welcomeResponse.text, interactive: welcomeResponse.interactive }]);
    };

    const generateWelcomeMessage = (interests: any, course: ChatbotCourse | null) => {
        // Use our enhanced formatter for beautiful formatting
        if (course) {
        // Show welcome message with course context, not course overview
        return {
            text: `👋 Welcome to Lyon CourseBuddy!
    I'm your AI study companion here to help you navigate your modules with ease. Whether you need quick explanations, revision tips, or guidance on assignments, I've got you covered.

    📚 Just tell me your module or topic, and I'll jump right in.
    ✨ Let's make learning smoother, smarter, and a little more fun together!`,
            interactive: null,
            course: course
        };
        } else {
        const response = enhancedCourseFormatter.generateSmartResponse("hello", null);
        return {
            text: convertToChatGPTHTML(response.text),
            interactive: response.interactive,
            course: response.course
        };
        }
    };

    // Quick replies now show only a short intro once, then wait for the user's next question
    const handleQuickReply = async (text: string, options: QuickReplyOptions = {}) => {
        // Show intro once if requested, then continue to handle the quick reply
        if (options.introOnly && !hasIntroduced) {
        setChatHistory((history: ChatMessage[]) => [
            ...history,
            { role: 'assistant', text: `Hi! I'm Lyon CourseBuddy — here to help you choose your course.` }
        ]);
        setHasIntroduced(true);
        }

        // Add the quick reply as a user message
        setChatHistory((history: ChatMessage[]) => [...history, { role: "user", text }]);

        try {
        // Route through shared generator (local first for instant responses)
        await generateBotResponse([...chatHistory, { role: 'user', text }]);
        } catch (err) {
        console.error('Error generating bot response from quick reply:', err);
        setChatHistory((history: ChatMessage[]) => [
            ...history,
            { role: 'assistant', text: convertToChatGPTHTML('Sorry, something went wrong. Please try again.'), isError: true }
        ]);
        }
    };

    useEffect(() => {
        // Auto-scroll whenever chat history updates
        if (chatBodyRef.current) {
        chatBodyRef.current.scrollTo({ top: chatBodyRef.current.scrollHeight, behavior: "smooth" });
        }
    }, [chatHistory]);

    const renderCurrentView = () => {
        switch (currentView) {
            case 'themes':
                return (
                    <>
                        <ThemeSelector 
                        onThemeSelect={handleThemeSelect}
                        onStartChat={() => {
                            setCurrentView('chat');
                            setHasIntroduced(false);
                            const welcomeResponse = enhancedCourseFormatter.generateSmartResponse("hello", null);
                            setChatHistory([{ role: "assistant", text: welcomeResponse.text, interactive: welcomeResponse.interactive }]);
                        }}
                        />
                        <div className="chat-footer">
                        <ChatForm 
                            chatHistory={chatHistory} 
                            setChatHistory={setChatHistory} 
                            generateBotResponse={generateBotResponse}
                            selectedCourse={selectedCourse}
                        />
                        </div>
                    </>
                );
        
            case 'courses':
                return (
                <>
                    <CourseSelector 
                    selectedTheme={selectedTheme}
                    onCourseSelect={handleCourseSelect}
                    onBackToThemes={handleBackToThemes}
                    />
                    <div className="chat-footer">
                    <ChatForm 
                        chatHistory={chatHistory} 
                        setChatHistory={setChatHistory} 
                        generateBotResponse={generateBotResponse}
                        selectedCourse={selectedCourse}
                    />
                    </div>
                </>
            );
        
            case 'chat':
                return (
                <>
                    <div ref={chatBodyRef} className="chat-body">
                    {chatHistory.map((chat: ChatMessage, index: number) => (
                        <ChatMessage key={index} chat={chat} />
                    ))}
                    {chatHistory.length > 0 && chatHistory[chatHistory.length - 1].role === 'assistant' && (
                        <QuickReplies onQuickReply={handleQuickReply} />
                    )}
                    </div>
                    <div className="chat-footer">
                    <ChatForm 
                        chatHistory={chatHistory} 
                        setChatHistory={setChatHistory} 
                        generateBotResponse={generateBotResponse}
                        selectedCourse={selectedCourse}
                    />
                    </div>
                </>
            );
        
            default:
                return null;
        }
    };

    return (
        <div className={`container ${showChatbot ? "show-chatbot" : ""}`}>
            <button 
                onClick={() => setShowChatbot((prev: boolean) => !prev)} 
                id="chatbot-toggler"
                className="fixed bottom-8 right-8 z-50"
            >
                {!showChatbot && <ChatIcon style={{ color: "#FFFFFF" }}/>}
                {showChatbot && <CloseIcon style={{ color: "#FFFFFF" }}/>}
            </button>

            <div className="chatbot-popup">
                <div className="chat-header">
                    <div className="header-info">
                        {/* Chatbot Header */}
                        <Image
                            src={ntuMascot}
                            alt="NTU Mascot"
                            width={40}
                            height={40}
                            style={{ objectFit: 'contain' }}
                        />
                        <span className="logo-text">Lyon CourseBuddy</span>
                    </div>
                    <button onClick={() => setShowChatbot(false)}>
                        <CloseIcon style={{ color: "#FFFFFF" }}/>
                    </button>
                </div>

                {/* Chat Content */}
                {renderCurrentView()}
            </div>
        </div>
    );
}