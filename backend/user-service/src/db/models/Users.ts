import type {
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  AutoIncrement,
} from "sequelize-typescript";

@Table({
  tableName: "users",
  timestamps: true,
})
export default class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
  })
  declare id: CreationOptional<number>;

  @PrimaryKey
  @Default(DataType.UUIDV4)
  @AllowNull(false)
  @Column(DataType.UUID)
  declare uuid: CreationOptional<string>;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      notEmpty: true,
    },
  })
  declare user_email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING,
    validate: {
      notEmpty: true,
    },
  })
  declare user_pwd: string;

  @CreatedAt
  @Column({ type: DataType.DATE, field: "created_at" })
  declare createdAt: CreationOptional<Date>;

  @UpdatedAt
  @Column({
    type: DataType.DATE,
    field: "updated_at",
  })
  declare updatedAt: CreationOptional<Date>;
}
