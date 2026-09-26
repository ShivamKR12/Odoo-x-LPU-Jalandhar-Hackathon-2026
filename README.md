# StockSense — Inventory Management System

> **Odoo x LPU Jalandhar Hackathon 2026**  
> A modern, lightweight, and responsive Inventory Management System inspired by Odoo Inventory ERP, built with Next.js 14, TypeScript, Tailwind CSS, Prisma, and SQLite.

---

## 📌 Project Overview

**StockSense** is designed to streamline supply chain and warehouse workflows for businesses of any scale. Modeled after enterprise inventory workflows (such as Odoo ERP), StockSense brings high efficiency, traceability, and an intuitive user interface to everyday inventory operations — from product intake and multi-location storage to picking, delivery, and stock auditing.

---

## ✨ Key Features

### 📊 1. Operations Kanban & Dashboard
- **Real-Time KPI Cards**: Instant summary of pending receipts, outgoing delivery orders, waiting operations, and overdue tasks.
- **Kanban-Style Status Flow**: Visual tracking of order lifecycles across `DRAFT` ➔ `WAITING` ➔ `READY` ➔ `DONE`.

### 🔄 2. Warehouse Operations
- **Receipts (Incoming Shipments)**: Receive goods from suppliers, verify received quantities against orders, and update stock levels automatically.
- **Delivery Orders (Outgoing Shipments)**: Pick, pack, and validate customer shipments with real-time stock availability verification.
- **Stock Adjustments**: Reconcile physical inventory counts against system records to account for shrinkage, damages, or discrepancies.

### 📦 3. Product & Stock Management
- **Catalog Management**: Add and manage products with SKU identifiers, categories, units of measure, standard cost, and minimum safety stock thresholds.
- **Location-Aware Stock Quants**: Real-time stock counts tracked per warehouse and storage location.

### 🏢 4. Multi-Warehouse & Location Hierarchy
- **Warehouse Setup**: Configure multiple facilities with distinct short codes and physical addresses.
- **Internal Locations**: Organize stock into specific internal locations (e.g., racks, shelves, receiving docks, delivery bays).

### 📜 5. Audit Trail & Move History
- **Complete Traceability**: Every stock transaction records source/destination locations, timestamp, product details, quantity, and the responsible staff member.

### 🔐 6. Authentication & User Profile
- **Secure Access**: Role-based access control with NextAuth.js and bcrypt password hashing.
- **Self-Service**: User signup, profile management, and password reset flows.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router & Server Actions) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) with Odoo-inspired color palette |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database ORM** | [Prisma ORM](https://www.prisma.io/) |
| **Database** | SQLite (`prisma/dev.db` for instant zero-config setup) |
| **Auth** | [NextAuth.js](https://next-auth.js.org/) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js) |

---

## 📁 Repository Structure

```text
Odoo-x-LPU-Jalandhar-Hackathon-2026/
├── README.md               # Root project documentation (this file)
└── stocksense/             # Main application source directory
    ├── prisma/             # Prisma schema and SQLite database
    │   ├── dev.db          # Development database
    │   └── schema.prisma   # Data models (User, Product, Move, MoveLine, Warehouse, Location, StockQuant)
    ├── public/             # Static public assets
    ├── src/
    │   ├── app/            # Next.js App Router
    │   │   ├── (dashboard)/# Authenticated dashboard views
    │   │   │   ├── history/       # Stock move audit logs
    │   │   │   ├── operations/    # Receipts, Deliveries & Adjustments
    │   │   │   ├── profile/       # User profile management
    │   │   │   ├── settings/      # Warehouse & Location settings
    │   │   │   └── stock/         # Product catalog and stock levels
    │   │   ├── api/        # NextAuth and backend API endpoints
    │   │   ├── login/      # Sign-in page
    │   │   ├── signup/     # Registration page
    │   │   └── reset-password/ # Password reset page
    │   ├── components/     # UI components (Sidebar, TopNavbar, etc.)
    │   ├── lib/            # Shared utilities (auth, Prisma client)
    │   └── middleware.ts   # Route protection middleware
    ├── .env                # Environment variables
    ├── next.config.mjs     # Next.js configuration
    ├── package.json        # Dependencies and scripts
    ├── tailwind.config.ts  # Tailwind CSS configuration
    └── tsconfig.json       # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.17.0 or higher (v20+ recommended)
- **NPM**: v9 or higher

### Installation & Run

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ShivamKR12/Odoo-x-LPU-Jalandhar-Hackathon-2026.git
   cd Odoo-x-LPU-Jalandhar-Hackathon-2026
   ```

2. **Navigate to the application folder**:
   ```bash
   cd stocksense
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure Environment Variables**:
   Ensure a `.env` file exists in `stocksense/` with:
   ```env
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   ```

5. **Generate Prisma Client & Sync Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. **Start the Development Server**:
   ```bash
   npm run dev
   ```

7. **Open Application**:
   Visit [http://localhost:3000](http://localhost:3000) in your browser. Create an account via **Sign Up** or log in to begin managing inventory.

---

## 🏆 Hackathon Context

This project was built for the **Odoo x LPU Jalandhar Hackathon 2026**, addressing modern warehouse and inventory management challenges by creating a fast, user-friendly, and accessible inventory solution.
