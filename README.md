# E-commerce Platform

A full-stack e-commerce application featuring a modern **React + TypeScript** frontend and **Node.js/Express** backend, designed to deliver a seamless online shopping experience with robust authentication, real-time cart management, and responsive design.

🔗 **[Live Demo](https://puhdistamo.netlify.app/)**

> **⚠️ IMPORTANT DISCLAIMER**: This is a **demonstration project** for educational and portfolio purposes only. **No actual payment processing or transactions are implemented**. This application is not intended for commercial use and does not handle real purchases, payments, or order fulfillment.

---

## 🌟 Overview

This project demonstrates a production-ready e-commerce platform built with modern web technologies. It showcases best practices in full-stack development, including secure authentication, optimized database operations, and a polished user interface.

### Key Features

- **Dynamic Product Catalog**: Browse products with advanced filtering, category navigation, and detailed product views including nutritional information
- **Secure Authentication**: JWT-based user authentication with HTTP-only cookies for enhanced security
- **Smart Shopping Cart**: Session-based cart management supporting both authenticated users and guest sessions
- **Responsive Design**: Mobile-first approach with seamless experience across all devices
- **Performance Optimized**: Lazy loading, code splitting, and optimized asset delivery
- **Background Task Processing**: Automated cleanup of expired guest sessions

### ⚠️ Not Implemented (Intentionally)

- ❌ **Payment Processing**: No integration with payment gateways (Stripe, PayPal, etc.)
- ❌ **Order Management**: No order placement or tracking functionality
- ❌ **Checkout Process**: Cart does not proceed to actual checkout
- ❌ **Inventory Management**: No real-time stock tracking
- ❌ **Shipping Integration**: No shipping calculations or delivery tracking

This project focuses on demonstrating:
- ✅ Modern full-stack architecture
- ✅ Secure authentication patterns
- ✅ State management and API design
- ✅ Responsive UI/UX development
- ✅ Production deployment practices

---

## 🛠️ Technology Stack

### Backend (Node.js)
- **[Node.js 18+](https://nodejs.org/)**: JavaScript runtime
- **[Express](https://expressjs.com/)**: Fast, unopinionated web framework for Node.js
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development for backend
- **[Sequelize](https://sequelize.org/)**: Promise-based Node.js ORM for PostgreSQL
- **[PostgreSQL](https://www.postgresql.org/)**: Production database
- **[Zod](https://zod.dev/)**: TypeScript-first schema validation
- **[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)**: JWT token creation and validation
- **[bcryptjs](https://github.com/dcodeIO/bcrypt.js)**: Password hashing library
- **[cookie-parser](https://github.com/expressjs/cookie-parser)**: Cookie parsing middleware
- **[CORS](https://github.com/expressjs/cors)**: Cross-Origin Resource Sharing middleware

> **Alternative Backend (Optional)**: The original Python FastAPI implementation is also available in the `backend/` folder for reference. The Node.js backend provides improved performance and better TypeScript integration with the frontend.

### Frontend (JavaScript/TypeScript)
- **[React 19](https://react.dev/)**: Latest React with modern hooks and concurrent features
- **[TypeScript](https://www.typescriptlang.org/)**: Type-safe development
- **[Vite](https://vitejs.dev/)**: Next-generation frontend tooling with lightning-fast HMR
- **[React Router v6](https://reactrouter.com/)**: Declarative routing
- **[Axios](https://axios-http.com/)**: Promise-based HTTP client
- **[FontAwesome](https://fontawesome.com/)**: Professional icon library
- **Context API**: Global state management for auth and cart

### DevOps & Deployment
- **Backend**: Hosted on [Render](https://render.com/)
- **Frontend**: Deployed on [Netlify](https://www.netlify.com/)
- **Database**: PostgreSQL on Render
- **CI/CD**: Automatic deployments on git push

---

## 📁 Project Structure

```
e-commerce/
├── server/                      # Node.js Express Backend (Current)
│   ├── src/
│   │   ├── config/              # Configuration (database, environment)
│   │   ├── models/              # Sequelize ORM models
│   │   ├── middleware/          # Express middleware (auth, error handling)
│   │   ├── routes/              # API endpoints (auth, products, cart)
│   │   ├── utils/               # Utilities (auth, validation, response)
│   │   ├── app.ts               # Express app setup
│   │   └── index.ts             # Server entry point
│   ├── dist/                    # Compiled JavaScript (generated)
│   ├── package.json             # Node.js dependencies
│   ├── tsconfig.json            # TypeScript configuration
│   └── README.md                # Backend documentation with setup & API guide
│
├── backend/                     # Python FastAPI Backend (Reference)
│   ├── app/                     # FastAPI application code
│   ├── tests/                   # Backend test suite
│   └── requirements.txt         # Python dependencies
│
├── frontend/                    # React + TypeScript Frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Route-level page components
│   │   ├── context/             # React Context providers (Auth, Cart)
│   │   ├── api/                 # API client and service functions
│   │   ├── styles/              # Component-specific CSS modules
│   │   ├── utils/               # Helper functions and formatters
│   │   └── main.tsx             # Application entry point
│   ├── public/                  # Static assets
│   └── package.json             # Node.js dependencies
│
└── data/                        # Database dumps and migration scripts
```

---

## 🚀 Local Development Setup

### Prerequisites

Ensure you have the following installed:
- **Node.js 18+** and **npm** ([Download](https://nodejs.org/))
- **PostgreSQL 14+** (or use provided Supabase connection)
- **Python 3.9+** ([Optional](https://www.python.org/downloads/) - only if using FastAPI backend)

### Backend Setup (Node.js + Express)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-commerce/server
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `server/` directory (copy from `.env.example`):
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   JWT_EXPIRE_MINUTES=1440
   PORT=3000
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The API will be available at `http://localhost:3000`
   
   📚 **See [server/README.md](./server/README.md)** for detailed API documentation, examples, and troubleshooting

### Frontend Setup (React + TypeScript)

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install Node.js dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the React development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

### Testing the Application

1. **Access the application** at `http://localhost:5173`
2. **Browse products** without authentication
3. **Create an account** or login to test authenticated features
4. **Add items to cart** and test cart management
5. **Check backend logs** in terminal for request details

> **Note**: The shopping cart allows you to add and manage items, but there is no checkout or payment functionality. See [server/README.md](./server/README.md) for curl command examples to test the API directly.

---

## 🧪 Testing

### Backend Tests (Node.js)
```bash
cd server
npm test
```

### Frontend Tests (JavaScript)
```bash
cd frontend
npm run test
```

---

## 📦 Production Deployment

### Backend (Render - Node.js)
1. Connect your GitHub repository to Render
2. Create a new Web Service, point to `server/` directory
3. Set Node.js runtime environment
4. Set build and start commands:
   - **Build command**: `npm run build`
   - **Start command**: `npm start`
5. Set environment variables in Render dashboard:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET` (generate a secure key)
   - `NODE_ENV=production`
   - `FRONTEND_URL=https://your-app.netlify.app`
6. Deploy automatically on git push

### Frontend (Netlify - React)
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Configure environment variable:
   - `VITE_API_URL=https://your-api.onrender.com/api`
4. Deploy automatically on git push

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Justus Haataja**

- GitHub: [@justushaataja](https://github.com/JustusHaataja/Projects)
- LinkedIn: [justushaataja](https://linkedin.com/in/justushaataja)

---

## � Backend Documentation

For detailed backend setup, API endpoints, response formats, frontend integration patterns, and troubleshooting, see **[server/README.md](./server/README.md)**.

Key backend features:
- ✅ RESTful API with Express.js
- ✅ PostgreSQL with Sequelize ORM
- ✅ JWT authentication with HttpOnly cookies
- ✅ Guest cart support with UUID tracking
- ✅ Request validation with Zod
- ✅ Comprehensive error handling
- ✅ Automatic request logging

---

## 🙏 Acknowledgments

- Product data sourced from [Puhdistamo.fi](https://www.puhdistamo.fi/) for demonstration purposes only
- Icons by [FontAwesome](https://fontawesome.com/)
- Inspired by modern e-commerce best practices
- Backend built with [Express.js](https://expressjs.com/), [Sequelize](https://sequelize.org/), and [TypeScript](https://www.typescriptlang.org/)

---

## ⚖️ Legal Notice

This is a **non-commercial, educational project**. All product information, images, and branding are used solely for demonstration purposes. This application:

- Does not process real transactions
- Does not collect payment information
- Does not fulfill orders
- Is not affiliated with or endorsed by Puhdistamo.fi
- Should not be used for commercial purposes

For any concerns regarding content usage, please contact the repository owner.

---

**Built with ❤️**
