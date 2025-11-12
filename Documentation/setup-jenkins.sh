#!/bin/bash

# Jenkins Setup Script
# This script helps set up and configure Jenkins

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Jenkins Setup Script                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if Jenkins container exists
if docker ps -a | grep -q jenkins; then
    echo -e "${YELLOW}Jenkins container already exists${NC}"
    
    # Check if it's running
    if docker ps | grep -q jenkins; then
        echo -e "${GREEN}✅ Jenkins is running${NC}"
    else
        echo -e "${YELLOW}Starting Jenkins container...${NC}"
        docker start jenkins
        sleep 5
    fi
else
    echo -e "${YELLOW}Creating Jenkins container...${NC}"
    docker run -d \
      --name jenkins \
      -p 8080:8080 \
      -p 50000:50000 \
      -v jenkins_home:/var/jenkins_home \
      jenkins/jenkins:lts
    
    echo -e "${GREEN}✅ Jenkins container created${NC}"
    echo -e "${YELLOW}Waiting for Jenkins to initialize (this may take 1-2 minutes)...${NC}"
    sleep 30
fi

# Wait for Jenkins to be ready
echo -e "${YELLOW}Waiting for Jenkins to be ready...${NC}"
MAX_WAIT=120
WAITED=0

while [ $WAITED -lt $MAX_WAIT ]; do
    if docker exec jenkins test -f /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null; then
        break
    fi
    echo -n "."
    sleep 2
    WAITED=$((WAITED + 2))
done

echo ""

if docker exec jenkins test -f /var/jenkins_home/secrets/initialAdminPassword 2>/dev/null; then
    echo -e "${GREEN}✅ Jenkins is ready!${NC}"
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${YELLOW}Jenkins Admin Password:${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo ""
    echo -e "${GREEN}🌐 Access Jenkins at: http://localhost:8080${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "1. Open http://localhost:8080 in your browser"
    echo "2. Enter the password above"
    echo "3. Install suggested plugins"
    echo "4. Create admin user"
    echo "5. Configure Jenkins"
    echo ""
else
    echo -e "${RED}❌ Jenkins is taking longer than expected to initialize${NC}"
    echo -e "${YELLOW}Check logs: docker logs jenkins${NC}"
    echo -e "${YELLOW}Try again in a few minutes${NC}"
fi
