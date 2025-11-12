#!/bin/bash

# Database Seeding Script
# This script helps you seed your database easily

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

cd /home/amira/Desktop/MERN

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Database Seeding Script              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if backend container is running
if ! docker compose ps backend | grep -q "Up"; then
    echo -e "${RED}❌ Backend container is not running!${NC}"
    echo -e "${YELLOW}Starting services...${NC}"
    docker compose up -d
    echo -e "${YELLOW}Waiting for services to be ready (10 seconds)...${NC}"
    sleep 10
fi

echo -e "${YELLOW}Select seeding option:${NC}"
echo "1) Seed Admin Only (creates super admin user)"
echo "2) Seed All Data (clears and seeds everything)"
echo "3) Verify Admin (check if admin exists)"
echo ""
read -p "Enter choice [1-3]: " choice

case $choice in
    1)
        echo -e "${YELLOW}🌱 Seeding admin user...${NC}"
        docker compose exec backend npm run seed:admin
        echo ""
        echo -e "${GREEN}✅ Admin seeding completed!${NC}"
        echo ""
        echo -e "${YELLOW}📧 Login credentials:${NC}"
        echo "   Email: admin@example.com"
        echo "   Password: admin123"
        ;;
    2)
        echo -e "${YELLOW}🌱 Seeding all data...${NC}"
        echo -e "${RED}⚠️  Warning: This will delete all existing data!${NC}"
        read -p "Continue? (y/n): " confirm
        if [[ $confirm == [yY] ]]; then
            docker compose exec backend npm run seed:all
            echo ""
            echo -e "${GREEN}✅ All data seeded successfully!${NC}"
        else
            echo -e "${YELLOW}Cancelled.${NC}"
        fi
        ;;
    3)
        echo -e "${YELLOW}🔍 Verifying admin...${NC}"
        docker compose exec backend npm run verify:admin
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Test login: curl -X POST http://localhost:5000/api/auth -H 'Content-Type: application/json' -d '{\"email\":\"admin@example.com\",\"password\":\"admin123\"}'"
echo "2. Open browser: http://localhost:5173"
echo "3. Login with: admin@example.com / admin123"
echo ""
