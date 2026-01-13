# E-commerce Platform

A full-stack e-commerce application featuring a modern **React + TypeScript** frontend and **Python FastAPI** backend, designed to deliver a seamless online shopping experience with robust authentication, real-time cart management, and responsive design.

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

### Backend (Python)
- **[Python 3.9+](https://www.python.org/)**: Core programming language
- **[FastAPI](https://fastapi.tiangolo.com/)**: High-performance Python web framework for building APIs
- **[SQLAlchemy](https://www.sqlalchemy.org/)**: Python SQL toolkit and ORM for database operations
- **[PostgreSQL](https://www.postgresql.org/)**: Production database (SQLite for development)
- **[Pydantic](https://pydantic-docs.helpmanual.io/)**: Data validation using Python type annotations
- **[python-jose](https://python-jose.readthedocs.io/)**: JWT token creation and validation
- **[passlib](https://passlib.readthedocs.io/)**: Password hashing with bcrypt
- **[APScheduler](https://apscheduler.readthedocs.io/)**: Python-based background task scheduling
- **[Uvicorn](https://www.uvicorn.org/)**: Lightning-fast ASGI server

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
├── backend/                     # Python FastAPI Backend
│   ├── app/
│   │   ├── routes/              # API endpoints (auth, products, cart)
│   │   ├── models.py            # SQLAlchemy database models
│   │   ├── schemas.py           # Pydantic request/response schemas
│   │   ├── auth.py              # JWT utilities and password hashing
│   │   ├── database.py          # Database connection and session
│   │   ├── background_tasks.py  # Scheduled maintenance tasks
│   │   └── main.py              # FastAPI application entry point
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
- **Python 3.9+** ([Download](https://www.python.org/downloads/))
- **pip** (Python package manager, included with Python)
- **Node.js 18+** and **npm** ([Download](https://nodejs.org/))
- **PostgreSQL 14+** (Optional - SQLite works for development)

### Backend Setup (Python + FastAPI)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-commerce/backend
   ```

2. **Create and activate Python virtual environment**
   ```bash
   python -m venv venv
   
   # On macOS/Linux:
   source venv/bin/activate
   
   # On Windows:
   venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   
   Create a `.env` file in the `backend/` directory:
   ```env
   DATABASE_URL=sqlite:///./test.db
   SECRET_KEY=your-secret-key-here
   ENVIRONMENT=development
   FRONTEND_URL=http://localhost:5173
   ```

5. **Start the FastAPI development server**
   ```bash
   # From backend/ directory
   uvicorn app.main:app --reload
   ```
   
   The Python API will be available at `http://localhost:8000`
   
   📚 **Interactive API Documentation**: `http://localhost:8000/docs`

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
   VITE_API_URL=http://localhost:8000
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
5. **Check API docs** at `http://localhost:8000/docs` for available endpoints

> **Note**: The shopping cart allows you to add and manage items, but there is no checkout or payment functionality.

---

## 🧪 Testing

### Backend Tests (Python)
```bash
cd backend
pytest
```

### Frontend Tests (JavaScript)
```bash
cd frontend
npm run test
```

---

## 📦 Production Deployment

### Backend (Render - Python)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set Python runtime environment
4. Set environment variables in Render dashboard:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `SECRET_KEY` (generate a secure key)
   - `ENVIRONMENT=production`
   - `FRONTEND_URL=https://your-app.netlify.app`
5. Deploy automatically on git push

### Frontend (Netlify - React)
1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
3. Configure environment variable:
   - `VITE_API_URL=https://your-api.onrender.com`
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

## 🙏 Acknowledgments

- Product data sourced from [Puhdistamo.fi](https://www.puhdistamo.fi/) for demonstration purposes only
- Icons by [FontAwesome](https://fontawesome.com/)
- Inspired by modern e-commerce best practices

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
