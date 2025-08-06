import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true
      }
    },
    user_pwd: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
          notEmpty: true
      }
    } 
  },{
      tableName: 'users',
      timestamps: true,
  });

export default User;

