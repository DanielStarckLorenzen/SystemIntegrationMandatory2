const { Client } = require('pg');
const config = require('./config');

async function setupPostgres() {
  const client = new Client({
    host: config.postgres.host,
    port: config.postgres.port,
    database: config.postgres.database,
    user: config.postgres.user,
    password: config.postgres.password
  });

  try {
    // Connect to PostgreSQL
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    // Drop existing users table if it exists
    await client.query(`
      DROP TABLE IF EXISTS users CASCADE;
    `);
    console.log('Dropped existing users table');
    
    // Create users table
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        first_name VARCHAR(50),
        last_name VARCHAR(50),
        age INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Created users table in PostgreSQL');
    
    // Disconnect
    await client.end();
    console.log('Disconnected from PostgreSQL');
    
  } catch (error) {
    console.error('Error setting up PostgreSQL:', error);
    if (client) {
      await client.end();
    }
    process.exit(1);
  }
}

// Run the setup
setupPostgres(); 