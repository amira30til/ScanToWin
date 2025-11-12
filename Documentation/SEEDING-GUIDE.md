# 🌱 Database Seeding Guide

This guide shows you how to run seeding scripts in Docker containers.

## 📋 Available Seeding Scripts

1. **seed-admin.js** - Creates a super admin user
2. **seed-all.js** - Seeds all data (admin, users, games, rewards, etc.)

---

## 🐳 Method 1: Run Seeding Scripts in Running Container

### Step 1: Check if backend container is running

```bash
cd /home/amira/Desktop/MERN
docker compose ps
```

### Step 2: Run seeding scripts

#### Option A: Seed Admin Only

```bash
# Run seed-admin.js
docker compose exec backend npm run seed:admin
```

**Expected Output:**
```
✅ Connected to MongoDB
✅ Super admin created successfully!

📧 Login credentials:
   Email: admin@example.com
   Password: admin123
```

#### Option B: Seed All Data

```bash
# Run seed-all.js (seeds everything)
docker compose exec backend npm run seed:all
```

**This will create:**
- Super admin user
- Regular users
- Games
- Actions
- Rewards
- Shops
- And more...

---

## 🔄 Method 2: Run Seeding Scripts Directly

### Run seed-admin.js directly:

```bash
docker compose exec backend node seed-admin.js
```

### Run seed-all.js directly:

```bash
docker compose exec backend node seed-all.js
```

---

## 🧪 Method 3: Run Seeding Scripts One-Time Container

If the backend container is not running, you can run seeding in a one-time container:

```bash
# Seed admin
docker compose run --rm backend npm run seed:admin

# Seed all
docker compose run --rm backend npm run seed:all
```

---

## ✅ Testing After Seeding

### 1. Test Admin Login

```bash
# Test login endpoint
curl -X POST http://localhost:5000/api/auth \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

### 2. Test in Browser

1. Open frontend: http://localhost:5173
2. Try logging in with:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`

### 3. Verify Admin Exists

```bash
# Check if admin was created (using MongoDB shell)
docker compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin scan2win

# Then in MongoDB shell:
use scan2win
db.admins.find().pretty()
exit
```

---

## 🔄 Re-running Seeding Scripts

### To Re-seed Admin:

```bash
# The seed-admin.js script automatically deletes existing admin and recreates it
docker compose exec backend npm run seed:admin
```

### To Re-seed All Data:

```bash
# The seed-all.js script clears all data first, then seeds fresh data
docker compose exec backend npm run seed:all
```

**⚠️ Warning:** `seed-all.js` will **delete all existing data** before seeding!

---

## 📝 Quick Reference Commands

```bash
# Check container status
docker compose ps

# Seed admin only
docker compose exec backend npm run seed:admin

# Seed all data
docker compose exec backend npm run seed:all

# Run seed script directly
docker compose exec backend node seed-admin.js
docker compose exec backend node seed-all.js

# View backend logs
docker compose logs backend -f

# Test login after seeding
curl -X POST http://localhost:5000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

---

## 🆘 Troubleshooting

### Issue: "MONGO_URI is not defined"

**Solution:** Make sure `.env` file exists and has `MONGO_URI`:
```bash
# Check .env file
cat .env | grep MONGO_URI

# Should show:
# MONGO_URI=mongodb://admin:admin123@mongodb:27017/scan2win?authSource=admin
```

### Issue: "Cannot connect to MongoDB"

**Solution:** Make sure MongoDB container is running:
```bash
docker compose ps mongodb
# Should show: Up (healthy)

# If not running:
docker compose up -d mongodb
```

### Issue: "User already exists"

**Solution:** The seed-admin.js script automatically handles this by deleting and recreating. If you still have issues:
```bash
# Restart backend container
docker compose restart backend

# Then run seed again
docker compose exec backend npm run seed:admin
```

---

## 🎯 Complete Workflow Example

```bash
# 1. Make sure services are running
cd /home/amira/Desktop/MERN
docker compose up -d

# 2. Wait for services to be ready
sleep 10

# 3. Seed admin user
docker compose exec backend npm run seed:admin

# 4. Test login
curl -X POST http://localhost:5000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 5. Open browser and login
# Frontend: http://localhost:5173
# Email: admin@example.com
# Password: admin123
```

---

## 📚 Additional Information

### Default Admin Credentials (from seed-admin.js):
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** `SUPER_ADMIN`

### What seed-all.js Creates:
- Super admin user
- Regular users (test users)
- Games
- Actions
- Rewards and reward categories
- Shops
- Game assignments
- And more test data

---

**Happy Seeding! 🌱**
