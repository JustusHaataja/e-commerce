import { Router } from "express";
import { sequelize, Op } from "../config/database.js";
import { Product, Category, ProductImage } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/response.js";

const router = Router();

// GET /products
router.get("/", async (req, res, next) => {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = parseInt(req.query.limit as string) || 20;
    const categoryId = req.query.category_id
      ? parseInt(req.query.category_id as string)
      : undefined;
    const search = req.query.search as string;
    const minPrice = req.query.min_price
      ? parseFloat(req.query.min_price as string)
      : undefined;
    const maxPrice = req.query.max_price
      ? parseFloat(req.query.max_price as string)
      : undefined;

    // Build where clause
    const where: any = {};

    if (categoryId) {
      where.category_id = categoryId;
    }

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      // Use COALESCE equivalent: sale_price if not null, else price
      const priceField = sequelize.where(
        sequelize.fn("COALESCE", sequelize.col("sale_price"), sequelize.col("price")),
        Op.between,
        [minPrice || 0, maxPrice || 999999]
      );
      where[Op.and] = [priceField];
    }

    const products = await Product.findAndCountAll({
      where,
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
      offset: skip,
      limit,
      order: [["id", "ASC"]],
    });

    return sendSuccess(res, products.rows);

  } catch (error) {
    next(error);
  }
});

// GET /products/categories
router.get("/categories", async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      order: [["name", "ASC"]],
    });

    return sendSuccess(res, categories);
  } catch (error) {
    next(error);
  }
});

// GET /products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const productId = parseInt(req.params.id);

    const product = await Product.findByPk(productId, {
      include: [
        {
          model: ProductImage,
          as: "images",
          attributes: ["id", "image_url"],
        },
        {
          model: Category,
          as: "category",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    return sendSuccess(res, product);
  } catch (error) {
    next(error);
  }
});

export default router