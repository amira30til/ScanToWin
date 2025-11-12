#!/bin/bash

# Script to fix image pull errors

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Fix Image Pull Errors              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

NAMESPACE="mern-app"

echo -e "${YELLOW}🔍 Checking available solutions...${NC}"
echo ""

# Check if local images exist
BACKEND_LOCAL=$(docker images | grep "mern-backend" | grep "latest" | awk '{print $1":"$2}' | head -1)
FRONTEND_LOCAL=$(docker images | grep "mern-frontend" | grep "latest" | awk '{print $1":"$2}' | head -1)

echo "Option 1: Use Local Images (If Available)"
echo "----------------------------------------"
if [ ! -z "$BACKEND_LOCAL" ] && [ ! -z "$FRONTEND_LOCAL" ]; then
    echo -e "${GREEN}✅ Local images found!${NC}"
    echo "  Backend:  $BACKEND_LOCAL"
    echo "  Frontend: $FRONTEND_LOCAL"
    echo ""
    read -p "Use local images? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        # Detect cluster type
        if kubectl config current-context | grep -q "minikube"; then
            echo -e "${YELLOW}📦 Loading images into Minikube...${NC}"
            minikube image load mern-backend:latest || echo "Backend image load failed"
            minikube image load mern-frontend:latest || echo "Frontend image load failed"
            
            # Update deployments
            echo -e "${YELLOW}🔄 Updating deployments...${NC}"
            kubectl set image deployment/backend backend=mern-backend:latest -n ${NAMESPACE}
            kubectl set image deployment/frontend frontend=mern-frontend:latest -n ${NAMESPACE}
            
        elif kubectl config current-context | grep -q "kind"; then
            CLUSTER_NAME=$(kubectl config current-context | sed 's/kind-//')
            echo -e "${YELLOW}📦 Loading images into Kind...${NC}"
            kind load docker-image mern-backend:latest --name ${CLUSTER_NAME} || echo "Backend image load failed"
            kind load docker-image mern-frontend:latest --name ${CLUSTER_NAME} || echo "Frontend image load failed"
            
            # Update deployments
            echo -e "${YELLOW}🔄 Updating deployments...${NC}"
            kubectl set image deployment/backend backend=mern-backend:latest -n ${NAMESPACE}
            kubectl set image deployment/frontend frontend=mern-frontend:latest -n ${NAMESPACE}
        else
            echo -e "${YELLOW}📦 Using local images directly...${NC}"
            kubectl set image deployment/backend backend=mern-backend:latest -n ${NAMESPACE}
            kubectl set image deployment/frontend frontend=mern-frontend:latest -n ${NAMESPACE}
        fi
        
        echo -e "${GREEN}✅ Deployments updated!${NC}"
        echo ""
        echo "Waiting for pods to restart..."
        sleep 5
        kubectl get pods -n ${NAMESPACE}
        exit 0
    fi
else
    echo -e "${YELLOW}⚠️  Local images not found${NC}"
    echo ""
fi

echo ""
echo "Option 2: Make Docker Hub Repositories Public"
echo "----------------------------------------------"
echo "1. Go to: https://hub.docker.com/r/amira30til/mern-backend"
echo "2. Go to Settings → Visibility"
echo "3. Change to Public"
echo "4. Repeat for: https://hub.docker.com/r/amira30til/mern-frontend"
echo ""
read -p "Have you made repositories public? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🔄 Restarting deployments...${NC}"
    kubectl rollout restart deployment/backend -n ${NAMESPACE}
    kubectl rollout restart deployment/frontend -n ${NAMESPACE}
    
    echo ""
    echo -e "${YELLOW}⏳ Waiting for pods...${NC}"
    sleep 10
    kubectl get pods -n ${NAMESPACE} -w
else
    echo ""
    echo "Option 3: Build Images Locally"
    echo "-------------------------------"
    echo "Build images from Docker Compose:"
    echo "  cd /home/amira/Desktop/MERN"
    echo "  docker compose build"
    echo ""
    echo "Then run this script again to use local images."
fi
