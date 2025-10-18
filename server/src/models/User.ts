import { dbHelpers } from '../db';

export interface User {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface CreateUserData {
  username: string;
  password_hash: string;
}

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const { username, password_hash } = userData;
    const result = await dbHelpers.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
      [username, password_hash]
    );
    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<User | null> {
    const result = await dbHelpers.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const result = await dbHelpers.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }
  
  static async exists(username: string): Promise<boolean> {
    const result = await dbHelpers.query(
      'SELECT 1 FROM users WHERE username = $1',
      [username]
    );
    return (result?.rowCount ?? 0) > 0;
  }
}