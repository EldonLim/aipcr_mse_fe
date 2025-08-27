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
        backgroundColor: '#f5f5f5',
        border: '1px solid #e0e0e0',
        color: '#333333', 
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        '&:hover': {
          transform: 'scale(1.03)',  // Zoom in slightly
          boxShadow: '0 8px 16px rgba(0,0,0,0..15)', // Optional: add shadow for emphasis
        },
      }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8b6b31' }}>
          {course.course_name}
        </Typography>
        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#333333' }}>
          {course.course}
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, color: '#666666' }}>
          <span dangerouslySetInnerHTML={{ __html: summary }} />
        </Typography>

        {course.course_summary.length > 180 && (
          <Button
            size="small"
            sx={{ mt: 1, 
              textTransform: 'none', 
              fontWeight: 'bold',
              color: '#1976d2',
              '&:hover': {
                color: '#115293',
              }
            }}
          >
            {/* {expanded ? 'Read less' : 'Read more'} */}
            Read more
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

