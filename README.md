# K.Inc POS (Point of Sale System)

A modern, cloud-based Point of Sale system built with **Next.js 15**, **TypeScript**, and **Prisma ORM**. Designed for efficiency, scalability, and ease of use for various business types.

## 🚀 Features

### 🌟 Landing Page (Dynamic Content)
- **Admin-Managed Content:** Edit Hero Image, Title, Description, and Pricing Plans directly from the Admin Panel.
- **Dynamic Pricing Section:** Add/Remove/Highlight pricing plans instantly.
- **Mobile Flip Integration:** Unique 3D interaction on mobile login (Info Card flips to Login Form).
- **Responsive Design:** Dark/Green Modern UI (K.Inc branding).

### 🛍️ Store Management
- **Dashboard Overview:** Real-time insights on sales, top products, and revenue.
- **Menu Management:** Create, categorize, and manage products with ease.
- **Staff Management:** Role-based access control (Admin, Manager, Cashier).

### 🧾 Transaction & Sales
- **Cashier Interface:** Fast and intuitive checkout process.
- **Transaction History:** Filterable table (by Date, Cashier) with pagination.
- **Export Capabilities:** Export sales data to **PDF** (custom header) and **Excel** for reporting.

### 🔐 Security & Auth
- **Secure Authentication:** Powered by NextAuth.js (v5 Beta).
- **Role-Based Access:** Protected routes for Admin and Staff.
- **Audit Logs:** Track critical system actions efficiently.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Language:** TypeScript
- **Database:** Prisma ORM (Supports PostgreSQL, SQLite, MySQL)
- **Styling:** Tailwind CSS + Shadcn UI
- **Auth:** NextAuth.js v5
- **Charts:** Recharts
- **PDF/Excel:** jsPDF, XLSX

---

## 🏁 Getting Started

Follow these steps to set up the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Kyra-Code79/pos-system.git
cd pos-system
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory and add the following variables:

```env
# Database Connection (PostgreSQL recommended for production)
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# NextAuth Secret (Generate one using: openssl rand -base64 32)
AUTH_SECRET="your_generated_secret_here"
```

### 4. Database Setup

Run the migrations to set up your database schema:

```bash
npx prisma migrate dev --name init
```

Seed the database with initial data (default admin user, sample products):

```bash
npx prisma db seed
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 📂 Project Structure

```bash
├── app                # Next.js App Router Pages
│   ├── admin          # Admin Dashboard & Settings
│   ├── login          # Login Page (Split Layout)
│   └── page.tsx       # Dynamic Landing Page
├── components
│   ├── admin          # Admin-specific components (Forms, Tables)
│   ├── auth           # Auth forms (LoginForm)
│   └── ui             # Shadcn UI reusable components
├── lib
│   ├── actions        # Server Actions (Backend Logic)
│   └── prisma.ts      # Prisma Client Instantiation
├── prisma             # Database Schema & Seeds
└── public             # Static Assets
```

## 📄 License

This project is licensed under the MIT License.
