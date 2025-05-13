# Database Migration Tool

This project demonstrates how to migrate data from MongoDB (NoSQL) to PostgreSQL (SQL). This shows a practical example of migrating between different database paradigms.

## Features

- Connects to a MongoDB database and retrieves user data
- Sets up a PostgreSQL database schema with matching structure
- Migrates user records from MongoDB to PostgreSQL
- Handles potential errors during migration
- Includes data verification steps
- Includes sample data seeding script

## Prerequisites

- Node.js (v14 or later)
- MongoDB (running locally or accessible instance)
- PostgreSQL (running locally or accessible instance)
- OR Docker and Docker Compose (recommended)

## Setup with Docker (Recommended)

1. Make sure Docker and Docker Compose are installed
2. Start the MongoDB and PostgreSQL containers:
   ```
   docker-compose up -d
   ```
3. Install Node.js dependencies:
   ```
   npm install
   ```

## Setup without Docker

1. Install MongoDB and PostgreSQL on your system
2. Start MongoDB service
3. Start PostgreSQL service
4. Create databases:
   - MongoDB: `source_db`
   - PostgreSQL: `target_db`
5. Install dependencies:
   ```
   npm install
   ```

## Database Setup

Before running the migration, you need to set up both databases:

1. Set up the MongoDB database and seed it with data:
   ```
   node seed-mongo.js
   ```

2. Set up the PostgreSQL schema:
   ```
   node setup-postgres.js
   ```

## Running the Migration

Execute the migration script:
```
npm run migrate
```
Or directly:
```
node migrate.js
```

## How it Works

The migration process follows these steps:

1. Connects to the source MongoDB database
2. Connects to the target PostgreSQL database
3. Retrieves all user documents from MongoDB
4. Maps the document fields to the appropriate SQL table structure
5. Inserts each record into PostgreSQL
6. Handles conflicts using ON CONFLICT rules
7. Verifies the completion by counting records

## Structure

- `config.js` - Database connection configuration
- `models/User.js` - MongoDB user model schema
- `seed-mongo.js` - Script to seed MongoDB with sample data
- `setup-postgres.js` - Script to set up PostgreSQL schema
- `migrate.js` - Main migration script
- `docker-compose.yml` - Docker configuration for running MongoDB and PostgreSQL

## Extending the Tool

This tool can be extended to:

1. Support additional data models beyond users
2. Include data transformation during migration
3. Support reverse migration (PostgreSQL to MongoDB)
4. Add batch processing for larger datasets
5. Implement progress tracking for long-running migrations

## Error Handling

The migration script includes error handling to:
- Catch and log connection issues
- Handle individual record migration failures
- Ensure proper database disconnection even if errors occur

## License

MIT
