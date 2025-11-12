#!/bin/bash

# Simple Docker Compose Test Script
# This tests the Docker Compose setup step by step

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /home/amira/Desktop/MERN

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Docker Compose Test                  ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Step 1: Check .env file
echo -e "${YELLOW}Step 1: Checking .env file...${NC}"
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env from .env.example...${NC}"
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}⚠️  Please review .env file and update values if needed${NC}"
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Detect Docker Compose command (v1 or v2)
if command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE="docker-compose"
elif docker compose version &> /dev/null; then
    DOCKER_COMPOSE="docker compose"
else
    echo -e "${RED}❌ Docker Compose not found${NC}"
    exit 1
fi

# Step 2: Stop any running containers
echo -e "${YELLOW}Step 2: Stopping any existing containers...${NC}"
$DOCKER_COMPOSE down -v 2>/dev/null || true
echo -e "${GREEN}✅ Cleaned up${NC}"
echo ""

# Step 3: Build images
echo -e "${YELLOW}Step 3: Building Docker images...${NC}"
echo -e "${YELLOW}This may take 2-5 minutes...${NC}"
if $DOCKER_COMPOSE build; then
    echo -e "${GREEN}✅ Images built successfully${NC}"
else
    echo -e "${RED}❌ Build failed. Check errors above.${NC}"
    exit 1
fi
echo ""

# Step 4: Start services
echo -e "${YELLOW}Step 4: Starting services...${NC}"
if $DOCKER_COMPOSE up -d; then
    echo -e "${GREEN}✅ Services started${NC}"
else
    echo -e "${RED}❌ Failed to start services${NC}"
    exit 1
fi
echo ""

# Step 5: Wait for services
echo -e "${YELLOW}Step 5: Waiting for services to be ready (30 seconds)...${NC}"
sleep 30
echo ""

# Step 6: Check status
echo -e "${YELLOW}Step 6: Checking service status...${NC}"
$DOCKER_COMPOSE ps
echo ""

# Step 7: Test backend
echo -e "${YELLOW}Step 7: Testing backend health endpoint...${NC}"
if curl -f -s http://localhost:5000/api/health > /dev/null; then
    echo -e "${GREEN}✅ Backend is healthy!${NC}"
    curl -s http://localhost:5000/api/health | jq . 2>/dev/null || curl -s http://localhost:5000/api/health
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    echo -e "${YELLOW}Checking backend logs...${NC}"
    $DOCKER_COMPOSE logs --tail=20 backend
fi
echo ""

# Step 8: Test frontend
echo -e "${YELLOW}Step 8: Testing frontend health endpoint...${NC}"
if curl -f -s http://localhost:5173/health > /dev/null; then
    echo -e "${GREEN}✅ Frontend is healthy!${NC}"
    curl -s http://localhost:5173/health
else
    echo -e "${RED}❌ Frontend health check failed${NC}"
    echo -e "${YELLOW}Checking frontend logs...${NC}"
    $DOCKER_COMPOSE logs --tail=20 frontend
fi
echo ""

# Step 9: Check MongoDB connection
echo -e "${YELLOW}Step 9: Checking MongoDB connection...${NC}"
if $DOCKER_COMPOSE logs backend | grep -q "MongoDB connected"; then
    echo -e "${GREEN}✅ MongoDB connection successful${NC}"
else
    echo -e "${YELLOW}⚠️  MongoDB connection not found in logs (may still be connecting)${NC}"
    $DOCKER_COMPOSE logs --tail=10 mongodb
fi
echo ""

# Summary
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}Test Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}✅ Docker Compose test completed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Open browser: http://localhost:5173"
echo "  2. Test backend API: http://localhost:5000/api/health"
echo "  3. View logs: $DOCKER_COMPOSE logs -f"
echo "  4. Stop services: $DOCKER_COMPOSE down"
echo ""
