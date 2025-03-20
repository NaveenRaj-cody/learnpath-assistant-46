
import { College, Course } from '../data/coursesData';

// Create a mock implementation for browser environment
export const getAllCourses = async (): Promise<Course[]> => {
  // Directly import the static data
  const { coursesData } = await import('../data/coursesData');
  return coursesData;
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  const { coursesData } = await import('../data/coursesData');
  const course = coursesData.find(course => course.id === id);
  return course || null;
};

export const saveCourse = async (course: Course): Promise<void> => {
  console.log('Mock saving course:', course);
  // In browser environment, this is just a mock function
};
