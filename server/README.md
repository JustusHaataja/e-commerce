# E-commerce Backend - Node.js/Express

Node.js/Express backend for the e-commerce application, replacing the previous Python/FastAPI implementation.

## Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database (Supabase configured)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment Variables
Copy `.env.example` to `.env` and update values:
```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE_MINUTES` - Token expiration time
- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS

### Development

Start the development server with hot reload:
```bash
npm run dev
```

The server will run on `http://localhost:3000`

### Production

Build the TypeScript:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (requires auth)

### Products
- `GET /api/products` - List products with filters
- `GET /api/products/categories` - List categories
- `GET /api/products/:id` - Get product details

### Cart
- `GET /api/cart` - View cart
- `POST /api/cart/add` - Add item to cart
- `DELETE /api/cart/:product_id` - Remove item from cart
- `PUT /api/cart/:product_id` - Update cart item quantity

### Health
- `GET /` - Health check
- `GET /health` - Health status

## API Response Format

All API endpoints return responses in a standardized format:

```json
{
  "success": true,
  "data": {
    "items": [],
    "total": 0
  },
  "error": null
}
```

On error:
```json
{
  "success": false,
  "data": null,
  "error": "Error message description"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `304` - Not Modified
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden (ownership validation failed)
- `404` - Not Found
- `500` - Server Error

## API Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

Response:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-05-12T10:00:00Z",
    "updated_at": "2026-05-12T10:00:00Z"
  }
}
```

### Login User
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword"
  }' \
  -c cookies.txt
```

Sets `auth_token` cookie (HttpOnly in production).

### Get Products
```bash
curl http://localhost:3000/api/products?skip=0&limit=10&category_id=1&search=coffee&min_price=5&max_price=50
```

Query Parameters:
- `skip` - Number of items to skip (pagination)
- `limit` - Number of items to return
- `category_id` - Filter by category ID
- `search` - Search in product name/description
- `min_price` - Minimum price filter
- `max_price` - Maximum price filter

### Get Cart
```bash
curl http://localhost:3000/api/cart \
  -b cookies.txt
```

Response format:
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "product_id": 150,
        "quantity": 2,
        "product": {
          "id": 150,
          "name": "Organic Coffee",
          "price": 19.99,
          "sale_price": 14.99
        }
      }
    ],
    "total": 29.98
  }
}
```

### Add to Cart
```bash
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "product_id": 150,
    "quantity": 2
  }'
```

### Update Cart Item
```bash
curl -X PUT http://localhost:3000/api/cart/150 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{ "quantity": 3 }'
```

### Remove from Cart
```bash
curl -X DELETE http://localhost:3000/api/cart/150 \
  -b cookies.txt
```

## Frontend Integration

### Response Format Handling

The frontend needs to handle the standardized response format. All API responses wrap data in a `success`, `data`, and `error` properties:

```typescript
// Backend response structure
interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
```

When using axios in the frontend, extract the `data` property:

```typescript
// Example: Fetching products
const response = await axios.get<ApiResponse<Product[]>>('/api/products');
const products = response.data.data; // Extract data from response

// Example: Getting user info
const response = await axios.get<ApiResponse<User>>('/api/auth/me');
const user = response.data.data; // Extract user data
```

### Cart Response Structure

Cart endpoints return a special structure with calculated totals:

```typescript
interface CartResponse {
  items: CartItem[];
  total: number;
}

// Usage in frontend
const response = await axios.get<ApiResponse<CartResponse>>('/api/cart');
const { items, total } = response.data.data;
```

### Authentication Flow

1. **Register/Login**: Server sets `auth_token` HttpOnly cookie
2. **Axios Cookies**: Configure axios to include cookies:
   ```typescript
   const apiClient = axios.create({
     baseURL: '/api',
     withCredentials: true // Include cookies
   });
   ```
3. **Protected Routes**: Automatically included via cookie; no manual header needed
4. **Logout**: Server clears the cookie

### Frontend apiClient.ts Implementation

