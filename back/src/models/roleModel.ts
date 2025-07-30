import { DataTypes, Model } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import sequelize from '../config/db';

class Role extends Model {
  public id!: string;
  public name!: string;
  public description!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
  }
);

export default Role; 