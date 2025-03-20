
import { isBrowser } from '@/lib/utils';

/**
 * Initialize the database and seed it with initial data
 */
export const initializeDatabaseWithData = async () => {
  try {
    if (isBrowser()) {
      console.log('Browser environment detected, using mock database');
      return true;
    }
    
    console.log('Initializing database...');
    const { initDatabase, seedDatabase } = await import('./dbUtils');
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
