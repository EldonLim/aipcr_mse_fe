'use client'

import { Box, Pagination, Typography } from "@mui/material";
import { Course } from "../interfaces/course"
import { CourseCard } from "./CourseCard";
import SearchBar from "./SearchBar";
import { useMemo, useState } from "react";
import CourseDetailsModal from "./CourseDetailsModal";

interface CoursesProps {
    allCourses: Course[]
}

export const Courses = ({ allCourses }: CoursesProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const coursesPerPage = 9;

    // Filter courses based on search query
    const filteredCourses = useMemo(() => {
        if (!searchQuery) return allCourses;
        return allCourses.filter(course => 
            course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.course_summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
            course.themes.some(theme => theme.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [allCourses, searchQuery]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
    const startIndex = (currentPage - 1) * coursesPerPage;
    const currentCourses = filteredCourses.slice(startIndex, startIndex + coursesPerPage);
    
    // Reset to page 1 when search query changes
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };
    
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        // Optional: scroll to top when page changes
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCourseClick = (course: Course) => {
        setSelectedCourse(course);
    };

    const handleCloseModal = () => {
        setSelectedCourse(null);
    };
    
    return (
        <Box sx={{display:'flex', flexDirection:'column', gap: 4, width:'100%'}}>
            <Box sx={{ my: 3, 
                width: {
                lg: '75.2rem',
                md: '60.2rem',
                sm: '48.2rem',
                xs: '25rem'
                }, 
                alignSelf:'flex-start' }}>
                <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </Box>

            {filteredCourses.length === 0 ? (
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '400px',
                    width: '100%'
                }}>
                    <Typography variant="h6" color="#b0b0b0">
                        No courses found
                    </Typography>
                </Box>
            ) : (
                <>
                    <Box sx={{
                        display: 'grid',
                        width: {
                        lg: '75rem',
                        md: '60rem',
                        sm: '48rem',
                        xs: '25rem'
                        },
                        gridTemplateColumns: {
                        xs: '1fr',   
                        sm: 'repeat(2, 1fr)', 
                        md: 'repeat(3, 1fr)', 
                        },
                        gap: 3,
                        minHeight: currentCourses.length > 3 ? '600px' : 'auto',
                    }}>
                        {currentCourses.map((course: Course) => (
                            <div key={course.id} onClick={() => handleCourseClick(course)} style={{ cursor: 'pointer' }}>
                                <CourseCard course={course} />
                            </div>
                        ))}
                    </Box>

                    {totalPages > 1 && (
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            mt: 4,
                            mb: 2 
                        }}>
                            <Pagination 
                                count={totalPages} 
                                page={currentPage} 
                                onChange={handlePageChange}
                                size="large"
                                showFirstButton
                                showLastButton
                                sx={{
                                    '& .MuiPaginationItem-root': {
                                    color: 'white',
                                    borderColor: 'white',
                                    },
                                    '& .MuiPaginationItem-root.Mui-selected': {
                                    backgroundColor: 'white',
                                    color: 'black',
                                    },
                                }}
                            />
                        </Box>
                    )}

                    <CourseDetailsModal
                        open={Boolean(selectedCourse)}
                        onClose={handleCloseModal}
                        course={selectedCourse}
                    />
                </>
            )}
        </Box>
    );
}