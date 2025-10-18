import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// This pool will use the DATABASE_URL from your .env or docker-compose environment
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Database helper functions using the pool
export const dbHelpers = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// Initialize database schema for PostgreSQL
export const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create calculations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS calculations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        parent_id INTEGER REFERENCES calculations(id) ON DELETE CASCADE,
        operation CHAR(1) CHECK (operation IN ('+', '-', '*', '/')),
        number DOUBLE PRECISION NOT NULL,
        result DOUBLE PRECISION NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await client.query(`CREATE INDEX IF NOT EXISTS idx_calculations_parent_id ON calculations(parent_id)`);
    await client.query(`CREATE INDEX IF NOT EXISTS idx_calculations_user_id ON calculations(user_id)`);
    
    client.release();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};