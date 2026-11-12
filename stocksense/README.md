# StockSense — Application Directory

This is the main application source directory for **StockSense**, built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM (SQLite)**.

For full project documentation, architectural overview, and feature list, see the root [README.md](../README.md).

---

## 📖 Complete Commands Reference

All commands for development, database management, migrations, testing, and production builds are comprehensively documented in:

👉 **[COMMANDS.md](../COMMANDS.md)**

---

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma Client & Sync Database
npx prisma generate
npx prisma db push

# 3. Seed demo data (Optional)
node prisma/seed.js

# 4. Start Development Server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Common Tasks

| Task | Command |
|---|---|
| **Dev Server (Default)** | `npm run dev` |
| **Dev Server (Custom Port)** | `npm run dev -- -p 3001` |
| **Prisma Studio (Database GUI)** | `npx prisma studio` |
| **Sync Database Schema** | `npx prisma db push` |
| **Run Linter** | `npm run lint` |
| **Type Check** | `npx tsc --noEmit` |
| **Production Build** | `npm run build` |
| **Production Server** | `npm run start` |

See [COMMANDS.md](../COMMANDS.md) for all options and variations.