```typescript
import axios from 'axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Send cookies with requests
});

export const getJSON = async <T>(url: string, params?: any): Promise<T> => {
  const response = await apiClient.get<ApiResponse<T>>(url, { params });
  return response.data.data; // Extract data from wrapper
};

export const postJSON = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.post<ApiResponse<T>>(url, data);
  return response.data.data;
};

export const putJSON = async <T>(url: string, data?: any): Promise<T> => {
  const response = await apiClient.put<ApiResponse<T>>(url, data);
  return response.data.data;
};

export const deleteJSON = async <T>(url: string): Promise<T> => {
  const response = await apiClient.delete<ApiResponse<T>>(url);
  return response.data.data;
};
```

### Frontend Cart.ts Implementation

```typescript
import { getJSON, postJSON, putJSON, deleteJSON } from './apiClient';

interface CartResponse {
  items: CartItem[];
  total: number;
}

export const fetchCart = async (): Promise<CartItem[]> => {
  const response = await getJSON<CartResponse>('/cart');
  return response.items; // Extract items array
};

export const addToCart = async (productId: number, quantity: number): Promise<CartItem[]> => {
  const response = await postJSON<CartResponse>('/cart/add', {
    product_id: productId,
    quantity
  });
  return response.items;
};

export const updateCartItem = async (productId: number, quantity: number): Promise<CartItem[]> => {
  const response = await putJSON<CartResponse>(`/cart/${productId}`, {
    quantity
  });
  return response.items;
};

export const removeFromCart = async (productId: number): Promise<CartItem[]> => {
  const response = await deleteJSON<CartResponse>(`/cart/${productId}`);
  return response.items;
};
```

## Troubleshooting

### Database Foreign Key Constraint Error

**Error**: `Key (product_id)=(119) is not present in table "products_og"`

**Cause**: The database has an old `products_og` table, and cart_items foreign key points there instead of the current `products` table.

**Solution**: Run this SQL in Supabase SQL Editor:

```sql
-- Drop the incorrect constraint
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_product_id_fkey";

-- Create the correct constraint pointing to products table
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_fkey" 
  FOREIGN KEY ("product_id") REFERENCES "products" ("id") 
  ON DELETE CASCADE ON UPDATE CASCADE;
```

After running this, cart operations will work correctly.

### TypeScript Type Errors in Frontend

**Error**: `Property 'data' does not exist on type 'User'`

**Cause**: Response includes wrapper object with `success`, `data`, `error` properties.

**Solution**: Use generic typing for API responses:

```typescript
// Before (incorrect)
const response = await apiClient.get<User>('/auth/me');
const user = response.data; // Wrong - this is the wrapper

// After (correct)
const response = await apiClient.get<{ success: boolean; data: User }>('/auth/me');
const user = response.data.data; // Correct - extract from wrapper
```

Or use the helper functions in apiClient.ts which handle extraction automatically.

### Server Not Accepting Requests

**Check**:
1. Is the server running? `npm run dev` in `/server` folder
2. Does FRONTEND_URL in `.env` match your frontend URL?
3. Are cookies being sent? Add `withCredentials: true` to axios

**Debug**:
```bash
curl http://localhost:3000/health  # Should return 200
curl http://localhost:3000/api/products?limit=1  # Should return products
```

### Cart Operations Return 403 Forbidden

**Cause**: Cart item ownership validation failed. User/guest trying to modify cart they don't own.

**Solution**:
1. Ensure `auth_token` cookie is being sent (check Network tab in DevTools)
2. For guest users, ensure guest_id cookie is maintained
3. Verify product_id in URL matches the cart item

## Architecture

### Project Structure
```
src/
├── config/          # Configuration (database, env)
├── models/          # Sequelize ORM models
├── middleware/      # Express middleware (auth, error handling)
├── routes/          # API route handlers
├── utils/           # Utilities (auth, validation, response)
├── app.ts           # Express app setup
└── index.ts         # Server entry point
```

