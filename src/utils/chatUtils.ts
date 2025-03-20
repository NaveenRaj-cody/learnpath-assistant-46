import { CourseLevel, SubjectArea } from '@/contexts/ChatContext';
import { Course } from '@/data/coursesData';
import { getAllCourses } from './dbUtils';

// Helper function to get a random item from an array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Function to find courses based on user's query and filters
export const findRelevantCourses = async (
  query: string, 
  filter: { level: CourseLevel; subject: SubjectArea }
): Promise<Course[]> => {
  try {
    // Get courses from database
    const courses = await getAllCourses();
    
    let filteredCourses = [...courses];
    
    // Apply level filter
    if (filter.level !== 'all') {
      filteredCourses = filteredCourses.filter(course => 
        course.level === filter.level
      );
    }
    
    // Apply subject filter
    if (filter.subject !== 'all') {
      filteredCourses = filteredCourses.filter(course => 
        course.field === filter.subject
      );
    }
    
    // Apply text search if query is not empty
    if (query.trim()) {
      const searchTerms = query.toLowerCase().split(' ');
      filteredCourses = filteredCourses.filter(course => {
        const courseText = `${course.name} ${course.description} ${course.field} ${course.level}`.toLowerCase();
        return searchTerms.some(term => courseText.includes(term));
      });
    }
    
    return filteredCourses;
  } catch (error) {
    console.error('Error finding relevant courses:', error);
    // Fallback to static data if database fails
    const { coursesData } = await import('../data/coursesData');
    return findRelevantCoursesFromStatic(query, filter, coursesData);
  }
};

// Fallback function using static data
const findRelevantCoursesFromStatic = (
  query: string,
  filter: { level: CourseLevel; subject: SubjectArea },
  coursesData: Course[]
): Course[] => {
  let filteredCourses = [...coursesData];
  
  // Apply level filter
  if (filter.level !== 'all') {
    filteredCourses = filteredCourses.filter(course => 
      course.level === filter.level
    );
  }
  
  // Apply subject filter
  if (filter.subject !== 'all') {
    filteredCourses = filteredCourses.filter(course => 
      course.field === filter.subject
    );
  }
  
  // Apply text search if query is not empty
  if (query.trim()) {
    const searchTerms = query.toLowerCase().split(' ');
    filteredCourses = filteredCourses.filter(course => {
      const courseText = `${course.name} ${course.description} ${course.field} ${course.level}`.toLowerCase();
      return searchTerms.some(term => courseText.includes(term));
    });
  }
  
  return filteredCourses;
};

