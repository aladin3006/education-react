import React, { useEffect, useState, createContext } from 'react';
import { Form, Button, Row, Container, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

function AddVideo() {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [selectedLesson, setSelectedLesson] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [link, setLink] = useState('');
    const [showAddAlert, setShowAddAlert] = useState(false);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await axios.get('http://localhost:8000/courses');
                setCourses(response.data);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        };
        fetchCourses();
    }, []);

    const handleCourseChange = (e) => {
        setSelectedCourse(e.target.value);
        setSelectedChapter('');
        setSelectedLesson('');
    };

    const handleChapterChange = (e) => {
        setSelectedChapter(e.target.value);
        setSelectedLesson('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newVideo = {
            name,
            description,
            link,
            courseId: selectedCourse,
            chapterId: selectedChapter,
            lessonId: selectedLesson,
        };

        try {
            // Assuming this POST request adds the new video successfully
            await axios.post('http://localhost:8000/videos', newVideo);

            // Copy of the current state to avoid direct state mutation
            const updatedCourses = [...courses];

            // Find the index of the course to update
            const courseIndex = updatedCourses.findIndex(course => course.id === selectedCourse);
            if (courseIndex === -1) {
                console.error('Course not found');
                return;
            }

            // Deep clone of the course to ensure we're not mutating the state directly
            const updatedCourse = JSON.parse(JSON.stringify(updatedCourses[courseIndex]));

            // Find the chapter
            const chapterToUpdate = updatedCourse.chapters.find(chapter => chapter.id === selectedChapter);
            if (!chapterToUpdate) {
                console.error('Chapter not found');
                return;
            }

            // Find the lesson and update its link
            const lessonToUpdate = chapterToUpdate.lessons.find(lesson => lesson.id === selectedLesson);
            if (!lessonToUpdate) {
                console.error('Lesson not found');
                return;
            }
            lessonToUpdate.link = link; // Updating the lesson's link

            // Replace the old course with the updated one in our copied courses array
            updatedCourses[courseIndex] = updatedCourse;

            // Here you would normally make an API call to update the course with the updated lesson link
            // Since this is a mock, we'll update the local state directly
            // This part needs to be replaced with your API call, e.g., axios.put('API_ENDPOINT', updatedCourse)
            await axios.put(`http://localhost:8000/courses/${selectedCourse}`, updatedCourse);

            // Reset form and show success alert
            setShowAddAlert(true);
            setName('');
            setDescription('');
            setLink('');
            setSelectedCourse('');
            setSelectedChapter('');
            setSelectedLesson('');
            setCourses(updatedCourses); // Update state with the updated courses
        } catch (error) {
            console.error('Error adding video:', error);
        }
    };

    return (
        <Container>
            {showAddAlert && (
                <Alert variant="success" onClose={() => setShowAddAlert(false)} dismissible>
                    Video added successfully!
                </Alert>
            )}
            <h1>Create a new Video</h1>
            <Form onSubmit={handleSubmit}>
                <Row className='col-8 d-flex justify-content-center align-items-center'>
                    <Form.Group className="mb-4">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Link</Form.Label>
                        <Form.Control
                            type="text"
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>Select Course</Form.Label>
                        <Form.Control as="select" value={selectedCourse} onChange={handleCourseChange}>
                            <option value="">Select a course</option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>{course.title}</option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    {selectedCourse && (
                        <Form.Group className="mb-4">
                            <Form.Label>Select Chapter</Form.Label>
                            <Form.Control as="select" value={selectedChapter} onChange={handleChapterChange}>
                                <option value="">Select a chapter</option>
                                {courses.find(course => course.id === selectedCourse)?.chapters.map((chapter) => (
                                    <option key={chapter.id} value={chapter.id}>{chapter.title}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    )}
                    {selectedChapter && (
                        <Form.Group className="mb-4">
                            <Form.Label>Select Lesson</Form.Label>
                            {courses
                                .find(course => course.id === selectedCourse)
                                ?.chapters.find(chapter => chapter.id === selectedChapter)
                                ?.lessons.map((lesson) => (
                                    <Form.Check
                                        key={lesson.id}
                                        type="radio"
                                        id={`lesson-${lesson.id}`}
                                        label={lesson.title}
                                        value={lesson.id}
                                        checked={selectedLesson === lesson.id}
                                        onChange={(e) => setSelectedLesson(e.target.value)}
                                    />
                            ))}
                        </Form.Group>
                    )}
                    
                </Row>
                <Button variant="primary" type="submit">
                    Add Video
                </Button>
            </Form>
        </Container>
    );
}

export default AddVideo;
