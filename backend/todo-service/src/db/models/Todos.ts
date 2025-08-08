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
  tableName: "todos",
  timestamps: true,
})
export default class Todo extends Model<
  InferAttributes<Todo>,
  InferCreationAttributes<Todo>
> {
  // @AutoIncrement
  // @AllowNull(false)
  // @Column({
  //   type: DataType.INTEGER,
  // })
  // declare id: CreationOptional<number>;

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
  declare content: string;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  declare completed: CreationOptional<boolean>;

  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    validate: {
      notEmpty: true,
    },
  })
  declare user_uuid: string;

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