// Process message now handles async operations
export const processMessage = async (
  message: string,
  filter: { level: CourseLevel; subject: SubjectArea }
): Promise<string> => {
  const lowerMessage = message.toLowerCase();
  
  // Check if the message is asking about courses
  if (
    lowerMessage.includes('course') || 
    lowerMessage.includes('program') || 
    lowerMessage.includes('degree') ||
    lowerMessage.includes('study')
  ) {
    try {
      const courses = await findRelevantCourses(message, filter);
      
      if (courses.length === 0) {
        return "I couldn't find any courses matching your criteria in India. Could you try a different search or be more specific about what you're looking for?";
      }
      
      // Limit to 3 courses for a concise response
      const displayCourses = courses.slice(0, 3);
      
      let response = "Here are some courses in India that might interest you:\n\n";
      
      displayCourses.forEach((course, index) => {
        response += `**${course.name}** (${course.level})\n`;
        response += `${course.description}\n`;
        response += `**Duration:** ${course.duration}\n`;
        response += `**Career Prospects in India:** ${course.careerProspects.join(', ')}\n`;
        
        if (index < displayCourses.length - 1) {
          response += "\n---\n\n";
        }
      });
      
      if (courses.length > 3) {
        response += "\n\nThere are more courses available in Indian universities. Would you like me to show you more options or refine your search?";
      }
      
      return response;
    } catch (error) {
      console.error('Error processing course message:', error);
      return "I'm having trouble accessing the course database at the moment. Please try again later.";
    }
  }
  
  // Check if the message is asking about colleges
  if (
    lowerMessage.includes('college') || 
    lowerMessage.includes('university') || 
    lowerMessage.includes('institution') ||
    lowerMessage.includes('school')
  ) {
    // Find relevant courses first
    const courses = findRelevantCourses(message, filter);
    
    if (courses.length === 0) {
      return "I couldn't find any colleges in India matching your criteria. Could you try a different search or be more specific about what you're looking for?";
    }
    
    // Get a random course to recommend colleges for
    const selectedCourse = getRandomItem(courses);
    
    let response = `Here are some top colleges in India offering **${selectedCourse.name}**:\n\n`;
    
    // Filter to only show Indian colleges
    const indianColleges = selectedCourse.topColleges.filter(college => 
      college.location.includes('India')
    );
    
    if (indianColleges.length === 0) {
      response = `I couldn't find specific Indian colleges for ${selectedCourse.name} in our database. However, here are some top institutions for this field in India:\n\n`;
      
      // Provide some generic Indian colleges based on the field
      const genericColleges = [
        {
          name: getGenericCollegeName(selectedCourse.field),
          location: getRandomIndianCity(),
          ranking: "Top-ranked in India",
          features: ["Quality education", "Good placement record", "Modern facilities"]
        },
        {
          name: getAlternativeCollegeName(selectedCourse.field),
          location: getRandomIndianCity(),
          ranking: "Among top 10 in India",
          features: ["Industry partnerships", "Research opportunities", "Experienced faculty"]
        }
      ];
      
      genericColleges.forEach((college, index) => {
        response += `**${college.name}**\n`;
        response += `**Location:** ${college.location}\n`;
        response += `**Ranking:** ${college.ranking}\n`;
        response += `**Notable Features:** ${college.features.join(', ')}\n`;
        
        if (index < genericColleges.length - 1) {
          response += "\n---\n\n";
        }
      });
    } else {
      indianColleges.slice(0, 3).forEach((college, index) => {
        response += `**${college.name}**\n`;
        response += `**Location:** ${college.location}\n`;
        response += `**Ranking:** ${college.ranking}\n`;
        response += `**Notable Features:** ${college.features.join(', ')}\n`;
        
        if (index < Math.min(indianColleges.length, 3) - 1) {
          response += "\n---\n\n";
        }
      });
    }
    
    return response;
  }
  
  // Check if the message is asking about jobs or careers
  if (
    lowerMessage.includes('job') || 
    lowerMessage.includes('career') || 
    lowerMessage.includes('work') ||
    lowerMessage.includes('profession') ||
    lowerMessage.includes('salary') ||
    lowerMessage.includes('opportunity')
  ) {
    // Find relevant courses first
    const courses = findRelevantCourses(message, filter);
    
    if (courses.length === 0) {
      return "I couldn't find any career paths in India matching your criteria. Could you try a different search or be more specific about what you're looking for?";
    }
    
    // Get a random course to recommend careers for
    const selectedCourse = getRandomItem(courses);
    
    let response = `After completing **${selectedCourse.name}** in India, you could pursue these career paths:\n\n`;
    
    selectedCourse.careerProspects.forEach((career, index) => {
      response += `**${career}**\n`;
      
      // Generate a realistic Indian salary range for the career
      const baseSalary = getIndianSalaryRange(selectedCourse.field, career).min;
      const maxSalary = getIndianSalaryRange(selectedCourse.field, career).max;
      
      response += `**Salary Range in India:** ₹${baseSalary.toLocaleString()} - ₹${maxSalary.toLocaleString()} per annum\n`;
      
      // Generate realistic growth rate for Indian market
      const growthRate = getIndianGrowthRate(selectedCourse.field);
      response += `**Industry Growth in India:** ${growthRate}% annually\n`;
      
      // Add India-specific companies that hire for this role
      const companies = getIndianCompanies(career, selectedCourse.field);
      response += `**Top Hiring Companies:** ${companies.join(', ')}\n`;
      
      if (index < selectedCourse.careerProspects.length - 1) {
        response += "\n---\n\n";
      }
    });
    
    response += "\n\nWould you like more specific information about any of these career paths in India?";
    
    return response;
  }
  
  // General greeting or introduction
  if (
    lowerMessage.includes('hi') || 
    lowerMessage.includes('hello') || 
    lowerMessage.includes('hey') ||
    lowerMessage.includes('greetings') ||
    lowerMessage.includes('start')
  ) {
    return "Namaste! I'm your AI Career Assistant for Indian students. I can help you with:\n\n" +
      "1. Finding the right courses in Indian colleges based on your interests\n" +
      "2. Discovering top colleges and universities across India\n" +
      "3. Exploring job opportunities and career paths in the Indian market\n" +
      "4. Understanding salary expectations and industry growth in India\n\n" +
      "What would you like to explore today? You can ask me about specific courses, colleges, or careers available in India.";
  }
  
  // Default response
  return "I'm here to help Indian students with education and career questions. You can ask me about courses offered in Indian universities, top colleges in India, job opportunities in the Indian market, or salary expectations for various professions. What specific information are you looking for?";
};

