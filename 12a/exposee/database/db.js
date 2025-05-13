const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a database connection
const dbPath = path.join(__dirname, 'webhooks.db');
const db = new sqlite3.Database(dbPath);

// Initialize database with webhooks table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS webhooks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      event_type TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(url, event_type)
    )
  `);
});

// Database methods
const dbMethods = {
  // Register a new webhook
  registerWebhook: (url, eventType) => {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO webhooks (url, event_type) VALUES (?, ?)',
        [url, eventType],
        function(err) {
          if (err) {
            return reject(err);
          }
          resolve({ 
            id: this.lastID, 
            url, 
            eventType, 
            success: this.changes > 0 
          });
        }
      );
    });
  },

  // Unregister a webhook
  unregisterWebhook: (url, eventType) => {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM webhooks WHERE url = ? AND event_type = ?',
        [url, eventType],
        function(err) {
          if (err) {
            return reject(err);
          }
          resolve({ 
            success: this.changes > 0
          });
        }
      );
    });
  },

  // Get all webhooks for a specific event type
  getWebhooksByEvent: (eventType) => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM webhooks WHERE event_type = ?',
        [eventType],
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        }
      );
    });
  },

  // Get all webhooks
  getAllWebhooks: () => {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM webhooks',
        (err, rows) => {
          if (err) {
            return reject(err);
          }
          resolve(rows);
        }
      );
    });
  }
};

module.exports = dbMethods; 