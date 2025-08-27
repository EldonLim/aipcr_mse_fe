'use client';

import { Dialog, DialogTitle, DialogContent, Typography, Chip, Stack, Link, Box } from '@mui/material';
import { Course } from '../interfaces/course';

type CourseDetailsModalProps = {
  open: boolean;
  onClose: () => void;
  course: Course | null;
};

const CourseDetailsModal = ({ open, onClose, course }: CourseDetailsModalProps) => {
  if (!course) return null;

  const preReqMatch = course.course_summary.match(/Pre-requisites:\s*(.*)/i);
    const preRequisites = preReqMatch ? preReqMatch[1].trim() : '';

    // Remove Pre-requisites line
    let contentWithoutPreReq = course.course_summary.replace(/Pre-requisites:\s*.*$/i, '').trim();

    // Extract bullet points:
    // If there are <li> tags, use them, else fallback to newlines after colon.
    let bulletItems: string[] = [];

    if (/<li>/.test(contentWithoutPreReq)) {
    // Case 1: HTML <li> bullets
    bulletItems = Array.from(contentWithoutPreReq.matchAll(/<li>(.*?)<\/li>/g)).map(match => match[1]);
    // Remove <li> tags from content
    contentWithoutPreReq = contentWithoutPreReq.replace(/<li>.*?<\/li>/g, '').trim();
    } else {
    // Case 2: Plain Text Bullets (split by newline after a colon sentence)
    const splitContent = contentWithoutPreReq.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    // Assume first line(s) are intro, rest are bullets
    contentWithoutPreReq = splitContent[0]; // First paragraph
    bulletItems = splitContent.slice(1);    // The bullet points
    }

  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
    PaperProps={{
    sx: {
      borderRadius: 3,
      backgroundColor: '#ffffff',  
      color: '#333333',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    }
  }}>
      <DialogTitle sx={{ color: '#8b6b31', }} ><strong>{course.course} {course.course_name}</strong></DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom sx={{ color: '#333333' }}>
          <strong>Course Aim:</strong> {contentWithoutPreReq}
        </Typography>

        <ul style={{ paddingLeft: '20px' }}>
            {bulletItems.map((item, index) => (
            <li key={index}>
                <Typography variant="body2" sx={{ color: '#333333' }}>{item}</Typography>
            </li>
            ))}
        </ul>

        {preRequisites && (
            <Typography sx={{ mt: 2, color: '#333333' }}>
                <strong>Pre-requisites:</strong> {preRequisites}
            </Typography>
            )}

        <Typography sx={{ mt: 2, color: '#333333' }}>
            <strong>Themes:</strong> {course.themes.join(', ')}
        </Typography>

        <Stack direction="row" spacing={1} sx={{ my: 2 }} flexWrap="wrap">
            <Typography sx={{ color: '#333333' }}>Tags: </Typography>
          {course.tags.map((tag) => (
            <Chip key={tag} label={tag} variant="outlined" 
            sx={{
            color: '#8b6b31',
            borderColor: '#8b6b31',
            backgroundColor: '#f5f5f5',
            '&:hover': {
              backgroundColor: 'rgba(139, 107, 49, 0.1)',
            },
          }}
/>
          ))}
        </Stack>

        <Box sx={{ mt: 2 }}>
          <Link href={course.course_url} target="_blank" rel="noopener"
          sx={{ 
            fontWeight: 'bold' ,
            color: '#1976d2',
            '&:hover': {
              color: '#115293',
            }
          }}>
            View Course Document (PDF)
          </Link>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailsModal;
