package com.examly.springapp.service;

import com.examly.springapp.entity.Course;
import com.examly.springapp.repository.CourseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CourseService {
    private final CourseRepository courseRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course updateCourse(Long id, Course course) {
        Course existingCourse = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        
        if (course.getCourseName() != null) {
            existingCourse.setCourseName(course.getCourseName());
        }
        if (course.getDescription() != null) {
            existingCourse.setDescription(course.getDescription());
        }
        if (course.getCompletionCriteria() != null) {
            existingCourse.setCompletionCriteria(course.getCompletionCriteria());
        }
        
        return courseRepository.save(existingCourse);
    }

    public void deleteCourse(Long id) {
        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found with id: " + id);
        }
        courseRepository.deleteById(id);
    }
}