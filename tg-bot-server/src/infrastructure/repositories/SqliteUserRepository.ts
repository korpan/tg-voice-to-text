import Database from 'better-sqlite3';
import type { Database as DatabaseType } from 'better-sqlite3';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class SqliteUserRepository implements IUserRepository {
  private db: DatabaseType;

  constructor(dbPath: string = 'database.sqlite') {
    this.db = new Database(dbPath);
    this.init();
  }

  private init(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT,
        firstName TEXT,
        lastName TEXT,
        languageCode TEXT
      )
    `);

  }

  async saveUser(user: User): Promise<void> {
    const stmt = this.db.prepare(
      'INSERT OR REPLACE INTO users (id, username, firstName, lastName, languageCode) VALUES (?, ?, ?, ?, ?)'
    );
    stmt.run(user.id, user.username, user.firstName, user.lastName, user.languageCode);
    console.log(`User saved to SQLite: ${user.id}`);
  }

  async getUser(userId: number): Promise<User | null> {
    const stmt = this.db.prepare('SELECT * FROM users WHERE id = ?');
    const user = stmt.get(userId) as User | undefined;
    return user || null;
  }

  async getAllUsers(): Promise<User[]> {
    return this.db.prepare('SELECT * FROM users').all() as User[];
  }
}
