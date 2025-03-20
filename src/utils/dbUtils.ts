
import pool from '../config/db';
import { College, Course } from '../data/coursesData';

// Function to initialize the database with tables
export const initDatabase = async () => {
  const connection = await pool.getConnection();
  try {
    // Create colleges table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS colleges (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        ranking VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Create college_features table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS college_features (
        id INT AUTO_INCREMENT PRIMARY KEY,
        college_id INT NOT NULL,
        feature TEXT NOT NULL,
        FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
      );
    `);

    // Create courses table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        level VARCHAR(50) NOT NULL,
        field VARCHAR(50) NOT NULL,
        duration VARCHAR(50) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Create career_prospects table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS career_prospects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        course_id VARCHAR(50) NOT NULL,
        career_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
      );
    `);

    // Create course_colleges (junction table for many-to-many relationship)
    await connection.query(`
      CREATE TABLE IF NOT EXISTS course_colleges (
        course_id VARCHAR(50) NOT NULL,
        college_id INT NOT NULL,
        PRIMARY KEY (course_id, college_id),
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
      );
    `);

    console.log('Database tables created successfully');
  } catch (error) {
    console.error('Error creating database tables:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Function to insert seed data from our static JSON
export const seedDatabase = async () => {
  const connection = await pool.getConnection();
  try {
    // Import the static data
    const { coursesData } = await import('../data/coursesData');
    
    // Begin transaction for data consistency
    await connection.beginTransaction();
    
    // Process each course and its related entities
    for (const course of coursesData) {
      // Insert course
      await connection.query(
        'INSERT IGNORE INTO courses (id, name, level, field, duration, description) VALUES (?, ?, ?, ?, ?, ?)',
        [course.id, course.name, course.level, course.field, course.duration, course.description]
      );
      
      // Insert career prospects
      for (const career of course.careerProspects) {
        await connection.query(
          'INSERT IGNORE INTO career_prospects (course_id, career_name) VALUES (?, ?)',
          [course.id, career]
        );
      }
      
      // Process colleges
      for (const college of course.topColleges) {
        // Check if college already exists
        const [rows] = await connection.query(
          'SELECT id FROM colleges WHERE name = ?',
          [college.name]
        );
        
        const existingColleges = rows as any[];
        let collegeId;
        
        if (existingColleges.length === 0) {
          // Insert new college
          const [result] = await connection.query(
            'INSERT INTO colleges (name, location, ranking) VALUES (?, ?, ?)',
            [college.name, college.location, college.ranking]
          );
          collegeId = (result as any).insertId;
          
          // Insert college features
          for (const feature of college.features) {
            await connection.query(
              'INSERT INTO college_features (college_id, feature) VALUES (?, ?)',
              [collegeId, feature]
            );
          }
        } else {
          collegeId = existingColleges[0].id;
        }
        
        // Create course-college relationship
        await connection.query(
          'INSERT IGNORE INTO course_colleges (course_id, college_id) VALUES (?, ?)',
          [course.id, collegeId]
        );
      }
    }
    
    // Commit the transaction
    await connection.commit();
    
    console.log('Database seeded successfully');
  } catch (error) {
    // Rollback on error
    await connection.rollback();
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Functions to fetch data from database

export const getAllCourses = async (): Promise<Course[]> => {
  const connection = await pool.getConnection();
  try {
    // Get all courses
    const [coursesRows] = await connection.query('SELECT * FROM courses');
    const courses = coursesRows as any[];
    
    // For each course, get its career prospects and colleges
    const fullCourses = await Promise.all(
      courses.map(async (course: any) => {
        // Get career prospects
        const [careerRows] = await connection.query(
          'SELECT career_name FROM career_prospects WHERE course_id = ?',
          [course.id]
        );
        const careerProspects = careerRows as any[];
        
        // Get associated colleges
        const [collegeRows] = await connection.query(
          `SELECT c.id, c.name, c.location, c.ranking 
           FROM colleges c
           JOIN course_colleges cc ON c.id = cc.college_id
           WHERE cc.course_id = ?`,
          [course.id]
        );
        const collegeRefs = collegeRows as any[];
        
        // For each college, get its features
        const topColleges = await Promise.all(
          collegeRefs.map(async (college: any) => {
            const [featureRows] = await connection.query(
              'SELECT feature FROM college_features WHERE college_id = ?',
              [college.id]
            );
            const features = featureRows as any[];
            
            return {
              name: college.name,
              location: college.location,
              ranking: college.ranking,
              features: features.map((f: any) => f.feature)
            };
          })
        );
        
        return {
          id: course.id,
          name: course.name,
          level: course.level,
          field: course.field,
          duration: course.duration,
          description: course.description,
          careerProspects: careerProspects.map((cp: any) => cp.career_name),
          topColleges
        };
      })
    );
    
    return fullCourses;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const getCourseById = async (id: string): Promise<Course | null> => {
  const connection = await pool.getConnection();
  try {
    // Get the course
    const [coursesRows] = await connection.query('SELECT * FROM courses WHERE id = ?', [id]);
    const courses = coursesRows as any[];
    
    if (courses.length === 0) {
      return null;
    }
    
    const course = courses[0];
    
    // Get career prospects
    const [careerRows] = await connection.query(
      'SELECT career_name FROM career_prospects WHERE course_id = ?',
      [course.id]
    );
    const careerProspects = careerRows as any[];
    
    // Get associated colleges
    const [collegeRows] = await connection.query(
      `SELECT c.id, c.name, c.location, c.ranking 
       FROM colleges c
       JOIN course_colleges cc ON c.id = cc.college_id
       WHERE cc.course_id = ?`,
      [course.id]
    );
    const collegeRefs = collegeRows as any[];
    
    // For each college, get its features
    const topColleges = await Promise.all(
      collegeRefs.map(async (college: any) => {
        const [featureRows] = await connection.query(
          'SELECT feature FROM college_features WHERE college_id = ?',
          [college.id]
        );
        const features = featureRows as any[];
        
        return {
          name: college.name,
          location: college.location,
          ranking: college.ranking,
          features: features.map((f: any) => f.feature)
        };
      })
    );
    
    return {
      id: course.id,
      name: course.name,
      level: course.level,
      field: course.field,
      duration: course.duration,
      description: course.description,
      careerProspects: careerProspects.map((cp: any) => cp.career_name),
      topColleges
    };
  } catch (error) {
    console.error('Error fetching course by ID:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Function to save or update a course
export const saveCourse = async (course: Course): Promise<void> => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    // Insert or update course
    await connection.query(
      `INSERT INTO courses (id, name, level, field, duration, description) 
       VALUES (?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       name = VALUES(name), 
       level = VALUES(level), 
       field = VALUES(field), 
       duration = VALUES(duration), 
       description = VALUES(description)`,
      [course.id, course.name, course.level, course.field, course.duration, course.description]
    );
    
    // Remove existing career prospects and add new ones
    await connection.query('DELETE FROM career_prospects WHERE course_id = ?', [course.id]);
    for (const career of course.careerProspects) {
      await connection.query(
        'INSERT INTO career_prospects (course_id, career_name) VALUES (?, ?)',
        [course.id, career]
      );
    }
    
    // Process colleges (more complex as we need to maintain references)
    for (const college of course.topColleges) {
      // Check if college exists
      const [rows] = await connection.query(
        'SELECT id FROM colleges WHERE name = ?',
        [college.name]
      );
      
      const existingColleges = rows as any[];
      let collegeId;
      
      if (existingColleges.length === 0) {
        // Insert new college
        const [result] = await connection.query(
          'INSERT INTO colleges (name, location, ranking) VALUES (?, ?, ?)',
          [college.name, college.location, college.ranking]
        );
        collegeId = (result as any).insertId;
        
        // Insert college features
        for (const feature of college.features) {
          await connection.query(
            'INSERT INTO college_features (college_id, feature) VALUES (?, ?)',
            [collegeId, feature]
          );
        }
      } else {
        collegeId = existingColleges[0].id;
        
        // Update college data
        await connection.query(
          'UPDATE colleges SET location = ?, ranking = ? WHERE id = ?',
          [college.location, college.ranking, collegeId]
        );
        
        // Update features
        await connection.query('DELETE FROM college_features WHERE college_id = ?', [collegeId]);
        for (const feature of college.features) {
          await connection.query(
            'INSERT INTO college_features (college_id, feature) VALUES (?, ?)',
            [collegeId, feature]
          );
        }
      }
      
      // Ensure course-college relationship
      await connection.query(
        'INSERT IGNORE INTO course_colleges (course_id, college_id) VALUES (?, ?)',
        [course.id, collegeId]
      );
    }
    
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    console.error('Error saving course:', error);
    throw error;
  } finally {
    connection.release();
  }
};
