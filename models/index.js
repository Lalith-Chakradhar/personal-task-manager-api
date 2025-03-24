import Sequelize from "sequelize";
import config from "../config/config.js";
import UserModel from "./user.model.js";
import TaskModel from "./task.model.js";

//Create a sequelize connection to the database using the database details
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.dbPort,
  },
);

//Define Users and Tasks ORMs
const Users = UserModel(sequelize, Sequelize.DataTypes);
const Tasks = TaskModel(sequelize, Sequelize.DataTypes);

//Create relations between the ORMs
Users.hasMany(Tasks, { foreignKey: "userId" });
Tasks.belongsTo(Users, { foreignKey: "userId" });

//Connect to the actual database and sync with it such that all tables are in sync 
//with the original database
const connect = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    await sequelize.sync();
    console.log("Database tables created/updated.");
  } catch (error) {
    console.error("Failed to connect with the database:", error.message);
  }
};

connect();

const db = {
  sequelize,
  Users,
  Tasks,
};

export default db;
