
import { initDatabase, seedDatabase } from './dbUtils';

/**
 * Initialize the database and seed it with initial data
 */
export const initializeDatabaseWithData = async () => {
  try {
    console.log('Initializing database...');
    await initDatabase();
    console.log('Database initialized successfully');
    
    console.log('Seeding database with initial data...');
    await seedDatabase();
    console.log('Database seeded successfully');
    
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
};
