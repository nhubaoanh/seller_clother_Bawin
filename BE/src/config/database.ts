import mysql from 'mysql2/promise';
import { injectable } from 'tsyringe';
import { config } from './config.js';

@injectable()
export class Database {
  private connection: mysql.Connection | null = null;

  constructor() {
    // Don't connect immediately - connect lazily when needed
  }

  private async connect() {
    if (this.connection) {
      return this.connection;
    }

    try {
      this.connection = await mysql.createConnection({
        host: config.database.host,
        user: config.database.user,
        password: config.database.password,
        database: config.database.name,
        port: config.database.port,
      });
      console.log('✅ Database connected successfully');
      return this.connection;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async query(sql: string, params: any[] = []): Promise<any> {
    const connection = await this.connect();
    
    try {
      const [results] = await connection.execute(sql, params);
      return results;
    } catch (error) {
      console.error('❌ Query error:', error);
      console.error('❌ SQL:', sql);
      console.error('❌ Params:', params);
      throw error;
    }
  }

  // Test database connection
  async testConnection(): Promise<boolean> {
    try {
      const connection = await this.connect();
      await connection.ping();
      console.log('✅ Database connection test successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
      return false;
    }
  }

  // Check if stored procedures exist
  async checkStoredProcedures(): Promise<any> {
    try {
      const sql = "SHOW PROCEDURE STATUS WHERE Db = ?";
      const results = await this.query(sql, [config.database.name]);
      console.log('📋 Available stored procedures:', results.map((p: any) => p.Name));
      return results;
    } catch (error) {
      console.error('❌ Failed to check stored procedures:', error);
      return [];
    }
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
    }
  }
}