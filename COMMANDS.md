# 📖 StockSense — Complete Command & CLI Reference Guide

This document contains **all commands and their variations** that can be run on the **StockSense** project across all development, database, maintenance, testing, and production workflows.

---

## 📑 Table of Contents
1. [Quick Command Cheat Sheet](#1-quick-command-cheat-sheet)
2. [Environment & Setup Commands](#2-environment--setup-commands)
3. [Package Management (npm, yarn, pnpm, bun)](#3-package-management)
4. [Development Server Variations](#4-development-server-variations)
5. [Production Build & Run](#5-production-build--run)
6. [Prisma ORM & Database Operations](#6-prisma-orm--database-operations)
7. [Prisma Studio (Visual Database GUI)](#7-prisma-studio-visual-database-gui)
8. [Direct SQLite Database Commands](#8-direct-sqlite-database-commands)
9. [Code Quality, Linting & Type Checking](#9-code-quality-linting--type-checking)
10. [Health Checks & API Testing (cURL & PowerShell)](#10-health-checks--api-testing)
11. [Cache Clearing & Troubleshooting](#11-cache-clearing--troubleshooting)
12. [Port Management & Process Killing](#12-port-management--process-killing)
13. [Git & Version Control Workflows](#13-git--version-control-workflows)

---

## 1. Quick Command Cheat Sheet

All commands are executed from the `stocksense/` directory:

| Task | Command |
|---|---|
| **Install Dependencies** | `npm install` |
| **Generate Prisma Client** | `npx prisma generate` |
| **Sync Database Schema** | `npx prisma db push` |
| **Seed Database** | `node prisma/seed.js` |
| **Start Dev Server** | `npm run dev` |
| **Start Dev on Custom Port** | `npm run dev -- -p 3001` |
| **Open Database GUI** | `npx prisma studio` |
| **Type Check** | `npx tsc --noEmit` |
| **Lint Code** | `npm run lint` |
| **Build for Production** | `npm run build` |
| **Start Production Server** | `npm run start` |

---

## 2. Environment & Setup Commands

### Verify Node.js and NPM
```bash
# Check Node.js version (v18.17+ required, v20+ recommended)
node -v

# Check npm version
npm -v
```

### Environment File Setup (.env)
Create `stocksense/.env` with your authentication secrets:

**Windows (PowerShell):**
```powershell
# Create .env file with defaults
@"
NEXTAUTH_SECRET=stocksense-super-secret-key-123
NEXTAUTH_URL=http://localhost:3000
"@ | Out-File -Encoding utf8 stocksense/.env
```

**Linux / macOS (Bash):**
```bash
cat << 'EOF' > stocksense/.env
NEXTAUTH_SECRET=stocksense-super-secret-key-123
NEXTAUTH_URL=http://localhost:3000
EOF
```

### Generate a Cryptographically Secure NextAuth Secret
```bash
# Using Node.js crypto (Cross-platform)
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Using OpenSSL (Linux / macOS / Git Bash)
openssl rand -base64 32
```

---

## 3. Package Management

Run these inside `stocksense/`:

### Install Dependencies
```bash
# Standard install (recommended)
npm install

# Clean install based on package-lock.json (useful for CI/CD or reproducible builds)
npm ci

# Install with yarn
yarn install

# Install with pnpm
pnpm install

# Install with bun
bun install
```

### Dependency Auditing & Security
```bash
# Scan installed packages for vulnerabilities
npm audit

# Automatically fix non-breaking vulnerabilities
npm audit fix

# Force fix vulnerabilities (including major/breaking changes)
npm audit fix --force
```

### Adding & Removing Packages
```bash
# Install a production dependency
npm install <package-name>

# Install a development dependency
npm install -D <package-name>

# Uninstall a package
npm uninstall <package-name>

# Check for outdated packages
npm outdated
```

---

## 4. Development Server Variations

All commands should be executed from the `stocksense/` directory:

### Standard Dev Server
```bash
npm run dev
# or
npx next dev
```
*Accessible at `http://localhost:3000`*

### Custom Port
```bash
# Run on port 3001
npm run dev -- -p 3001
# or
npx next dev -p 3001

# Run on port 8080
npm run dev -- -p 8080
# or
npx next dev -p 8080
```

### Expose on Local Network (LAN Access for mobile / multi-device testing)
```bash
# Listen on all IPv4 addresses (0.0.0.0)
npm run dev -- -H 0.0.0.0
# or
npx next dev -H 0.0.0.0 -p 3000
```
*Accessible at `http://<your-machine-local-ip>:3000` from any device on your Wi-Fi.*

### Turbo Mode (Faster Rust-based bundler)
```bash
npm run dev -- --turbo
# or
npx next dev --turbo
```

### Local HTTPS (Experimental)
```bash
npx next dev --experimental-https
```

---

## 5. Production Build & Run

### Standard Production Build
```bash
cd stocksense

# 1. Build optimized application
npm run build
# or
npx next build

# 2. Run the production server
npm run start
# or
npx next start
```

### Production Server on Custom Port / Host
```bash
# Custom port 8080
npm run start -- -p 8080

# Listen on all interfaces on port 3000
npm run start -- -H 0.0.0.0 -p 3000
```

### Build with Bundle Analyzer (if @next/bundle-analyzer is installed)
```bash
# Linux / macOS
ANALYZE=true npm run build

# Windows (PowerShell)
$env:ANALYZE="true"; npm run build
```

---

## 6. Prisma ORM & Database Operations

All Prisma commands run from `stocksense/`.

### Client Generation
```bash
# Generate the Prisma client after schema changes
npx prisma generate

# Watch schema for changes and auto-regenerate client
npx prisma generate --watch
```

### Database Synchronization (Schema Prototyping)
```bash
# Push schema changes directly to SQLite (recommended for development)
npx prisma db push

# Force push and reset database (Warning: Drops all data!)
npx prisma db push --force-reset

# Push even if data loss could occur
npx prisma db push --accept-data-loss
```

### Database Migrations (Production / Strict Versioning)
```bash
# Create and apply a new migration
npx prisma migrate dev --name <migration_name>

# Example:
npx prisma migrate dev --name add_supplier_model

# Apply pending migrations in production / CI
npx prisma migrate deploy

# Check migration status
npx prisma migrate status

# Reset database, apply all migrations from scratch, and run seed script
npx prisma migrate reset
```

### Database Seeding
```bash
# Run the built-in seed script (creates Warehouse, Locations, Products, Initial Stock & Moves)
node prisma/seed.js

# If prisma.seed is configured in package.json:
npx prisma db seed
```

### Schema Formatting & Validation
```bash
# Auto-format prisma/schema.prisma
npx prisma format

# Validate schema syntax and relations
npx prisma validate
```

### Database Introspection (Pull schema from existing SQLite database)
```bash
npx prisma db pull
```

### Complete Database Reset (Fresh Start)

**Windows (PowerShell):**
```powershell
cd stocksense
Remove-Item -Force prisma/dev.db -ErrorAction SilentlyContinue
npx prisma db push
node prisma/seed.js
```

**Linux / macOS (Bash):**
```bash
cd stocksense
rm -f prisma/dev.db
npx prisma db push
node prisma/seed.js
```

---

## 7. Prisma Studio (Visual Database GUI)

Prisma Studio gives you an interactive web interface to view, filter, insert, edit, and delete database records.

```bash
cd stocksense

# Default launch (opens on http://localhost:5555)
npx prisma studio

# Run on a custom port
npx prisma studio --port 5556

# Run in headless mode without automatically opening browser
npx prisma studio --browser none

# Run bound to all network interfaces
npx prisma studio --port 5555 --hostname 0.0.0.0
```

---

## 8. Direct SQLite Database Commands

The SQLite file is located at `stocksense/prisma/dev.db`.

### Using the `sqlite3` CLI tool
```bash
# Open interactive SQLite shell
sqlite3 prisma/dev.db

# List all tables
sqlite3 prisma/dev.db ".tables"

# View schema of all tables
sqlite3 prisma/dev.db ".schema"

# View schema of a specific table
sqlite3 prisma/dev.db ".schema Product"

# Run a query directly
sqlite3 prisma/dev.db "SELECT id, name, sku, cost FROM Product;"

# Pretty table format query
sqlite3 -header -column prisma/dev.db "SELECT sku, name, cost, minStock FROM Product;"

# Count records across tables
sqlite3 prisma/dev.db "SELECT count(*) FROM User;"
sqlite3 prisma/dev.db "SELECT count(*) FROM Product;"
sqlite3 prisma/dev.db "SELECT count(*) FROM Move;"
```

### Backing Up the SQLite Database
**Windows (PowerShell):**
```powershell
Copy-Item stocksense/prisma/dev.db stocksense/prisma/dev_backup.db
```

**Linux / macOS (Bash):**
```bash
cp stocksense/prisma/dev.db stocksense/prisma/dev_backup.db
```

**Using SQLite Online Backup (safest for active databases):**
```bash
sqlite3 stocksense/prisma/dev.db ".backup stocksense/prisma/dev_backup.db"
```

---

## 9. Code Quality, Linting & Type Checking

Run these inside `stocksense/`:

### ESLint
```bash
# Run Next.js ESLint check
npm run lint
# or
npx next lint

# Automatically fix fixable ESLint warnings & errors
npx next lint --fix

# Lint a specific folder
npx next lint --dir src
```

### TypeScript Type Checking
```bash
# Check TypeScript types across the entire project without emitting JS files
npx tsc --noEmit

# Type check with watch mode
npx tsc --noEmit --watch
```

### Full Validation Suite (CI Simulation)
**Windows (PowerShell):**
```powershell
cd stocksense
npm run lint; npx tsc --noEmit; npm run build
```

**Linux / macOS (Bash):**
```bash
cd stocksense
npm run lint && npx tsc --noEmit && npm run build
```

---

## 10. Health Checks & API Testing

Use these commands while the development server (`http://localhost:3000`) is running.

### Using `curl`

```bash
# 1. Health check root redirect (Should return HTTP 307 to /login)
curl -I http://localhost:3000

# 2. Check login page (Should return HTTP 200)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/login

# 3. Check sign up page (Should return HTTP 200)
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/signup

# 4. Check NextAuth session endpoint (Returns null or active session JSON)
curl -s http://localhost:3000/api/auth/session

# 5. Check NextAuth CSRF token
curl -s http://localhost:3000/api/auth/csrf

# 6. Test Signup API endpoint with JSON payload
curl -X POST http://localhost:3000/api/signup \
  -H "Content-Type: application/json" \
  -d "{\"loginId\":\"testuser\",\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"Secret123!\"}"
```

### Using Windows PowerShell (`Invoke-RestMethod` / `Invoke-WebRequest`)

```powershell
# 1. Check HTTP Status
(Invoke-WebRequest -Uri "http://localhost:3000/login" -Method Get).StatusCode

# 2. Query NextAuth session API
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/session"

# 3. Query NextAuth CSRF token
Invoke-RestMethod -Uri "http://localhost:3000/api/auth/csrf"

# 4. Test Signup API
$body = @{
    loginId = "testadmin"
    name = "Test Admin"
    email = "admin@example.com"
    password = "AdminPassword123!"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/signup" -Method Post -Body $body -ContentType "application/json"
```

---

## 11. Cache Clearing & Troubleshooting

### Clean Next.js Build Cache
If you encounter stale pages, unexpected hydration mismatches, or build errors:

**Windows (PowerShell):**
```powershell
cd stocksense
Remove-Item -Recurse -Force .next
```

**Linux / macOS (Bash):**
```bash
cd stocksense
rm -rf .next
```

### Nuclear Reset (Clean Reinstall)
Wipes `node_modules`, `.next`, and `package-lock.json` and performs a clean install:

**Windows (PowerShell):**
```powershell
cd stocksense
Remove-Item -Recurse -Force node_modules, .next, package-lock.json -ErrorAction SilentlyContinue
npm install
npx prisma generate
```

**Linux / macOS (Bash):**
```bash
cd stocksense
rm -rf node_modules .next package-lock.json
npm install
npx prisma generate
```

---

## 12. Port Management & Process Killing

If port `3000` (Next.js) or port `5555` (Prisma Studio) is already occupied:

### Windows (PowerShell)
```powershell
# Find process ID using port 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object OwningProcess

# Kill process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force

# Kill process using port 5555 (Prisma Studio)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5555).OwningProcess -ErrorAction SilentlyContinue | Stop-Process -Force
```

### Windows (Command Prompt)
```cmd
# Find PID
netstat -ano | findstr :3000

# Kill process by PID
taskkill /PID <PID> /F
```

### Linux / macOS (Bash)
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process on port 5555
lsof -ti:5555 | xargs kill -9

# Alternative using fuser
fuser -k 3000/tcp
fuser -k 5555/tcp
```

---

## 13. Git & Version Control Workflows

Run these from the repository root:

```bash
# Check repository status
git status

# Inspect changes
git diff

# Stage all modified files
git add .

# Commit changes
git commit -m "feat: your descriptive commit message"

# Push to remote repository
git push origin main

# Create and switch to a new feature branch
git checkout -b feature/new-warehouse-ui

# Pull latest updates from remote
git pull origin main
```
