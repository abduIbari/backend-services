import { Sequelize } from "sequelize-typescript";
import Todo from "./models/Todos.js";

// const sequelize = new Sequelize('tododb', 'abdul', 'password', {
//   host: 'tododb',
//   port: 5432,
//   dialect: 'postgres',
//   logging: false,
// });

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
  models: [Todo],
});

export default sequelize;
