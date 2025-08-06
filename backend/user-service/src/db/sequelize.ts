import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('userdb', 'abdul', 'password', {
  host: 'userdb', 
  port: 5432,
  dialect: 'postgres',
  logging: false, 
});

export default sequelize;
