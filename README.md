<<<<<<< HEAD
# NeoCartX - Futuristic Premium E-Commerce Platform

NeoCartX is a premium, production-quality, full-stack e-commerce web application featuring a futuristic, clean design with modern glassmorphism, glowing neon accents, and smooth interactive animations.

---

## 🚀 Features

### 1. Interactive Landing Page
*   **Hero Grid:** Futuristic CTAs, glowing neon headers, and active telemetry visualizers.
*   **Featured Cargo:** Real-time featured products showcase with hover animations.
*   **Augment Categories:** Clean cards categorized by target operative networks (Cyberware, Exo-Suits, Quantum Tech, Holo-Displays).
*   **Operative Reports:** User testimonials with sector logs and avatar badges.

### 2. Secure Gateways (Authentication)
*   **Profile Link:** Secure Register/Login system.
*   **JSON Web Tokens:** Stateless JWT authentication mapping authorizations across nodes.
*   **Route Guards:** Protected customer profile sections and administrator terminals.

### 3. Hardware Grid (Catalog)
*   **Refined Searching:** Real-time keyword filter across names and descriptors.
*   **Multi-layered Filters:** Filter by category slug, price boundaries, and sort by popularity, price, or newest arrivals.
*   **Product Spec Files:** Image galleries, detailed description files, availability logs, and client rating registries.

### 4. Interactive Cart & Wishlist Cache
*   **Sync Terminal:** LocalStorage guest carts automatically sync back to database structures upon successful profile authentication.
*   **Telemetry Calculations:** Automated tax rates, shipping estimations, and quantity adjustments synced against inventory limits.
*   **Wishlist Hub:** Save items to a persistent hub and move them directly to the active checkout pipeline.

### 5. Deployment System (Checkout)
*   **Multi-Step Pipeline:** Synced shipping profiles + interactive credit card terminals.
*   **Order Success:** Displays receipt manifest detailing transit status, totals, and tracking details.

### 6. Operative Dashboard
*   **Order Logs:** Audits past transaction telemetry, paid markers, and transit states.
*   **Node Addresses:** Add, delete, and toggle default shipping nodes.
*   **Profile Configuration:** Edit user name, email, and password keys.

### 7. Administrator Terminal (Admin Dashboard)
*   **Metrics Panel:** Analytical counters for Gross Sales, Orders, Products, and Low Inventory warning counts.
*   **Analytics Graph:** 7-Day sales history visual chart rendering in a sleek line graph.
*   **Inventory CRUD Manager:** Edit, delete, and deploy new hardware items or categories.
*   **Logs Manager:** Change shipping states, verify payments, and terminate user credentials.

---

## 🛠 Tech Stack

*   **Frontend:** React.js (Vite), React Router v6, Context API, Tailwind CSS, Framer Motion, Chart.js.
*   **Backend:** Node.js, Express.js, MongoDB + Mongoose, JWT, Bcrypt.js.

---

## 📂 Project Structure

```
CODSOFT INTERN/
├── backend/
│   ├── config/             # Database connection & data seeder
│   ├── controllers/        # Route controllers containing API logic
│   ├── middleware/         # JWT verification & role authorization
│   ├── models/             # Mongoose schemas (User, Product, Category, Cart, Order, Review)
│   ├── routes/             # Express routes (auth, categories, products, cart, orders, admin)
│   ├── .env                # Local environment configurations (ignored in git)
│   ├── server.js           # Server entry point
│   └── package.json
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # UI elements (Navbar, Footer, Rating, Loader, Skeletons, ProductCard)
│   │   ├── context/        # State managers (Theme, Auth, Cart, Wishlist, Toast)
│   │   ├── pages/          # View panels (Landing, Catalog, Product Details, Cart, Wishlist, Auth, Dashboard, Admin)
│   │   ├── App.jsx         # Routes map
│   │   ├── index.css       # Tailwind & Glassmorphism styles
│   │   └── main.jsx        # App entry point
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
```

---

## ⚙️ Local Development

### Prerequisites
*   Node.js (v18+)
*   npm
*   MongoDB running locally (e.g. `mongodb://localhost:27017`)

### 1. Database Setup & Seeding
Navigate to the `backend/` folder:
```bash
cd backend
npm install
```
Create a `.env` file (copied from `.env.example`):
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/neocartx
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```
Seed the database with sample products, categories, and initial admin/customer accounts:
```bash
npm run seed
```

#### Seeded Accounts:
*   **Admin Operative:** `admin@neocartx.com` / `admin123`
*   **Standard Customer:** `user@neocartx.com` / `user123`

### 2. Booting the Backend Server
Start the Express server with Nodemon reload support:
```bash
npm run dev
```
The server will bind to `http://localhost:5000`.

### 3. Booting the Frontend Client
Navigate to the `frontend/` folder in a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The client binds to `http://localhost:5173`. Open this URL in your web browser. All requests to `/api/*` are automatically proxied to the backend.

---

## 🛡 Security & Design Implementations
*   **Password Cryptography:** Secure bcrypt password salting on schema level.
*   **Stateless Gateways:** Token storage via LocalStorage, validated with high-entropy JWT guards on Express.
*   **Glassmorphic Design:** Backdrop filters, glowing shadow accents, custom sliders, and smooth dark/light mode toggles.
*   **Dynamic Transitions:** Route changes and card hovers animated with Framer Motion.
=======
🛒 NeoCartX – Modern E-Commerce Platform

 CODSOFT Web Development Internship – Level 3 Task

📌 Project Overview

NeoCartX is a modern full-stack e-commerce web application designed to provide a seamless and user-friendly online shopping experience. The platform allows users to browse products, search and filter items, manage their shopping cart, create accounts, and complete the checkout process through an intuitive and responsive interface.

The project focuses on delivering a professional UI/UX, secure authentication, efficient product management, and a smooth shopping journey across all devices.

---

 ✨ Key Features

 🔐 User Authentication
- Secure user registration and login system
- Protected user accounts
- Session management and authentication

 🛍️ Product Catalog
- Browse a wide range of products
- Detailed product information page
- Product images, descriptions, and pricing

 🔎 Search & Filtering
- Search products instantly
- Filter products by category
- Sort products based on price and popularity

 🛒 Shopping Cart
- Add products to cart
- Update product quantities
- Remove products from cart
- Real-time cart calculations

 💳 Checkout System
- Order summary page
- Shipping details form
- Smooth checkout experience

 📱 Responsive Design
- Mobile-friendly layout
- Tablet and desktop optimization
- Consistent user experience across devices

⚙️ Admin Dashboard
- Manage products and categories
- Monitor customer orders
- Update inventory and product information

---

🛠️ Technology Stack

 Frontend
- React.js
- HTML5
- CSS3
- JavaScript (ES6+)


 Backend
- Node.js
- Express.js

 Database
- MongoDB

Additional Tools
- Git & GitHub
- REST APIs
- JWT Authentication

---

🎯 Project Objectives

- Build a complete full-stack e-commerce platform
- Implement secure user authentication
- Create a responsive and modern user interface
- Improve user shopping experience through intuitive navigation
- Demonstrate practical web development skills using industry-standard technologies

---

 🚀 Live Demo

🔗 Add your deployed website link here

---

 📂 GitHub Repository

https://github.com/sidcloudio/CODSOFT_TASKNO1

---

## 👨‍💻 Author

Siddhant Tiwari

Web Development Intern – CODSOFT

---
>>>>>>> 1e762a2f8f59de8e2210bd4b2c50eeb5ce58d17c
