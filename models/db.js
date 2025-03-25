import config from "../config/config";
import pgPromise from "pg-promise";

const pgp = pgPromise(); 

const db = pgp({
  host: config.host,
  port: config.dbPort,
  database: config.database,
  user: config.username,
  password: config.password,
});

export default db;
