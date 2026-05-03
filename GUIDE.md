# AgriPower - Complete User Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [How to Run the Project](#how-to-run-the-project)
3. [User Roles](#user-roles)
4. [Admin Features](#admin-features)
5. [Farmer Features](#farmer-features)
6. [Usage & Billing Trends Explained](#usage--billing-trends-explained)
7. [Schedule Management Guide](#schedule-management-guide)
8. [Troubleshooting](#troubleshooting)

---

## Project Overview

AgriPower is an Electric Power Distribution Management System for Agriculture. It helps administrators manage power distribution across different regions and allows farmers to view their power schedules, usage, and billing.

**Tech Stack:**
- **Backend**: Node.js, Express, MongoDB
- **Frontend**: React, Vite, Tailwind CSS, Recharts

---

## How to Run the Project

### Prerequisites
- Node.js installed
- MongoDB running locally (or MongoDB Atlas connection)

### Steps

1. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

3. **Set Environment Variables:**
   Create `backend/.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/agri-power
   JWT_SECRET=your_jwt_secret_here
   ```

4. **Start MongoDB:**
   ```bash
   mongod --dbpath "C:/data/db"
   ```

5. **Start Backend Server:**
   ```bash
   cd backend
   node server.js
   ```
   Server runs on http://localhost:5000

6. **Start Frontend Server:**
   ```bash
   cd frontend
   npm run dev
   ```
   Frontend runs on http://localhost:3000

7. **Open Browser:**
   Navigate to http://localhost:3000

---

## User Roles

### 1. Admin
- Full access to all features
- Manages regions, customers, schedules, complaints, and billing
- Views system-wide analytics and reports

### 2. Farmer (Customer)
- Views their own power schedule
- Checks usage and billing history
- Submits complaints
- Views personal dashboard with power status

---

## Admin Features

### 1. Admin Dashboard
**URL:** `/admin/dashboard`

**What You See:**
| Card | Description |
|------|-------------|
| **Total Regions** | Number of power distribution regions created |
| **Total Customers** | Number of registered farmers |
| **Pending Complaints** | Complaints awaiting resolution |
| **Monthly Revenue** | Total revenue for the current month |

**Charts:**
- **Region-wise Load Distribution (Bar Chart)**: Compares current load vs total capacity for each region

**Table:**
- **Region Status**: Shows region name, power status (ON/OFF), customer count, and current load

---

### 2. Region Management
**URL:** `/admin/regions`

**What You Can Do:**
- **Create Region**: Add new power distribution regions
  - Fields: Region Name, Total Capacity (kW), Current Load (kW), Power Status (on/off)
- **View Regions**: See all regions with customer counts
- **Update Region**: Edit region details
- **Delete Region**: Remove a region (only if no customers are assigned)

**Example Data to Fill:**
| Field | Example Value |
|-------|---------------|
| Region Name | North Zone |
| Total Capacity | 500 |
| Current Load | 250 |
| Power Status | on |

---

### 3. Customer Management
**URL:** `/admin/customers`

**What You Can Do:**
- **Create Customer**: Register new farmers
  - Fields: Name, Email, Password, Phone, Region, Address
- **View Customers**: See all registered farmers with their assigned regions
- **Update Customer**: Edit customer details
- **Delete Customer**: Remove a customer from the system

**Example Data to Fill:**
| Field | Example Value |
|-------|---------------|
| Name | John Doe |
| Email | john@example.com |
| Password | password123 |
| Phone | 9876543210 |
| Region | North Zone (select from dropdown) |
| Address | 123 Farm Road, Village |

---

### 4. Schedule Management
**URL:** `/admin/schedules`

**What You Can Do:**
- **Create Schedule**: Set power supply timings for regions or specific customers
- **View Schedules**: See all active schedules
- **Delete Schedule**: Remove a schedule

**Schedule Types:**

#### A. Region-wise Schedule
Applies to ALL customers in a selected region.

**Example Data to Fill:**
| Field | Example Value |
|-------|---------------|
| Schedule Type | Region-wise |
| Region | North Zone |
| Start Time | 06:00 |
| End Time | 18:00 |
| Rate per Unit | 7.50 |
| Description | Summer irrigation hours |

#### B. Customer-specific Schedule
Applies to ONE specific customer only.

**Example Data to Fill:**
| Field | Example Value |
|-------|---------------|
| Schedule Type | Customer-specific |
| Customer | John Doe |
| Start Time | 08:00 |
| End Time | 12:00 |
| Rate per Unit | 8.00 |
| Description | Morning pump schedule |

**Important Notes:**
- Time format is 24-hour (HH:MM)
- Start time must be before end time
- Rate per unit is in INR (₹)
- You must create at least one region before creating region-wise schedules
- You must register at least one customer before creating customer-specific schedules

---

### 5. Billing Reports
**URL:** `/admin/billing`

**What You See:**

**Filters:**
- **Month**: Select any month (January - December)
- **Year**: Select year (2024, 2025, 2026)

**Summary Cards:**
| Card | Description |
|------|-------------|
| **Total Revenue** | Sum of all customers' bills for selected month |
| **Total Units** | Combined electricity consumption (kWh) |
| **Total Customers** | Number of customers with billing records |

**Charts:**
- **Top 10 Consumers (Bar Chart)**: Compares top customers by units consumed and total cost

**Billing Details Table:**
| Column | Description |
|--------|-------------|
| Customer | Farmer's name |
| Region | Their assigned region |
| Units | kWh consumed |
| Rate | Price per unit (₹) |
| Total Cost | Units × Rate |
| Status | Paid (green) / Pending (yellow) |

**How to Use:**
1. Select a month and year from dropdowns
2. The page automatically fetches and displays data
3. Use the bar chart to identify highest consumers
4. Check the table for detailed billing information

---

### 6. Complaint Management
**URL:** `/admin/complaints`

**What You Can Do:**
- View all complaints submitted by farmers
- Filter by status: Pending, In Progress, Resolved
- Update complaint status and add admin notes
- Track resolution history

---

### 7. Activity Logs
**URL:** `/admin/logs`

**What You See:**
- Complete audit trail of all admin actions
- Actions logged: CREATE_REGION, UPDATE_REGION, DELETE_REGION, CREATE_CUSTOMER, etc.
- Timestamp and IP address for each action

---

## Farmer Features

### 1. Farmer Dashboard
**URL:** `/farmer/dashboard`

**What You See:**

| Card | Description |
|------|-------------|
| **Power Status** | Shows if power is ON or OFF in your region |
| **Current Month Usage** | Your electricity consumption this month (kWh) |
| **Current Bill** | Your total bill amount for this month (₹) |

**Alerts:**
- If no region is assigned, a warning banner appears: "Please contact the administrator to assign you to a region."

**Quick Actions:**
- View Billing History
- Submit Complaint

---

### 2. Usage & Billing
**URL:** `/farmer/billing`

**What You See:**

**Summary Cards:**
| Card | Description |
|------|-------------|
| **Total Cost** | Cumulative amount spent on electricity |
| **Total Units** | Total kWh consumed across all records |
| **Total Records** | Number of billing entries |

**Monthly Usage Trend (Line Chart):**
- X-axis: Months (Jan, Feb, Mar, etc.)
- Y-axis: Values
- **Blue Line**: Units Consumed (kWh)
- **Green Line**: Total Cost (₹)
- Hover over points to see exact values

**Billing History Table:**
| Column | Description |
|--------|-------------|
| Month/Year | Billing period |
| Units | kWh consumed |
| Rate | Price per unit |
| Total Cost | Final amount |
| Status | Paid / Pending |

**How to Read the Chart:**
- **Upward trend** in blue line = Increasing electricity usage
- **Upward trend** in green line = Increasing costs
- If both lines move similarly, your rate per unit is consistent
- If green line rises faster than blue, your rates may have increased

---

### 3. Complaints
**URL:** `/farmer/complaints`

**What You Can Do:**
- Submit new complaints about power issues
- View your complaint history
- Track status of each complaint (Pending / In Progress / Resolved)

**Example Complaint:**
| Field | Example Value |
|-------|---------------|
| Subject | Power outage for 3 hours |
| Description | No electricity from 2 PM to 5 PM today |
| Type | outage |

---

## Usage & Billing Trends Explained

### Understanding Trends (Farmer View)

The **Line Chart** in the farmer's Usage & Billing page shows patterns over time:

| Pattern | What It Means |
|---------|---------------|
| **Both lines increasing** | You're using more electricity and paying more |
| **Blue line up, green flat** | You're using more but rates decreased |
| **Blue line flat, green up** | Same usage but rates increased |
| **Both lines decreasing** | Reduced usage and lower bills |
| **Spikes** | Seasonal changes (e.g., summer irrigation) |

### Understanding Trends (Admin View)

The **Bar Chart** in Billing Reports shows customer comparisons:

| Pattern | What It Means |
|---------|---------------|
| **Tall blue bars** | High electricity consumers |
| **Tall green bars** | Customers with high bills |
| **Short bars** | Low consumption customers |
| **Mismatched bars** | Different rate plans or discounts applied |

**Monthly Revenue Tracking:**
- Compare month-to-month revenue using the Total Revenue card
- Identify peak consumption months for resource planning
- Track customer growth via Total Customers count

---

## Schedule Management Guide

### Prerequisites Before Creating Schedules

1. **Create at least one Region** in Region Management
2. **Register at least one Customer** in Customer Management

### Step-by-Step: Create a Region-wise Schedule

1. Go to **Schedule Management**
2. Click **"+ Create Schedule"**
3. Select **Schedule Type**: `Region-wise`
4. Select **Region** from dropdown (shows all created regions)
5. Set **Start Time**: e.g., `06:00` (6 AM)
6. Set **End Time**: e.g., `18:00` (6 PM)
7. Enter **Rate per Unit**: e.g., `7.50`
8. Add **Description** (optional): e.g., "Summer irrigation schedule"
9. Click **Create**

### Step-by-Step: Create a Customer-specific Schedule

1. Go to **Schedule Management**
2. Click **"+ Create Schedule"**
3. Select **Schedule Type**: `Customer-specific`
4. Select **Customer** from dropdown (shows all registered farmers)
5. Set **Start Time**: e.g., `08:00`
6. Set **End Time**: e.g., `12:00`
7. Enter **Rate per Unit**: e.g., `8.00`
8. Add **Description** (optional)
9. Click **Create**

### Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "Server error" when creating schedule | Empty region/customer field | Select a valid region or customer from the dropdown |
| "Cast to ObjectId failed" | Invalid ID passed | Ensure you select from dropdown, don't type manually |
| Region dropdown is empty | No regions created | Go to Region Management and create a region first |
| Customer dropdown is empty | No customers registered | Go to Customer Management and register a customer first |

---

## Troubleshooting

### Backend Won't Start
- Check if MongoDB is running: `mongod --version`
- Verify `.env` file exists with correct `MONGODB_URI`
- Check port 5000 is not in use: `netstat -ano | findstr :5000`

### Frontend Won't Start
- Check if port 3000 is free
- Ensure all dependencies are installed: `npm install`

### Can't Login
- Default admin credentials are typically seeded during first run
- Run seed script if needed: `cd backend && node utils/seed.js`

### Data Not Appearing
- Ensure MongoDB connection is active
- Check browser console for API errors
- Verify backend is running on port 5000

---

## API Endpoints Reference

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user |

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/dashboard | Dashboard stats |
| GET | /api/admin/regions | All regions |
| POST | /api/admin/regions | Create region |
| GET | /api/admin/customers | All customers |
| POST | /api/admin/customers | Create customer |
| GET | /api/admin/schedules | All schedules |
| POST | /api/admin/schedules | Create schedule |
| GET | /api/admin/billing | Billing reports |
| GET | /api/admin/complaints | All complaints |
| GET | /api/admin/logs | Activity logs |

### Farmer Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/farmer/dashboard | Farmer dashboard |
| GET | /api/farmer/billing | My billing |
| GET | /api/farmer/usage | My usage |
| GET | /api/farmer/schedule | My schedule |
| POST | /api/farmer/complaints | Submit complaint |

---

*This guide covers all major features of the AgriPower system. For additional help, check the browser console or backend logs for error messages.*

---

## Default Login Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `sharook@agripower.com` | `admin123` |
| **Farmer 1** | `ahmad@example.com` | `farmer123` |
| **Farmer 2** | `bilal@example.com` | `farmer123` |
| **Farmer 3** | `faizan@example.com` | `farmer123` |
| **Farmer 4** | `imran@example.com` | `farmer123` |
| **Farmer 5** | `junaid@example.com` | `farmer123` |
| **Farmer 6** | `kashif@example.com` | `farmer123` |

> **Created by Sharook**


