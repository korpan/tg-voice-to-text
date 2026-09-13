import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<number, User> = new Map();

  async saveUser(user: User): Promise<void> {
    this.users.set(user.id, user);
    console.log(`User saved: ${user.id}`);
  }

  async getUser(userId: number): Promise<User | null> {
    return this.users.get(userId) || null;
  }
}
