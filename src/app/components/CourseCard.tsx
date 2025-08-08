'use client'

import { Card, CardContent, Typography, CardMedia, Button, Box } from '@mui/material';
import { Course } from '../interfaces/course';
// import { useState } from 'react';

export const CourseCard = ({ course }: { course: Course }) => {
  // const [expanded, setExpanded] = useState(false);
  // const toggleExpanded = () => setExpanded((prev) => !prev);

  // const summary = expanded
  //   ? course.course_summary
  //   : course.course_summary.slice(0, 180) + (course.course_summary.length > 180 ? '...' : '');

  const summary = course.course_summary.slice(0, 180) + (course.course_summary.length > 180 ? '...' : '');
    
  return (
    <Card 
    sx={{
        height: '100%',
        backgroundColor: 'rgba(30, 30, 30, 0.5)',
        backdropFilter: "blur(2px)",
        color: 'white', 
        transition: 'transform 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.03)',  // Zoom in slightly
          boxShadow: '0 8px 16px rgba(0,0,0,0.2)', // Optional: add shadow for emphasis
        },
      }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#cccccc' }}>
          {course.course_name}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#dddddd' }}>
          {course.course}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#cccccc' }}>
          <span dangerouslySetInnerHTML={{ __html: summary }} />
        </Typography>

        {course.course_summary.length > 180 && (
          <Button
            size="small"
            sx={{ mt: 1, textTransform: 'none', fontWeight: 'bold' }}
          >
            {/* {expanded ? 'Read less' : 'Read more'} */}
            Read more
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

