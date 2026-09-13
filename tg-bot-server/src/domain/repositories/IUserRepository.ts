import { User } from '../entities/User';

export interface IUserRepository {
  saveUser(user: User): Promise<void>;
  getUser(userId: number): Promise<User | null>;
}
