import "dotenv/config.js";

//access the env variables here and export it.
const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  dialect: "mysql",
  dbPort: process.env.DB_PORT,
  port: process.env.PORT || 8080,
  jwtSecret: process.env.JWT_SECRET,
};

export default config;
