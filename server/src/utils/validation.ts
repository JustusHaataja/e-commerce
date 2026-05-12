import { z } from "zod";

// Auth schemas
export const RegisterSchema = z.object({
  email: z.string().email("Invalid email format"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = RegisterSchema;

export const LoginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const loginSchema = LoginSchema;

// Products schemas
export const GetProductsSchema = z.object({
  query: z
    .object({
      skip: z.coerce.number().int().min(0).default(0),
      limit: z.coerce.number().int().min(1).max(100).default(20),
      category_id: z.coerce.number().int().optional(),
      search: z.string().optional(),
      min_price: z.coerce.number().nonnegative().optional(),
      max_price: z.coerce.number().nonnegative().optional(),
    })
    .strict(),
});

export const GetProductByIdSchema = z.object({
  params: z.object({
    id: z.coerce.number().int().positive(),
  }),
});

// Cart schemas
export const AddToCartSchema = z.object({
  product_id: z.number().int().positive(),
  quantity: z.number().int().min(1).default(1),
});

export const UpdateCartSchema = z.object({
  quantity: z.number().int().min(0, "Quantity must be 0 or greater"),
});

export const RemoveFromCartSchema = z.object({
  params: z.object({
    product_id: z.coerce.number().int().positive(),
  }),
});

// Export types
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type GetProductsInput = z.infer<typeof GetProductsSchema>;
export type AddToCartInput = z.infer<typeof AddToCartSchema>;
export type UpdateCartInput = z.infer<typeof UpdateCartSchema>;