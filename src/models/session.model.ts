import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../configs/database.config';
import User from './user.model';

interface SessionAttributes {
  id: number;
  user_id: number;
  start_time: Date;
  last_activity_time: Date;
}

interface SessionCreationAttributes extends Optional<SessionAttributes, 'id'> { }

class Session extends Model<SessionAttributes, SessionCreationAttributes> implements SessionAttributes {
  public id!: number;
  public user_id!: number;
  public start_time!: Date;
  public last_activity_time!: Date;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    start_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    last_activity_time: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'sessions',
    modelName: 'Session',
    timestamps: false,
  }
);

// Relaciones
Session.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Session, { foreignKey: 'user_id' });

export default Session;