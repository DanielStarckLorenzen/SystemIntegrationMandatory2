module.exports = {
  // MongoDB connection string
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27020/source_db',
  
  // PostgreSQL connection details
  postgres: {
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5440,
    database: process.env.PG_DATABASE || 'target_db',
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'password'
  }
}; 