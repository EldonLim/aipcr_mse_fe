// Import real course data from csvjson.json
import courseData from '../../csvjson.json';

// Course data for Materials Science and Engineering - Real data from csvjson.json
// Following the exact structure from the file
const COURSES_DATA = courseData.map((course: any, index: number) => ({
  id: index + 1,
  course: course.course,
  course_name: course.course_name,
  course_summary: course.course_summary,
  course_description: course.course_description,
  course_url: course.course_url,
  relevance: course.relevance,
  difficulty: course.difficulty,
  semesters: course['# of semesters'],
  theme1: course['Theme 1'],
  theme2: course['Theme 2'],
  theme3: course['Theme 3'],
  keywords: course.Keywords || course.keywords,
  top_topic_1: course.top_topic_1,
  top_topic_2: course.top_topic_2,
  top_topic_3: course.top_topic_3,
  top_topic_1_contribution: course.top_topic_1_contribution,
  top_topic_2_contribution: course.top_topic_2_contribution,
  top_topic_3_contribution: course.top_topic_3_contribution,
  // Calculate difficulty level from numerical score
  difficulty_level: course.difficulty ? 
    (course.difficulty <= 2.5 ? 'Beginner' : course.difficulty <= 3.5 ? 'Intermediate' : 'Advanced') : 
    'Intermediate'
}));

export const getAllCourses = () => COURSES_DATA;

export const getCoursesByTheme = (theme: string) => {
  return COURSES_DATA.filter(course => course.theme1 === theme);
};

export const getCourseByCode = (code: string) => {
  return COURSES_DATA.find(course => course.course === code);
};

export const searchCourses = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return COURSES_DATA.filter(course => 
    course.course_name.toLowerCase().includes(lowerQuery) ||
    course.course_description.toLowerCase().includes(lowerQuery) ||
    course.keywords.toLowerCase().includes(lowerQuery)
  );
};

export const getCoursesByDifficulty = (difficulty: string) => {
  return COURSES_DATA.filter(course => course.difficulty_level === difficulty);
};

export const getCoursesByRelevance = (relevance: string) => {
  if (relevance === "Career") {
    return COURSES_DATA.filter(course => 
      course.course_name.toLowerCase().includes("advanced") ||
      course.course_name.toLowerCase().includes("characterization")
    );
  }
  return COURSES_DATA;
};

export const getAllThemes = () => {
  // Get unique themes from the real course data in the order they appear
  const themes = new Set<string>();
  const orderedThemes: string[] = [];
  
  COURSES_DATA.forEach(course => {
    if (course.theme1 && !themes.has(course.theme1)) {
      themes.add(course.theme1);
      orderedThemes.push(course.theme1);
    }
  });
  
  return orderedThemes;
};

export const formatCourseForDisplay = (course: any) => {
  return `**${course.course_name} (${course.course})**
${course.course_description || course.course_summary}
**Difficulty:** ${course.difficulty_level} (Score: ${course.difficulty?.toFixed(2) || 'N/A'})
**Relevance:** ${course.relevance?.toFixed(2) || 'N/A'}
**Semesters:** ${course.semesters || 'N/A'}
**Theme:** ${course.theme1 || 'N/A'}
**Keywords:** ${course.keywords || 'N/A'}`;
};

