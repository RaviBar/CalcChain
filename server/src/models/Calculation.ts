import { dbHelpers } from '../db';

// Interfaces remain the same
export interface Calculation {
  id: number;
  user_id: number;
  parent_id: number | null;
  operation: string | null;
  number: number;
  result: number;
  created_at: string;
  username?: string;
}

export interface CreateCalculationData {
  user_id: number;
  parent_id?: number | null;
  operation?: string | null;
  number: number;
  result: number;
}

export interface CalculationWithUser extends Calculation {
  username: string;
}

export class CalculationModel {
  static async create(calculationData: CreateCalculationData): Promise<Calculation> {
    const { user_id, parent_id, operation, number, result } = calculationData;
    const res = await dbHelpers.query(
      'INSERT INTO calculations (user_id, parent_id, operation, number, result) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, parent_id || null, operation || null, number, result]
    );
    return res.rows[0];
  }

  static async findById(id: number): Promise<Calculation | null> {
    const result = await dbHelpers.query(
      'SELECT * FROM calculations WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findCalculationTree(): Promise<CalculationWithUser[]> {
    const result = await dbHelpers.query(`
      SELECT c.*, u.username 
      FROM calculations c 
      JOIN users u ON c.user_id = u.id 
      ORDER BY c.created_at ASC
    `);
    return result.rows;
  }

  static async findByIdWithUser(id: number): Promise<CalculationWithUser | null> {
    const result = await dbHelpers.query(`
      SELECT c.*, u.username 
      FROM calculations c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.id = $1
    `, [id]);
    return result.rows[0] || null;
  }
  
  // This function wasn't used in routes, but is good to have
  static async findChildren(parentId: number): Promise<CalculationWithUser[]> {
    const result = await dbHelpers.query(`
      SELECT c.*, u.username 
      FROM calculations c 
      JOIN users u ON c.user_id = u.id 
      WHERE c.parent_id = $1 
      ORDER BY c.created_at ASC
    `, [parentId]);
    return result.rows;
  }
}