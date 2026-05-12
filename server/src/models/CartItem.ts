import { DataTypes, Model, ForeignKey } from "sequelize";
import { sequelize } from "../config/database.js";

export class CartItem extends Model {
  declare id: number;
  declare user_id: ForeignKey<number> | null;
  declare guest_id: string | null;
  declare product_id: ForeignKey<number>;
  declare quantity: number;
  declare created_at: Date;
  declare updated_at: Date;
}

CartItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      onDelete: "CASCADE",
    },
    guest_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
      },
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
    modelName: "CartItem",
    tableName: "cart_items",
    timestamps: false,
  }
);
