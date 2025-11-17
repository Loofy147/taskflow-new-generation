/**
 * Database Module
 * 
 * Handles database connection, initialization, and management.
 * Supports PostgreSQL with connection pooling.
 */

import { Pool, Client } from 'pg';

/**
 * Database class
 * 
 * Manages PostgreSQL connections and provides query methods.
 */
class Database {
  private pool: Pool | null = null;
  private isConnected: boolean = false;

  /**
   * Initialize database connection
   */
  async initialize(): Promise<void> {
    try {
      const connectionString = process.env.DATABASE_URL;

      if (!connectionString) {
        throw new Error('DATABASE_URL environment variable is not set');
      }

      this.pool = new Pool({
        connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });

      // Test connection
      const client = await this.pool.connect();
      await client.query('SELECT NOW()');
      client.release();

      this.isConnected = true;
      console.log('[Database] Connection pool initialized successfully');
    } catch (error) {
      this.isConnected = false;
      throw new Error(`Database initialization failed: ${error}`);
    }
  }

  /**
   * Execute a query
   */
  async query(text: string, params?: unknown[]): Promise<any> {
    if (!this.pool) {
      throw new Error('Database not initialized');
    }

    try {
      const result = await this.pool.query(text, params);
      return result.rows;
    } catch (error) {
      console.error('[Database] Query error:', error);
      throw error;
    }
  }

  /**
   * Execute a single row query
   */
  async queryOne(text: string, params?: unknown[]): Promise<any | null> {
    const rows = await this.query(text, params);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Get connection status
   */
  isHealthy(): boolean {
    return this.isConnected && this.pool !== null;
  }

  /**
   * Close database connection
   */
  async close(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      console.log('[Database] Connection pool closed');
    }
  }
}

// Export singleton instance
export const database = new Database();