// Helper functions for India-specific data

function getRandomIndianCity() {
  const cities = [
    "New Delhi, India", "Mumbai, India", "Bangalore, India", "Chennai, India", 
    "Hyderabad, India", "Kolkata, India", "Pune, India", "Ahmedabad, India", 
    "Jaipur, India", "Chandigarh, India", "Lucknow, India", "Bhubaneswar, India"
  ];
  return cities[Math.floor(Math.random() * cities.length)];
}

function getGenericCollegeName(field: string) {
  const prefixes = ["Indian Institute of", "National Institute of", "School of", "University of", "College of"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  switch (field) {
    case "engineering": return `${prefix} Technology`;
    case "medicine": return `${prefix} Medical Sciences`;
    case "business": return `${prefix} Management Studies`;
    case "arts": return `${prefix} Design and Fine Arts`;
    case "science": return `${prefix} Science and Research`;
    default: return `${prefix} Advanced Studies`;
  }
}

function getAlternativeCollegeName(field: string) {
  const prefixes = ["Bharatiya", "Central", "Government", "State", "Premier"];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  
  switch (field) {
    case "engineering": return `${prefix} Engineering College`;
    case "medicine": return `${prefix} Medical College`;
    case "business": return `${prefix} Institute of Management`;
    case "arts": return `${prefix} College of Arts and Design`;
    case "science": return `${prefix} Institute of Scientific Research`;
    default: return `${prefix} University`;
  }
}

export function getIndianSalaryRange(field: string, career: string) {
  let min = 300000; // Base minimum 3 LPA
  let max = 600000; // Base maximum 6 LPA
  
  // Adjust based on field
  if (field === "engineering") {
    min += 200000;
    max += 600000;
  } else if (field === "medicine") {
    min += 300000;
    max += 1200000;
  } else if (field === "business") {
    min += 150000;
    max += 800000;
  }
  
  // Adjust for specific high-paying careers
  if (career.includes("Data") || career.includes("AI") || career.includes("Machine Learning")) {
    min += 400000;
    max += 1000000;
  } else if (career.includes("Surgeon") || career.includes("Specialist")) {
    min += 600000;
    max += 2000000;
  } else if (career.includes("Manager") || career.includes("Director")) {
    min += 300000;
    max += 1500000;
  }
  
  return { min, max };
}

export function getIndianGrowthRate(field: string) {
  // Base growth rate between 5-8%
  let baseGrowth = 5 + Math.floor(Math.random() * 4);
  
  // Adjust based on field - reflecting current Indian market trends
  switch (field) {
    case "engineering":
      if (Math.random() > 0.5) {
        // IT/Software Engineering has higher growth
        return baseGrowth + 7;
      }
      return baseGrowth + 3;
    case "medicine":
      return baseGrowth + 5;
    case "business":
      return baseGrowth + 2;
    case "arts":
      return baseGrowth + 1;
    case "science":
      return baseGrowth + 4;
    default:
      return baseGrowth;
  }
}

export function getIndianCompanies(career: string, field: string) {
  const techCompanies = ["TCS", "Infosys", "Wipro", "HCL", "Tech Mahindra", "L&T Infotech", "Cognizant", "Accenture India"];
  const medicalCompanies = ["Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Medanta", "AIIMS", "Cipla", "Dr. Reddy's Laboratories"];
  const businessCompanies = ["Reliance Industries", "Tata Consultancy Services", "HDFC Bank", "ICICI Bank", "ITC Limited", "Hindustan Unilever"];
  const designCompanies = ["Tata Elxsi", "Titan Company", "Asian Paints", "Godrej & Boyce", "Future Group", "Reliance Brands"];
  const scienceCompanies = ["ISRO", "DRDO", "BARC", "CSIR", "Tata Institute of Fundamental Research", "National Chemical Laboratory"];
  
  let companies = [];
  
  switch (field) {
    case "engineering":
      companies = techCompanies;
      break;
    case "medicine":
      companies = medicalCompanies;
      break;
    case "business":
      companies = businessCompanies;
      break;
    case "arts":
      companies = designCompanies;
      break;
    case "science":
      companies = scienceCompanies;
      break;
    default:
      // Mix of companies from different sectors
      companies = [
        ...techCompanies.slice(0, 2),
        ...medicalCompanies.slice(0, 2),
        ...businessCompanies.slice(0, 2)
      ];
  }
  
  // Get random 3-4 companies
  const numCompanies = 3 + Math.floor(Math.random() * 2);
  const shuffled = [...companies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numCompanies);
}
