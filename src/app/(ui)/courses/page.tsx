
import { fetchCourses } from '@/app/lib/api';
import { Typography, Container, Box } from '@mui/material';
import { Course } from '../../interfaces/course';
import { Courses } from '../../components/Courses';
import Image from 'next/image';
import { GlobalStyles } from '@mui/material';
import { ChatbotPage } from '@/app/components/Chatbot';


// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformCourseData(raw: any): Course[]{
  return raw.map((course: Course) => ({
      id: course.id,
      course: course.course,
      course_summary: course.course_summary,
      course_name: course.course_name,
      course_description: course.course_description,
      number_of_semester: course.number_of_semester,
      course_url: course.course_url,
      themes: course.themes,
      tags: course.tags
  }));
}

export default async function CoursesPage() {
  const raw = await fetchCourses();
  const courses = transformCourseData(raw);
  console.log(courses)
  // const courses = [{
  //   id: 2,
  //   course: "asdf",
  //   course_name: "ASdf",
  //   course_summary: "sfs",
  //   image_url: "SAdf"
  // }]

  return (
    <>
      <GlobalStyles styles={{
          html: { height: '100%', backgroundColor: '#ffffff' },
          body: { height: '100%', margin: 0, backgroundColor: '#ffffff' },
          '#__next': { minHeight: '100vh', backgroundColor: '#ffffff' },
        }} />
      <Box sx={{
          position: 'relative',
          minHeight: '135vh',
          background: 'linear-gradient(135deg, #ffffff, #ffffff)',
          overflow: 'hidden',
        }}>
        <Box sx={{
          position: 'absolute',
          width: '150%',
          height: '150%',
          top: '-25%',
          left: '-25%',
          zIndex: 0,
          overflow: 'hidden',

          '&::before': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '30%',
            background: 'rgba(255, 255, 255, 0.04)',
            transform: 'rotate(-30deg)',
            top: '25%',
            left: '-50%',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            width: '200%',
            height: '30%',
            background: 'rgba(255, 255, 255, 0.02)',
            transform: 'rotate(-30deg)',
            top: '35%',
            left: '-50%',
            zIndex: -1
          }
        }} />
        <Container sx={{position:'relative', zIndex: 1}}>
          <Box alignContent={'left'}>
            <Image 
              src="/ntulogo.png" 
              alt="NTU Logo"
              width={200} // Specify actual width
              height={130} // Specify actual height
              priority 
            />
          </Box>
          <Typography variant="h4" fontWeight="bold" mb={3} sx={{ textAlign: 'center', color: 'black' }}>
            MSE Course Finder
          </Typography>
          <Typography variant='body1' mb={3} color='#333333'>
            If you&apos;re new to materials science or just getting started, 
            we&apos;ve curated some beginner-friendly courses to help you begin 
            your journey. You can search for specific topics using the 
            search bar below or explore the recommended starter courses to 
            get started.
          </Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
              },
              gap: 3,
              pb: 6
            }}
          >
            <Courses allCourses={courses}/>
          </Box>
        
        </Container>
      </Box>
      <Box sx={{ position: 'relative', zIndex: 2}}>
        <ChatbotPage></ChatbotPage>
      </Box>
      
    </>
  );
}