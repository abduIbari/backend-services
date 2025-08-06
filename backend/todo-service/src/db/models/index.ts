import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import type { Dialect } from 'sequelize';
import { basename as _basename } from 'path';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

const basename = _basename(__filename);
const env = process.env.NODE_ENV || 'development';
const db: { [key: string]: any } = {};

// Load config manually if you're using config/config.json
const config = require(__dirname + '/../config/config.json')[env];

// Or better, use env variables directly
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as Dialect,
    logging: false,
  }
);

// Dynamically import all model files in this folder
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      (file.slice(-3) === '.ts' || file.slice(-3) === '.js') &&
      !file.includes('.test.')
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    const definedModel = model(sequelize, DataTypes);
    db[definedModel.name] = definedModel;
  });

// Apply associations if they exist
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
