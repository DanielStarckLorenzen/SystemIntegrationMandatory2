const mongoose = require('mongoose');
const { Client } = require('pg');
const config = require('./config');
const User = require('./models/User');

async function migrateData() {
  let mongoClient, pgClient;
  
  try {
    console.log('Starting migration from MongoDB to PostgreSQL...');
    
    // Connect to MongoDB
    await mongoose.connect(config.mongoUri);
    console.log('Connected to MongoDB');
    
    // Connect to PostgreSQL
    pgClient = new Client({
      host: config.postgres.host,
      port: config.postgres.port,
      database: config.postgres.database,
      user: config.postgres.user,
      password: config.postgres.password
    });
    await pgClient.connect();
    console.log('Connected to PostgreSQL');
    
    // Get all users from MongoDB
    const users = await User.find({});
    console.log(`Found ${users.length} users in MongoDB`);
    
    // Insert each user into PostgreSQL
    let migrationCount = 0;
    
    for (const user of users) {
      try {
        const result = await pgClient.query(
          `INSERT INTO users (username, email, first_name, last_name, age, created_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (username) DO UPDATE 
           SET email=$2, first_name=$3, last_name=$4, age=$5, created_at=$6
           RETURNING id`,
          [
            user.username,
            user.email,
            user.firstName,
            user.lastName,
            user.age,
            user.createdAt
          ]
        );
        
        migrationCount++;
        console.log(`Migrated user: ${user.username}`);
      } catch (err) {
        console.error(`Error migrating user ${user.username}:`, err.message);
      }
    }
    
    console.log(`Migration completed: ${migrationCount} of ${users.length} users migrated successfully`);
    
    // Verify data in PostgreSQL
    const { rows } = await pgClient.query('SELECT COUNT(*) FROM users');
    console.log(`PostgreSQL users table now has ${rows[0].count} records`);
    
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    // Clean up connections
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('Disconnected from MongoDB');
    }
    
    if (pgClient) {
      await pgClient.end();
      console.log('Disconnected from PostgreSQL');
    }
  }
}

// Run the migration
migrateData(); 