export const generateLocalResponse = (message: string, selectedCourse: any) => {
  const lowerMessage = message.toLowerCase();
  
  // First, check if user is asking about a specific course code (like MS7110)
  const courseCodeMatch = lowerMessage.match(/\b(ms|msc|mse)\d{4}\b/i);
  if (courseCodeMatch) {
    const courseCode = courseCodeMatch[0].toUpperCase();
    const foundCourse = getCourseByCode(courseCode);
    
    if (foundCourse) {
      return `**${foundCourse.course_name} (${foundCourse.course})**\n\n${foundCourse.course_description || foundCourse.course_summary}\n\n**Difficulty:** ${foundCourse.difficulty_level} (${foundCourse.difficulty?.toFixed(2)})\n**Themes:** ${[foundCourse.theme1, foundCourse.theme2, foundCourse.theme3].filter(t => t && t.trim() !== '').join(', ')}\n**Keywords:** ${foundCourse.keywords || 'N/A'}`;
    } else {
      const availableCourses = COURSES_DATA.slice(0, 5).map(c => `${c.course} - ${c.course_name}`).join('\n• ');
      return `Course ${courseCode} not found.\n\n**Available courses:**\n• ${availableCourses}\n\n**Total:** ${COURSES_DATA.length} courses`;
    }
  }
  
  // Handle specific course-related questions when a course is selected
  if (selectedCourse) {
    // Prerequisites questions
    if (lowerMessage.includes("prerequisites") || lowerMessage.includes("requirements") || lowerMessage.includes("need to know") ||
        lowerMessage.includes("background") || lowerMessage.includes("preparation") || lowerMessage.includes("before taking") ||
        lowerMessage.includes("ready for") || lowerMessage.includes("qualify") || lowerMessage.includes("eligible")) {
      
      // Extract prerequisites from course_summary
      const courseSummary = selectedCourse.course_summary || '';
      const prerequisitesMatch = courseSummary.match(/Pre-requisites:\s*(.+?)(?:\n|$)/i);
      const prerequisites = prerequisitesMatch ? prerequisitesMatch[1].trim() : 'None specified';
      
      return `**Prerequisites for ${selectedCourse.course_name}:**\n\n**Official Prerequisites:** ${prerequisites}`;
    }

    // Difficulty questions
    if (lowerMessage.includes("difficulty") || lowerMessage.includes("level") || lowerMessage.includes("challenging") ||
        lowerMessage.includes("hard") || lowerMessage.includes("easy") || lowerMessage.includes("tough") ||
        lowerMessage.includes("simple") || lowerMessage.includes("complex") || lowerMessage.includes("advanced") ||
        lowerMessage.includes("beginner") || lowerMessage.includes("how difficult")) {
      return `**${selectedCourse.course_name} Difficulty:**\n\n**Level:** ${selectedCourse.difficulty_level}\n**Score:** ${selectedCourse.difficulty?.toFixed(2)}\n**Relevance:** ${selectedCourse.relevance?.toFixed(2)}\n**Semesters:** ${selectedCourse.semesters}`;
    }

    // Content/learning questions
    if ((lowerMessage.includes("what") && (lowerMessage.includes("taught") || lowerMessage.includes("learn") || lowerMessage.includes("covered"))) ||
        lowerMessage.includes("content") || lowerMessage.includes("curriculum") || lowerMessage.includes("topics") ||
        lowerMessage.includes("syllabus") || lowerMessage.includes("overview") || lowerMessage.includes("about this course") ||
        lowerMessage.includes("tell me about") || lowerMessage.includes("what is") || lowerMessage.includes("describe") ||
        lowerMessage.includes("explain") || lowerMessage.includes("details") || lowerMessage.includes("information")) {
      return `**${selectedCourse.course_name} Content:**\n\n${selectedCourse.course_description || selectedCourse.course_summary}\n\n**Keywords:** ${selectedCourse.keywords || 'N/A'}\n**Themes:** ${[selectedCourse.theme1, selectedCourse.theme2, selectedCourse.theme3].filter(t => t && t.trim() !== '').join(', ')}`;
    }

    // Career questions
    if (lowerMessage.includes("career") || lowerMessage.includes("opportunities") || lowerMessage.includes("jobs") || 
        lowerMessage.includes("work") || lowerMessage.includes("employment") || lowerMessage.includes("professional") ||
        lowerMessage.includes("industry") || lowerMessage.includes("future") || lowerMessage.includes("after graduation")) {
      return `**${selectedCourse.course_name} Career Info:**\n\n**Relevance Score:** ${selectedCourse.relevance?.toFixed(2)}\n**Top Topics:**\n• ${selectedCourse.top_topic_1 || 'N/A'} (${selectedCourse.top_topic_1_contribution?.toFixed(3)})\n• ${selectedCourse.top_topic_2 || 'N/A'} (${selectedCourse.top_topic_2_contribution?.toFixed(3)})\n• ${selectedCourse.top_topic_3 || 'N/A'} (${selectedCourse.top_topic_3_contribution?.toFixed(3)})\n\n**Themes:** ${[selectedCourse.theme1, selectedCourse.theme2, selectedCourse.theme3].filter(t => t && t.trim() !== '').join(', ')}`;
    }

    // General course questions when course is selected
    if (lowerMessage.includes("course") || lowerMessage.includes("class") || lowerMessage.includes("module") ||
        lowerMessage.includes("subject") || lowerMessage.includes("study") || lowerMessage.includes("program")) {
      return `**${selectedCourse.course_name} (${selectedCourse.course})**\n\n${selectedCourse.course_description || selectedCourse.course_summary}\n\n**Difficulty:** ${selectedCourse.difficulty_level} | **Relevance:** ${selectedCourse.relevance?.toFixed(2)} | **Semesters:** ${selectedCourse.semesters}`;
    }
  }
  
  // Handle "tell me about" questions (even without a selected course)
  if (lowerMessage.includes("tell me about") || lowerMessage.includes("what is") || lowerMessage.includes("describe") ||
      lowerMessage.includes("explain") || lowerMessage.includes("information about")) {
    
    // Check if they're asking about a specific topic
    if (lowerMessage.includes("materials science") || lowerMessage.includes("materials engineering")) {
      const allCourses = COURSES_DATA.slice(0, 5).map(c => `${c.course} - ${c.course_name}`).join('\n• ');
      return `**Materials Science & Engineering:** Study of materials properties and behavior.\n\n**Sample Courses:**\n• ${allCourses}\n\n**Total:** ${COURSES_DATA.length} courses`;
    }
    
    if (lowerMessage.includes("course") || lowerMessage.includes("class") || lowerMessage.includes("module")) {
      const allCourses = COURSES_DATA.slice(0, 5).map(c => `${c.course} - ${c.course_name}`).join('\n• ');
      return `**Available Courses:**\n• ${allCourses}\n\n**Total:** ${COURSES_DATA.length} courses\n\nSelect a theme to explore courses.`;
    }
    
    // Generic "tell me about" response
    return `What specifically would you like to know about?\n\n**Options:**\n• Course information\n• Materials science topics\n• Career opportunities\n• Study recommendations`;
  }
  
  // Handle general greetings and help
  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey") ||
      lowerMessage.includes("good morning") || lowerMessage.includes("good afternoon") || lowerMessage.includes("good evening")) {
    return "Hello! I'm Lyon CourseBuddy. How can I help you with Materials Science courses?";
  }
  
  if (lowerMessage.includes("help") || lowerMessage.includes("what can you do") || lowerMessage.includes("how do you work") ||
      lowerMessage.includes("what are you") || lowerMessage.includes("who are you") || lowerMessage.includes("guide me")) {
    return "I help with:\n\n**Course Info:**\n• Descriptions & content\n• Difficulty & prerequisites\n• Career opportunities\n• Course comparisons\n\nAsk about any course or topic!";
  }

  // Handle questions about courses in general (when no course selected)
  if (lowerMessage.includes("courses") || lowerMessage.includes("available") || lowerMessage.includes("what can i study") ||
      lowerMessage.includes("programs") || lowerMessage.includes("options") || lowerMessage.includes("choose")) {
    const allCourses = COURSES_DATA.slice(0, 5).map(c => `${c.course} - ${c.course_name}`).join('\n• ');
    return `**Available Courses:**\n• ${allCourses}\n\n**Total:** ${COURSES_DATA.length} courses\n\nSelect a theme to explore courses.`;
  }

  // Handle questions that seem like they want specific information but are too general
  if (lowerMessage.includes("?") || lowerMessage.includes("how") || lowerMessage.includes("why") || 
      lowerMessage.includes("when") || lowerMessage.includes("where") || lowerMessage.includes("which")) {
    if (selectedCourse) {
      return `What specifically about ${selectedCourse.course_name}?\n\n**Ask about:**\n• Content & learning\n• Difficulty level\n• Prerequisites\n• Career paths`;
    } else {
      return `What would you like to know?\n\n**Options:**\n• Course details\n• Difficulty levels\n• Career paths\n• Course comparisons`;
    }
  }
  
  // Default response for unrecognized questions
  return "I can help with course information! Ask about:\n\n• **Course details** - descriptions, content, outcomes\n• **Prerequisites** - what you need to know\n• **Difficulty** - how challenging each course is\n• **Careers** - job opportunities\n\nWhat specific course or topic?";
}; 

export const findSimilarCourses = (selectedCourse: any) => {
  if (!selectedCourse) return [];
  
  // Only return courses with the same primary theme
  const similarCourses = COURSES_DATA.filter(course => {
    // Don't include the same course
    if (course.course === selectedCourse.course) return false;
    
    // Only include courses with the same primary theme
    return course.theme1 === selectedCourse.theme1;
  });
  
  // Return all matching courses (no limit needed since we're just showing same theme)
  return similarCourses;
}; 