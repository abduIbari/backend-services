import { Sequelize } from "sequelize-typescript";
import User from "./models/Users.js";

// const sequelize = new Sequelize("userdb", "abdul", "password", {
//   host: "userdb",
//   port: 5432,
//   dialect: "postgres",
//   logging: false,
// });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:", // in-memory DB
  logging: false,
  models: [User],
});

export default sequelize;
