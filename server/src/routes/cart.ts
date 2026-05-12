import { Router } from "express";
import { CartItem, Product } from "../models/index.js";
import { sendSuccess, sendError } from "../utils/response.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Use auth middleware for all cart routes
router.use(authMiddleware);

// GET /cart
router.get("/", async (req: AuthRequest, res, next) => {
  try {
    const userId = req.userId;
    const guestId = req.guestId;

    const cartItems = await CartItem.findAll({
      where: userId ? { user_id: userId } : { guest_id: guestId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "price", "sale_price"],
        },
      ],
    });

    const total = cartItems.reduce((sum, item: any) => {
      const effectivePrice =
        item.product?.sale_price || item.product?.price || 0;
      return sum + effectivePrice * item.quantity;
    }, 0);

    return sendSuccess(res, {
      items: cartItems,
      total,
    });
  } catch (error) {
    next(error);
  }
});

// POST /cart/add
router.post("/add", async (req: AuthRequest, res, next) => {
  try {
    const { product_id, quantity } = req.body;
    const userId = req.userId;
    const guestId = req.guestId;

    // Validate input
    if (!product_id || quantity < 1) {
      return sendError(res, "Invalid product_id or quantity", 400);
    }

    // Check if product exists
    const product = await Product.findByPk(product_id);
    if (!product) {
      return sendError(res, "Product not found", 404);
    }

    // Check if item already in cart
    const existingItem = await CartItem.findOne({
      where: userId
        ? { user_id: userId, product_id }
        : { guest_id: guestId, product_id },
    });

    if (existingItem) {
      existingItem.quantity += quantity;
      await existingItem.save();
    } else {
      await CartItem.create({
        user_id: userId || null,
        guest_id: guestId || null,
        product_id,
        quantity,
      });
    }

    return sendSuccess(res, { message: "Item added to cart" }, 201);
  } catch (error) {
    next(error);
  }
});

// DELETE /cart/:product_id
router.delete("/:product_id", async (req: AuthRequest, res, next) => {
  try {
    const productId = parseInt(req.params.product_id);
    const userId = req.userId;
    const guestId = req.guestId;

    // Find cart item with ownership check
    const cartItem = await CartItem.findOne({
      where: userId
        ? { user_id: userId, product_id: productId }
        : { guest_id: guestId, product_id: productId },
    });

    if (!cartItem) {
      return sendError(res, "Cart item not found", 404);
    }

    await cartItem.destroy();
    return sendSuccess(res, { message: "Item removed from cart" });
  } catch (error) {
    next(error);
  }
});

// PUT /cart/:product_id
router.put("/:product_id", async (req: AuthRequest, res, next) => {
  try {
    const productId = parseInt(req.params.product_id);
    const { quantity } = req.body;
    const userId = req.userId;
    const guestId = req.guestId;

    // Validate input
    if (quantity === undefined || quantity < 0) {
      return sendError(res, "Invalid quantity", 400);
    }

    // Find cart item with ownership check
    const cartItem = await CartItem.findOne({
      where: userId
        ? { user_id: userId, product_id: productId }
        : { guest_id: guestId, product_id: productId },
    });

    if (!cartItem) {
      return sendError(res, "Cart item not found", 404);
    }

    // Delete if quantity is 0 or less
    if (quantity <= 0) {
      await cartItem.destroy();
      return sendSuccess(res, { message: "Item removed from cart" });
    }

    // Update quantity
    cartItem.quantity = quantity;
    await cartItem.save();

    return sendSuccess(res, { message: "Item updated" });
  } catch (error) {
    next(error);
  }
});

export default router