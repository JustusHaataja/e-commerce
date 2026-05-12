import { DataTypes, Model, ForeignKey } from "sequelize";
import { sequelize } from "../config/database.js";

export class Product extends Model {
  declare id: number;
  declare name: string;
  declare description: string;
  declare price: number;
  declare sale_price: number | null;
  declare nutrition: string | null;
  declare category_id: ForeignKey<number>;
  declare created_at: Date;
  declare updated_at: Date;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    sale_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    nutrition: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
    modelName: "Product",
    tableName: "products",
    timestamps: false,
  }
);
