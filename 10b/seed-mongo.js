const mongoose = require('mongoose');
const User = require('./models/User');
const config = require('./config');

async function seedMongoDB() {
  try {
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');
    
    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');
    
    // Sample user data
    const users = [
      {
        username: 'john_doe',
        email: 'john@example.com',
        firstName: 'John',
        lastName: 'Doe',
        age: 28
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        age: 32
      },
      {
        username: 'bob_jackson',
        email: 'bob@example.com',
        firstName: 'Bob',
        lastName: 'Jackson',
        age: 45
      },
      {
        username: 'alice_wonder',
        email: 'alice@example.com',
        firstName: 'Alice',
        lastName: 'Wonder',
        age: 24
      },
      {
        username: 'mike_tyson',
        email: 'mike@example.com',
        firstName: 'Mike',
        lastName: 'Tyson',
        age: 56
      }
    ];
    
    // Insert users
    const result = await User.insertMany(users);
    console.log(`${result.length} users inserted into MongoDB`);
    
    // Disconnect
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error seeding MongoDB:', error);
    process.exit(1);
  }
}

// Run the seeder
seedMongoDB(); 