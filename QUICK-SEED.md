# 🚀 Quick Seeding Guide

## ✅ Seeding Works! Here's How to Use It

### 🎯 **Easiest Way - Use the Script:**

```bash
cd /home/amira/Desktop/MERN
./seed-database.sh
```

Then select option `1` to seed admin user.

---

### 📝 **Manual Commands:**

#### **Seed Admin User:**
```bash
docker compose exec backend npm run seed:admin
```

#### **Seed All Data:**
```bash
docker compose exec backend npm run seed:all
```

---

## ✅ **Test Login:**

### **Option 1: Command Line**
```bash
curl -X POST http://localhost:5000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### **Option 2: Browser**
1. Open: http://localhost:5173
2. Login with:
   - **Email:** `admin@example.com`
   - **Password:** `admin123`

---

## 🔄 **Re-run Seeding:**

The scripts automatically handle existing data:
- `seed-admin.js` - Deletes and recreates admin
- `seed-all.js` - Clears all data and seeds fresh

Just run the command again!

---

## 📋 **Default Credentials:**

- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Role:** `SUPER_ADMIN`

---

**That's it! Your database is seeded and ready to use! 🎉**
