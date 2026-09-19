import { SqliteUserRepository } from './infrastructure/repositories/SqliteUserRepository';
import { DumpUsersUseCase } from './application/use-cases/DumpUsersUseCase';

async function run() {
  const command = process.argv[2];

  if (command === 'dump-users') {
    try {
      const repo = new SqliteUserRepository();
      const useCase = new DumpUsersUseCase(repo);
      const users = await useCase.execute();

      if (users.length === 0) {
        console.log('No users found in the database.');
      } else {
        console.table(users);
      }
    } catch (error) {
      console.error('Error dumping users:', error);
      process.exit(1);
    }
  } else {
    console.log('Usage: npm run dump-users');
    console.log('Available commands: dump-users');
  }
}

run().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
