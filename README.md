# AgriPower - Electric Power Distribution for Agriculture

> **Full-Stack MERN Application** | Created by **Sharook**

A complete web application for managing electricity distribution to agricultural regions and farmers. Features include region management, power scheduling, usage tracking, billing reports, and complaint management.

---

## What's Included

- **Backend**: Node.js + Express + MongoDB REST API
- **Frontend**: React + Vite + Tailwind CSS + Recharts
- **Authentication**: JWT-based login/register with role-based access (Admin / Farmer)
- **Features**: Dashboards, charts, data export, complaint system, activity logs

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| Auth | JWT (JSON Web Tokens) |

---

## Quick Start (Local Setup)

### Step 1: Prerequisites

Make sure you have installed:
- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas cloud)

### Step 2: Clone & Install

```bash
# Clone the project
git clone <your-repo-url>
cd agri-power-main

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Environment

Create a `.env` file inside the `backend/` folder:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/agripower
JWT_SECRET=your_secret_key_here
```

> For MongoDB Atlas (cloud), use your Atlas connection string instead.

### Step 4: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
Server runs at: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs at: `http://localhost:3000`

### Step 5: Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 1 Admin user
- 6 Farmer users
- 4 Regions
- 5 Power schedules
- 72 Usage/billing records
- 5 Sample complaints

---

## Login Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `sharook@agripower.com` | `admin123` |
| **Farmers** | `ahmad@example.com`, `bilal@example.com`, `faizan@example.com`, `imran@example.com`, `junaid@example.com`, `kashif@example.com` | `farmer123` |

---

## Project Structure

```
agri-power-main/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # API logic (auth, admin, farmer)
│   ├── middleware/      # Auth & security middleware
│   ├── models/          # Mongoose schemas (User, Region, Schedule, Usage, Complaint, Log)
│   ├── routes/          # API route definitions
│   ├── utils/           # Seed script & helpers
│   ├── server.js        # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/  # Navbar, Sidebar, ProtectedRoute
│   │   ├── context/     # AuthContext for global state
│   │   ├── pages/       # All page components
│   │   ├── services/    # API service (Axios)
│   │   └── utils/       # Export utilities & toast
│   ├── index.html
│   ├── vite.config.js   # Vite + Proxy config
│   └── package.json
│
├── README.md            # This file
├── DEPLOYMENT.md        # Deployment instructions
└── GUIDE.md             # User guide
```

---

## Available Scripts

### Backend
| Script | Command | Description |
|--------|---------|-------------|
| Start | `npm start` | Run production server |
| Dev | `npm run dev` | Run with nodemon (auto-reload) |
| Seed | `npm run seed` | Populate database with sample data |

### Frontend
| Script | Command | Description |
|--------|---------|-------------|
| Dev | `npm run dev` | Start development server |
| Build | `npm run build` | Build for production |
| Preview | `npm run preview` | Preview production build |
| Lint | `npm run lint` | Run ESLint |

---

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Admin
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/regions` - List all regions
- `POST /api/admin/regions` - Create region
- `GET /api/admin/customers` - List all farmers
- `GET /api/admin/schedules` - List schedules
- `POST /api/admin/schedules` - Create schedule
- `GET /api/admin/usage` - Get usage records
- `POST /api/admin/usage` - Create usage record (NEW)
- `GET /api/admin/billing` - Billing reports
- `GET /api/admin/complaints` - List complaints

### Farmer
- `GET /api/farmer/dashboard` - Farmer dashboard data
- `GET /api/farmer/usage` - Personal usage records
- `GET /api/farmer/schedules` - Assigned schedules
- `POST /api/farmer/complaints` - File complaint

---

## Key Features

### Admin Panel
- **Dashboard**: View total farmers, regions, revenue, complaints
- **Region Management**: Add/edit/delete power regions
- **Customer Management**: View all registered farmers
- **Schedule Management**: Create region-wide or customer-specific power schedules
- **Add Usage**: Manually add electricity usage for any farmer
- **Billing Reports**: Filter by month/year, view top consumers, export data
- **Complaint Management**: View, update status, and resolve complaints
- **Activity Logs**: Track system actions

### Farmer Portal
- **Dashboard**: Personal stats, current month's usage & bill
- **Power Schedule**: View assigned power timings
- **Usage & Billing**: Monthly trend charts, billing history
- **Complaints**: File and track complaints

---

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions to deploy on **Render** (backend) and **Vercel** (frontend) for free.

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| MongoDB connection error | Check if MongoDB is running locally, or verify Atlas connection string |
| Port already in use | Kill the process or change PORT in `.env` |
| CORS errors | Backend and frontend should run on their default ports (5000 & 3000) |
| Empty data after login | Run `npm run seed` in the backend folder |

---

## Credits

**Created by Sharook** as a full-stack demonstration project.

Feel free to fork, modify, and use this project for learning or your own purposes!

