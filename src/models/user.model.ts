import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../configs/database.config';

interface UserAttributes {
  id: number;
  full_name: string;
  email: string;
  password_hash: string;
  role: 'standard' | 'admin';
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public full_name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: 'standard' | 'admin';
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('standard', 'admin'),
      allowNull: false,
      defaultValue: 'standard',
    },
  },
  {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: false,
  }
);

export default User;