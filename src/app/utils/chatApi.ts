// Mock API function - replace with your actual API implementation
export const sendChat = async (history: any[], context: any = {}): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response based on context
  if (context.selectedCourse) {
    return `I can help you with ${context.selectedCourse}! This course covers important concepts in materials science and engineering. What specific aspect would you like to know more about?`;
  }
  
  // Default response
  return "I'm here to help you with course information! Feel free to ask me about specific courses, difficulty levels, prerequisites, or career opportunities.";
}; 