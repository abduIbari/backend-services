import { DataTypes } from 'sequelize';
import sequelize from '../sequelize.js';

const Todo = sequelize.define(
  'Todo',
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
    content: {
        type: DataTypes.STRING,
    },
    user_uuid: {
        type: DataTypes.UUID,
        allowNull: false
    } 
  },{
      tableName: 'todos',
      timestamps: true,
  });

export default Todo;

