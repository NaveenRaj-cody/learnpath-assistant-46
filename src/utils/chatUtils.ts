
import { CourseLevel, SubjectArea } from '@/contexts/ChatContext';
import { getAllCourses } from '@/utils/mockDbAdapter';

/**
 * Process a user message and return a response
 */
export const processMessage = async (
  message: string, 
  filter: { level: CourseLevel, subject: SubjectArea }
): Promise<string> => {
  try {
    message = message.toLowerCase();
    
    // Get all courses from database or fallback data
    const courses = await getAllCourses();
    
    // Apply filters
    const filteredCourses = courses.filter(course => {
      if (filter.level !== 'all' && course.level !== filter.level) {
        return false;
      }
      if (filter.subject !== 'all' && course.field !== filter.subject) {
        return false;
      }
      return true;
    });
    
    // Logic to process the message and generate a response
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hello! I'm your education assistant. How can I help you find the right course or college?";
    }
    
    if (message.includes('help') || message.includes('what can you do')) {
      return "I can help you find courses, colleges, and career paths. You can ask me about specific fields like engineering or medicine, or about undergraduate or postgraduate programs.";
    }
    
    if (message.includes('course') || message.includes('program') || message.includes('degree')) {
      if (filteredCourses.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredCourses.length);
        const course = filteredCourses[randomIndex];
        return `You might be interested in ${course.name} which is a ${course.level} program in ${course.field}. It takes ${course.duration} to complete. Would you like more information about this course?`;
      } else {
        return "I couldn't find any courses matching your criteria. Try adjusting your filters or ask me about a specific field.";
      }
    }
    
    if (message.includes('college') || message.includes('university') || message.includes('institution')) {
      const allColleges = courses.flatMap(course => course.topColleges);
      if (allColleges.length > 0) {
        const randomIndex = Math.floor(Math.random() * allColleges.length);
        const college = allColleges[randomIndex];
        return `${college.name} is a great institution located in ${college.location}. It's ranked ${college.ranking} and offers various programs. Would you like to know which courses they offer?`;
      } else {
        return "I don't have information about specific colleges at the moment. Can you tell me more about what you're looking for?";
      }
    }
    
    if (message.includes('career') || message.includes('job') || message.includes('profession')) {
      const allCareers = courses.flatMap(course => course.careerProspects);
      if (allCareers.length > 0) {
        const randomIndex = Math.floor(Math.random() * allCareers.length);
        const career = allCareers[randomIndex];
        return `A career as a ${career} can be very rewarding. Would you like to know which courses can lead to this profession?`;
      } else {
        return "I don't have specific career information at the moment. Can you tell me more about your interests?";
      }
    }
    
    // Default response if no specific keywords are matched
    return "I'm here to help you navigate educational options. You can ask me about courses, colleges, or career paths. Try using filters to narrow down your search.";
  } catch (error) {
    console.error('Error processing message:', error);
    return "I'm sorry, I encountered an error while processing your message. Please try again.";
  }
};
