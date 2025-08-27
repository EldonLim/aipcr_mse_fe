import React from "react";
import { getCoursesByTheme } from "../utils/courseInfoFormatter";

interface CourseSelectorProps {
  selectedTheme: any;
  onCourseSelect: (course: any) => void;
  onBackToThemes: () => void;
}

const CourseSelector: React.FC<CourseSelectorProps> = ({ 
  selectedTheme, 
  onCourseSelect, 
  onBackToThemes 
}) => {
  // Get real courses from the csvjson.json data based on selected theme
  const courses = getCoursesByTheme(selectedTheme?.name || '');

  return (
    <div className="course-selector">
      <div className="course-header">
        <button onClick={onBackToThemes} className="back-button">
          ← Back to Themes
        </button>
        <h3>Courses in {selectedTheme?.name || 'Materials Science'}</h3>
        <p className="course-count">{courses.length} course{courses.length !== 1 ? 's' : ''} available</p>
      </div>
      
      <div className="course-list">
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <div key={index} className="course-card">
              <div className="course-info">
                <h4>{course.course_name}</h4>
                <p className="course-code">{course.course}</p>
                <div className="course-meta">
                  <span className={`difficulty ${course.difficulty_level?.toLowerCase() || 'intermediate'}`}>
                    {course.difficulty_level || 'Intermediate'}
                  </span>
                </div>
                {course.keywords && (
                  <div className="keywords">
                    <strong>Keywords:</strong> {course.keywords}
                  </div>
                )}
                {course.theme2 && course.theme2.trim() !== '' && (
                  <div className="additional-themes">
                    <strong>Additional Themes:</strong> {[course.theme2, course.theme3].filter(t => t && t.trim() !== '').join(', ')}
                  </div>
                )}
              </div>
              <div className="course-actions">
                <button 
                  onClick={() => onCourseSelect(course)}
                  className="select-course-button"
                >
                  Select Course
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-courses">
            <p>No courses found for this theme.</p>
            <p>Try selecting a different theme or start a general chat.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseSelector; 