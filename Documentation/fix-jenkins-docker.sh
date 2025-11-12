#!/bin/bash

# Fix Jenkins Docker Access
# This script recreates Jenkins with Docker socket access

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Fix Jenkins Docker Access            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Stop and remove existing Jenkins
if docker ps -a | grep -q jenkins; then
    echo -e "${YELLOW}Stopping existing Jenkins container...${NC}"
    docker stop jenkins 2>/dev/null || true
    docker rm jenkins 2>/dev/null || true
fi

# Create Jenkins with Docker socket access
echo -e "${YELLOW}Creating Jenkins with Docker access...${NC}"
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v $(which docker):/usr/bin/docker \
  --group-add $(getent group docker | cut -d: -f3) \
  jenkins/jenkins:lts

echo -e "${GREEN}✅ Jenkins recreated with Docker access${NC}"
echo ""
echo -e "${YELLOW}Waiting for Jenkins to initialize (30 seconds)...${NC}"
sleep 30

# Get admin password
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
    echo -e "${YELLOW}Docker is now available in Jenkins!${NC}"
else
    echo -e "${YELLOW}Jenkins is still initializing...${NC}"
    echo -e "${YELLOW}Get password later with:${NC}"
    echo "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword"
fi
