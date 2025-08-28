const enhancedCourseFormatter = {
  generateSmartResponse: (message: string, selectedCourse: any) => {
    const lowerMessage = message.toLowerCase();
    
    // Course-specific responses
    if (selectedCourse) {
      if (lowerMessage.includes("overview") || lowerMessage.includes("what is") || lowerMessage.includes("tell me about")) {
        return {
          text: `**📚 ${selectedCourse.course_name} - Course Overview**\n\n**📖 Course Description:**\n${selectedCourse.course_description}\n\n**🔢 Course Details:**\n• **Course Code:** ${selectedCourse.course}\n• **Difficulty Level:** ${selectedCourse.difficulty}\n• **Duration:** ${selectedCourse.semesters || 'N/A'} semester(s)\n• **Theme:** ${selectedCourse.theme1 || 'N/A'}\n\n**🎯 Key Topics Covered:**\n• ${selectedCourse.keywords || 'N/A'}\n\n**📊 Course Metrics:**\n• **Relevance Score:** ${selectedCourse.relevance?.toFixed(2) || 'N/A'}\n• **Difficulty Score:** ${selectedCourse.difficulty?.toFixed(2) || 'N/A'}`,
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
          text: `**⚡ ${selectedCourse.course_name} - Difficulty Assessment**\n\n**📊 Course Level:** ${selectedCourse.difficulty}\n\n**📚 What to Expect:**\n${difficultyText}\n\n**📋 Prerequisites:**\n• Basic understanding of chemistry, physics, and mathematics\n• Willingness to learn and engage\n• Time commitment for assignments\n\n**📈 Workload Expectations:**\n• **Assignments:** Regular homework and projects\n• **Study Time:** Moderate to high engagement required\n• **Assessment:** Mix of exams, projects, and participation\n• **Support:** Available resources and help sessions\n\n**💡 Success Tips:**\n• Attend all lectures and labs\n• Form study groups with classmates\n• Don't hesitate to ask questions\n• Use available academic support services`,
          interactive: null,
          course: selectedCourse
        };
      }
      
      if (lowerMessage.includes("career") || lowerMessage.includes("job") || lowerMessage.includes("opportunities")) {
        return {
          text: `**🎯 Career Opportunities with ${selectedCourse.course_name}**\n\nThis course prepares you for various exciting career paths:\n\n**🔬 Research & Development:**\n• Materials scientist\n• Research engineer\n• Laboratory technician\n\n**🏭 Manufacturing & Industry:**\n• Process engineer\n• Quality control specialist\n• Production manager\n\n**💡 Product Development:**\n• Product engineer\n• Innovation specialist\n• Design engineer\n\n**💼 Consulting & Advisory:**\n• Technical consultant\n• Industry advisor\n• Project manager\n\n**🎓 Academia & Education:**\n• Research positions\n• Teaching opportunities\n• Academic advisor\n\n**🏢 Key Industries:**\n• Aerospace & Defense\n• Automotive & Transportation\n• Electronics & Technology\n• Energy & Sustainability\n• Healthcare & Medical Devices\n• Construction & Infrastructure`,
          interactive: null,
          course: selectedCourse
        };
      }
      
      if (lowerMessage.includes("prerequisites") || lowerMessage.includes("requirements") || lowerMessage.includes("what do i need")) {
        return {
          text: `**📋 Prerequisites for ${selectedCourse.course_name}**\n\n**🔬 Required Background Knowledge:**\n• **Chemistry:** Basic understanding of chemical principles\n• **Physics:** Fundamental physics concepts\n• **Mathematics:** Algebra, calculus, and statistics\n• **Materials Science:** Interest and curiosity (no prior experience needed!)\n\n**💪 Recommended Skills:**\n• **Problem-solving:** Analytical and critical thinking\n• **Laboratory Work:** Basic lab safety and procedures\n• **Communication:** Clear writing and presentation skills\n• **Teamwork:** Collaborative project experience\n\n**✨ Good News:**\n• No prior materials science experience required\n• We build knowledge from the ground up\n• Support available for all skill levels\n• Flexible learning paths available`,
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
        text: `**🤖 I'm Lyon CourseBuddy - Your Course Assistant!**\n\n**Here's what I can help you with:**\n\n**📚 Course Information:**\n• Detailed course descriptions and content\n• Difficulty levels and prerequisites\n• Learning outcomes and objectives\n• Course structure and assessment methods\n• Semester duration and scheduling\n\n**🎯 Career Guidance:**\n• Career opportunities and industry paths\n• Job market insights and trends\n• Skill development recommendations\n• Professional certification options\n• Industry networking opportunities\n\n**🔍 Course Discovery:**\n• Theme-based course browsing\n• Advanced search and filtering\n• Course comparisons and analysis\n• Personalized recommendations\n• Prerequisites and progression paths\n\n**💡 Learning Support:**\n• Study tips and strategies\n• Resource recommendations\n• Progress tracking and planning\n• Academic guidance and mentoring\n• Time management advice\n\n**🚀 Getting Started:**\n• Choose a theme that interests you\n• Ask about specific courses\n• Get detailed information on any topic\n• Receive personalized guidance\n\n**Ready to explore?** Choose a theme or ask me about specific courses!`,
        interactive: null,
        course: null
      };
    }
    
    if (lowerMessage.includes("themes") || lowerMessage.includes("what themes")) {
      return {
        text: `**🎨 Available Course Themes**\n\nHere are the main areas you can explore:\n\n**🔬 Materials Science:**\n• Core materials and properties\n• Structure-property relationships\n• Materials characterization\n• Performance optimization\n\n**⚙️ Engineering:**\n• Engineering principles and applications\n• Design and manufacturing processes\n• Quality control and testing\n• Innovation and development\n\n**🧪 Chemistry:**\n• Chemical processes and reactions\n• Molecular interactions\n• Synthesis and analysis\n• Chemical engineering principles\n\n**⚡ Physics:**\n• Physical principles and phenomena\n• Energy and thermodynamics\n• Quantum mechanics applications\n• Material behavior under stress\n\n**🧬 Biotechnology:**\n• Biological applications and processes\n• Bio-materials and interfaces\n• Medical device materials\n• Sustainable biological solutions\n\n**🔬 Nanotechnology:**\n• Nano-scale materials and devices\n• Quantum effects and properties\n• Precision manufacturing\n• Advanced applications\n\n**📚 What Each Theme Offers:**\n• **Multiple course options** at different levels\n• **Progressive difficulty** from beginner to advanced\n• **Varied career applications** across industries\n• **Flexible learning paths** to suit your goals\n• **Hands-on experience** with real-world applications\n\n**🎯 Choose a theme that interests you, or I can help you find the perfect starting point!**`,
        interactive: null,
        course: null
      };
    }
    
    // Default response
    return {
      text: `**🚀 Welcome to Materials Science & Engineering!**\n\nI'm here to help you explore and understand our courses. Here's what you can do:\n\n**📚 Course Exploration:**\n• Ask about specific courses and their details\n• Browse courses by themes and interests\n• Get comprehensive course information\n• Compare different course options\n\n**🎯 Career & Learning:**\n• Get career guidance and opportunities\n• Learn about prerequisites and requirements\n• Understand difficulty levels and workload\n• Discover learning outcomes and objectives\n\n**🔍 Getting Started:**\n• Choose a theme that interests you\n• Ask me about any specific course\n• Get detailed information on any topic\n• Receive personalized recommendations\n\n**💡 What would you like to know more about?**\n\nTry asking:\n• "Tell me about Materials Science courses"\n• "What themes are available?"\n• "Show me beginner-friendly courses"\n• "What career opportunities exist?"`,
      interactive: null,
      course: null
    };
  }
};

export default enhancedCourseFormatter; 