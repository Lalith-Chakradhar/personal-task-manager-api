import Sequelize from "sequelize";
import config from "../config/config.js";
import UserModel from "./user.model.js";
import TaskModel from "./task.model.js";

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

const Users = UserModel(sequelize, Sequelize.DataTypes);
const Tasks = TaskModel(sequelize, Sequelize.DataTypes);

Users.hasMany(Tasks, { foreignKey: "userId" });
Tasks.belongsTo(Users, { foreignKey: "userId" });

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
