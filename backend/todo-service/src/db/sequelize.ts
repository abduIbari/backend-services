import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('tododb', 'abdul', 'password', {
  host: 'tododb', 
  port: 5432,
  dialect: 'postgres',
  logging: false, 
});

export default sequelize;
