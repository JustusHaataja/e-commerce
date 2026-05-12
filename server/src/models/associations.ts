import { Product } from "./Product.js";
import { ProductImage } from "./ProductImage.js";
import { Category } from "./Category.js";
import { User } from "./User.js";
import { CartItem } from "./CartItem.js";

export function setupAssociations() {
  // Product associations
  Product.belongsTo(Category, {
    foreignKey: "category_id",
    as: "category",
  });

  Category.hasMany(Product, {
    foreignKey: "category_id",
    as: "products",
  });

  // ProductImage associations
  Product.hasMany(ProductImage, {
    foreignKey: "product_id",
    as: "images",
  });

  ProductImage.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });

  // CartItem associations
  CartItem.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
  });

  User.hasMany(CartItem, {
    foreignKey: "user_id",
    as: "cart_items",
  });

  CartItem.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
  });

  Product.hasMany(CartItem, {
    foreignKey: "product_id",
    as: "cart_items",
  });
}
