import config from "../config/config.js";
import pgPromise from "pg-promise";

const pgp = pgPromise(); 

const db = pgp({
  host: config.host,
  port: config.dbPort,
  database: config.database,
  user: config.username,
  password: config.password,
});

// Create table if they don't exist
const createTablesSQL = `
  -- Create 'users' 
  
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Create 'tasks' table

  CREATE TABLE IF NOT EXISTS tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(10) NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
    dueDate DATE NOT NULL,
    status VARCHAR(10) NOT NULL,
    userId INTEGER NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
  );
`;

const createTablesIfNotExist = async () => {
  try {
    
    await db.none(createTablesSQL);
    console.log('Database tables have been created or already exist.');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
};

// Run the table creation function when the db is connected
db.connect()
  .then(() => {
    console.log('Connected to the database!');
    createTablesIfNotExist(); // Create tables if they don't exist
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit if there's a DB connection error
  });

export default db;