### Database Models
- **User** - User accounts with bcrypt password hashing
- **Category** - Product categories
- **Product** - Product listings with pricing and nutrition info
- **ProductImage** - Product images
- **CartItem** - Shopping cart items (supports both user and guest carts)

### Key Features
- **JWT Authentication** - HttpOnly cookies with environment-based security
- **Guest Cart Support** - Unauthenticated users can add items, merged on login
- **Product Filtering** - By category, search term, and price range
- **Ownership Validation** - Cart operations restricted to cart owner
- **Error Handling** - Centralized error middleware with proper HTTP status codes
- **Request Validation** - Zod schemas for all endpoints

## Migration Notes

This backend replaces the FastAPI implementation while maintaining the same API interface. Key differences:
- **Framework**: Express instead of FastAPI
- **Language**: TypeScript instead of Python
- **ORM**: Sequelize instead of SQLAlchemy
- **Database**: PostgreSQL (same as before)

All endpoints return responses in the format:
```json
{
  "success": true/false,
  "data": {...},
  "error": "error message if applicable"
}
```

## Known Issues

### ⚠️ Database Schema Issue (Requires Manual Fix)

**Issue**: Foreign key constraint points to `products_og` table instead of `products`

**Impact**: Cart operations fail with: `Key (product_id) is not present in table "products_og"`

**Status**: ✅ Documented, manual SQL fix available

**Fix**: See [Database Foreign Key Constraint Error](#database-foreign-key-constraint-error) in Troubleshooting section.

### ⚠️ Frontend Response Handling

**Issue**: Frontend apiClient needs to extract `response.data.data` for all endpoints

**Impact**: Frontend receives full response wrapper instead of data, causing type errors

**Status**: ✅ Documented, implementation guide provided

**Fix**: See [Frontend Integration](#frontend-integration) section for implementation patterns.

### ✅ Testing Integration

The backend has been tested with:
- ✅ Direct curl requests to all endpoints
- ✅ Health check endpoints
- ✅ Authentication flow (register → login → logout)
- ✅ Product listing with filters
- ✅ Cart operations (guest and authenticated)
- ✅ Request logging and error handling

**Frontend Testing**: Frontend still needs integration testing. Use the patterns in the Frontend Integration section.

## Testing the Backend

### Quick Health Check
```bash
curl http://localhost:3000/health
```

### Test Authentication
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}' \
  -c cookies.txt

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Check current user
curl http://localhost:3000/api/auth/me -b cookies.txt
```

### Test Products
```bash
# List all products
curl "http://localhost:3000/api/products?limit=5"

# List categories
curl http://localhost:3000/api/products/categories

# Get product details
curl http://localhost:3000/api/products/1
```

### Test Cart (Guest)
```bash
# Get cart (creates guest session)
curl http://localhost:3000/api/cart -c cookies.txt

# Add item
curl -X POST http://localhost:3000/api/cart/add \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"product_id":1,"quantity":2}'

# View cart
curl http://localhost:3000/api/cart -b cookies.txt
```

## Development Tips

### Enable Verbose Logging
Edit `src/config/database.ts` and change:
```typescript
logging: false  // Set to console.log for verbose SQL logging
```

### Database Synchronization
The server automatically syncs models with database on startup. For development, `alter: true` mode makes non-destructive schema changes.

### JWT Token Details
- **Expiration**: Set by `JWT_EXPIRE_MINUTES` env variable (default: 1440 minutes / 24 hours)
- **Storage**: HttpOnly cookie named `auth_token`
- **Security**: Secure flag enabled in production, disabled in development

### Password Hashing
Passwords are hashed with bcryptjs before storage. Plain passwords are never stored.

## Contributing

When modifying API endpoints:
1. Update validation schemas in `src/utils/validation.ts`
2. Ensure response follows `{ success, data, error }` format
3. Add request logging automatically via middleware
4. Use error handler middleware for consistent error responses
5. Keep JWT token handling in `src/utils/auth.ts`
