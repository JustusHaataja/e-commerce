import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database.js";

export class Category extends Model {
  declare id: number;
  declare name: string;
  declare created_at: Date;
  declare updated_at: Date;
}

Category.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Category",
    tableName: "categories",
    timestamps: false,
  }
);
