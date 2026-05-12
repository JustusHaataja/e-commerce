import { DataTypes, Model, ForeignKey } from "sequelize";
import { sequelize } from "../config/database.js";

export class ProductImage extends Model {
  declare id: number;
  declare product_id: ForeignKey<number>;
  declare image_url: string;
  declare created_at: Date;
  declare updated_at: Date;
}

ProductImage.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: "CASCADE",
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: "ProductImage",
    tableName: "product_images",
    timestamps: false,
  }
);
