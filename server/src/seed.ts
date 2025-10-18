import bcrypt from 'bcryptjs';
import { UserModel } from './models/User';
import { CalculationModel } from './models/Calculation';
import { performOperation } from './utils/operations';
import { initializeDatabase } from './db';

const seedDatabase = async () => {
  try {
    console.log('Initializing database...');
    await initializeDatabase();

    console.log('Seeding users...');
    
    // Create sample users
    const users = [
      { username: 'alice', password: 'password123' },
      { username: 'bob', password: 'password123' },
      { username: 'charlie', password: 'password123' }
    ];

    const createdUsers = [];
    for (const userData of users) {
      const existingUser = await UserModel.findByUsername(userData.username);
      if (!existingUser) {
        const password_hash = await bcrypt.hash(userData.password, 10);
        const user = await UserModel.create({
          username: userData.username,
          password_hash
        });
        createdUsers.push(user);
        console.log(`Created user: ${user.username}`);
      } else {
        createdUsers.push(existingUser);
        console.log(`User already exists: ${existingUser.username}`);
      }
    }

    console.log('Seeding calculations...');

    // Create sample calculations
    const alice = createdUsers.find(u => u.username === 'alice')!;
    const bob = createdUsers.find(u => u.username === 'bob')!;
    const charlie = createdUsers.find(u => u.username === 'charlie')!;

    // Alice starts with 10
    const startingCalc = await CalculationModel.create({
      user_id: alice.id,
      parent_id: null,
      operation: null,
      number: 10,
      result: 10
    });
    console.log(`Created starting calculation: ${alice.username} starts with 10`);

    // Bob adds 5 to Alice's 10
    const addResult = performOperation(10, '+', 5);
    const addCalc = await CalculationModel.create({
      user_id: bob.id,
      parent_id: startingCalc.id,
      operation: '+',
      number: 5,
      result: addResult.result
    });
    console.log(`Created operation: ${bob.username} adds 5 to 10 = ${addResult.result}`);

    // Charlie multiplies Alice's 10 by 3
    const multResult = performOperation(10, '*', 3);
    const multCalc = await CalculationModel.create({
      user_id: charlie.id,
      parent_id: startingCalc.id,
      operation: '*',
      number: 3,
      result: multResult.result
    });
    console.log(`Created operation: ${charlie.username} multiplies 10 by 3 = ${multResult.result}`);

    // Alice adds 2 to Bob's result (15)
    const add2Result = performOperation(15, '+', 2);
    await CalculationModel.create({
      user_id: alice.id,
      parent_id: addCalc.id,
      operation: '+',
      number: 2,
      result: add2Result.result
    });
    console.log(`Created operation: ${alice.username} adds 2 to 15 = ${add2Result.result}`);

    // Bob starts another calculation with 100
    const startingCalc2 = await CalculationModel.create({
      user_id: bob.id,
      parent_id: null,
      operation: null,
      number: 100,
      result: 100
    });
    console.log(`Created starting calculation: ${bob.username} starts with 100`);

    // Charlie divides Bob's 100 by 4
    const divResult = performOperation(100, '/', 4);
    await CalculationModel.create({
      user_id: charlie.id,
      parent_id: startingCalc2.id,
      operation: '/',
      number: 4,
      result: divResult.result
    });
    console.log(`Created operation: ${charlie.username} divides 100 by 4 = ${divResult.result}`);

    console.log('Database seeded successfully!');
    console.log('\nSample users created:');
    console.log('- alice (password: password123)');
    console.log('- bob (password: password123)');
    console.log('- charlie (password: password123)');
    console.log('\nYou can now login with any of these accounts to test the application.');

  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

export default seedDatabase;
