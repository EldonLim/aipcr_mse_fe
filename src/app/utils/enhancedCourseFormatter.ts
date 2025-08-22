const enhancedCourseFormatter = {
  generateSmartResponse: (message: string, selectedCourse: any) => {
    const lowerMessage = message.toLowerCase();
    
    // Course-specific responses
    if (selectedCourse) {
      if (lowerMessage.includes("overview") || lowerMessage.includes("what is") || lowerMessage.includes("tell me about")) {
        return {
          text: `**${selectedCourse.course_name} Overview**\n\n${selectedCourse.course_description}\n\n**Course Code:** ${selectedCourse.course}\n**Difficulty Level:** ${selectedCourse.difficulty}\n**Key Topics:** ${selectedCourse.keywords}`,
          interactive: null,
          course: selectedCourse
        };
      }
      
      if (lowerMessage.includes("difficulty") || lowerMessage.includes("hard") || lowerMessage.includes("easy")) {
        const difficultyText = selectedCourse.difficulty === 'Beginner' 
          ? 'This is a beginner-friendly course that introduces fundamental concepts.'
          : selectedCourse.difficulty === 'Intermediate'
          ? 'This intermediate course builds on foundational knowledge and introduces more complex topics.'
          : 'This advanced course covers sophisticated concepts and requires strong background knowledge.';
          
        return {
          text: `**${selectedCourse.course_name} - Difficulty Assessment**\n\n${difficultyText}\n\n**Prerequisites:** Basic understanding of chemistry, physics, and mathematics is recommended.\n**Workload:** Expect moderate to high engagement with regular assignments and projects.`,
          interactive: null,
          course: selectedCourse
        };
      }
      
      if (lowerMessage.includes("career") || lowerMessage.includes("job") || lowerMessage.includes("opportunities")) {
        return {
          text: `**Career Opportunities with ${selectedCourse.course_name}**\n\nThis course prepares you for various exciting career paths:\n\n• **Research & Development:** Materials scientist, research engineer\n• **Manufacturing:** Process engineer, quality control specialist\n• **Product Development:** Product engineer, innovation specialist\n• **Consulting:** Technical consultant, industry advisor\n• **Academia:** Research positions, teaching opportunities\n\n**Industries:** Aerospace, automotive, electronics, energy, healthcare, and more!`,
          interactive: null,
          course: selectedCourse
        };
      }
      
      if (lowerMessage.includes("prerequisites") || lowerMessage.includes("requirements") || lowerMessage.includes("what do i need")) {
        return {
          text: `**Prerequisites for ${selectedCourse.course_name}**\n\n**Required Background:**\n• Basic chemistry and physics knowledge\n• Fundamental mathematics (algebra, calculus)\n• Interest in materials science\n\n**Recommended Skills:**\n• Problem-solving abilities\n• Analytical thinking\n• Laboratory experience (helpful but not required)\n\n**No prior materials science experience needed!** We'll build from the ground up.`,
          interactive: null,
          course: selectedCourse
        };
      }
    }
    
    // General responses
    if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      return {
        text: `👋 Welcome to Lyon CourseBuddy!
I'm your AI study companion here to help you navigate your modules with ease. Whether you need quick explanations, revision tips, or guidance on assignments, I've got you covered.

📚 Just tell me your module or topic, and I'll jump right in.
✨ Let's make learning smoother, smarter, and a little more fun together!`,
        interactive: null,
        course: null
      };
    }
    
    if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
      return {
        text: `**I'm Lyon CourseBuddy - Your Course Assistant!** 🤖\n\n**Here's what I can help you with:**\n\n📚 **Course Information:**\n• Detailed course descriptions\n• Difficulty levels and prerequisites\n• Learning outcomes and objectives\n• Course structure and content\n\n🎯 **Career Guidance:**\n• Career opportunities and paths\n• Industry applications\n• Skill development recommendations\n• Job market insights\n\n🔍 **Course Discovery:**\n• Theme-based course browsing\n• Search and filtering\n• Course comparisons\n• Personalized recommendations\n\n💡 **Learning Support:**\n• Study tips and strategies\n• Resource recommendations\n• Progress tracking\n• Academic guidance\n\n**Ready to explore?** Choose a theme or ask me about specific courses!`,
        interactive: null,
        course: null
      };
    }
    
    if (lowerMessage.includes("themes") || lowerMessage.includes("what themes")) {
      return {
        text: `**Available Course Themes** 🎨\n\nHere are the main areas you can explore:\n\n🔬 **Materials Science:** Core materials and properties\n⚙️ **Engineering:** Engineering principles and applications\n🧪 **Chemistry:** Chemical processes and reactions\n⚡ **Physics:** Physical principles and phenomena\n🧬 **Biotechnology:** Biological applications and processes\n🔬 **Nanotechnology:** Nano-scale materials and devices\n\n**Each theme offers:**\n• Multiple course options\n• Different difficulty levels\n• Varied career applications\n• Progressive learning paths\n\n**Choose a theme that interests you, or I can help you find the perfect starting point!**`,
        interactive: null,
        course: null
      };
    }
    
    // Default response
    return {
      text: `I'm here to help you explore Materials Science and Engineering courses! You can:\n\n• Ask me about specific courses\n• Browse by themes\n• Get career guidance\n• Learn about prerequisites\n• Compare different options\n\nWhat would you like to know more about?`,
      interactive: null,
      course: null
    };
  }
};

export default enhancedCourseFormatter; 