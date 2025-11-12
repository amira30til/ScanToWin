#!/bin/bash

# Safe Kubernetes Deployment Script
# This script safely deploys to Kubernetes without affecting Docker Compose

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
NAMESPACE="mern-app"
DOCKER_HUB_USERNAME="amira30til"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Safe Kubernetes Deployment         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to check prerequisites
check_prerequisites() {
    echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"
    
    # Check kubectl
    if ! command -v kubectl &> /dev/null; then
        echo -e "${RED}❌ kubectl is not installed${NC}"
        echo "Install: https://kubernetes.io/docs/tasks/tools/"
        exit 1
    fi
    echo -e "${GREEN}✅ kubectl installed${NC}"
    
    # Check cluster connection
    if ! kubectl cluster-info &> /dev/null; then
        echo -e "${RED}❌ Cannot connect to Kubernetes cluster${NC}"
        echo ""
        echo "Options to set up a cluster:"
        echo "1. Minikube: minikube start --memory=4096 --cpus=2"
        echo "2. Kind: kind create cluster --name mern-cluster"
        exit 1
    fi
    echo -e "${GREEN}✅ Kubernetes cluster accessible${NC}"
    
    # Check if Docker Compose is running (warn but don't stop)
    if docker compose ps 2>/dev/null | grep -q "Up"; then
        echo -e "${YELLOW}⚠️  Docker Compose is running${NC}"
        echo -e "${YELLOW}   This won't affect Kubernetes deployment${NC}"
    fi
    
    echo ""
}

# Function to verify images exist
verify_images() {
    echo -e "${YELLOW}🔍 Verifying Docker Hub images...${NC}"
    
    BACKEND_IMAGE="${DOCKER_HUB_USERNAME}/mern-backend:latest"
    FRONTEND_IMAGE="${DOCKER_HUB_USERNAME}/mern-frontend:latest"
    
    echo "Checking: ${BACKEND_IMAGE}"
    if docker manifest inspect "${BACKEND_IMAGE}" &>/dev/null || \
       curl -s "https://hub.docker.com/v2/repositories/${DOCKER_HUB_USERNAME}/mern-backend/tags/latest" | grep -q "name"; then
        echo -e "${GREEN}✅ Backend image found${NC}"
    else
        echo -e "${YELLOW}⚠️  Backend image may not exist on Docker Hub${NC}"
        echo "   Continuing anyway..."
    fi
    
    echo "Checking: ${FRONTEND_IMAGE}"
    if docker manifest inspect "${FRONTEND_IMAGE}" &>/dev/null || \
       curl -s "https://hub.docker.com/v2/repositories/${DOCKER_HUB_USERNAME}/mern-frontend/tags/latest" | grep -q "name"; then
        echo -e "${GREEN}✅ Frontend image found${NC}"
    else
        echo -e "${YELLOW}⚠️  Frontend image may not exist on Docker Hub${NC}"
        echo "   Continuing anyway..."
    fi
    
    echo ""
}

# Function to create namespace
create_namespace() {
    echo -e "${YELLOW}📦 Creating namespace...${NC}"
    kubectl apply -f "${SCRIPT_DIR}/namespace.yaml"
    echo -e "${GREEN}✅ Namespace created${NC}"
    echo ""
}

# Function to apply config
apply_config() {
    echo -e "${YELLOW}⚙️  Applying configuration...${NC}"
    kubectl apply -f "${SCRIPT_DIR}/configmap.yaml"
    echo -e "${GREEN}✅ Configuration applied${NC}"
    echo ""
}

# Function to deploy MongoDB
deploy_mongodb() {
    echo -e "${YELLOW}🍃 Deploying MongoDB...${NC}"
    kubectl apply -f "${SCRIPT_DIR}/mongodb/deployment.yaml"
    kubectl apply -f "${SCRIPT_DIR}/mongodb/service.yaml"
    
    echo -e "${YELLOW}⏳ Waiting for MongoDB to be ready...${NC}"
    if kubectl wait --for=condition=ready pod -l app=mongodb -n ${NAMESPACE} --timeout=180s 2>/dev/null; then
        echo -e "${GREEN}✅ MongoDB is ready${NC}"
    else
        echo -e "${YELLOW}⚠️  MongoDB may still be starting...${NC}"
        echo "   Check status: kubectl get pods -n ${NAMESPACE}"
    fi
    echo ""
}

# Function to deploy backend
deploy_backend() {
    echo -e "${YELLOW}🔧 Deploying backend...${NC}"
    kubectl apply -f "${SCRIPT_DIR}/backend/deployment.yaml"
    kubectl apply -f "${SCRIPT_DIR}/backend/service.yaml"
    echo -e "${GREEN}✅ Backend deployment started${NC}"
    echo ""
}

# Function to deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}🎨 Deploying frontend...${NC}"
    kubectl apply -f "${SCRIPT_DIR}/frontend/deployment.yaml"
    kubectl apply -f "${SCRIPT_DIR}/frontend/service.yaml"
    echo -e "${GREEN}✅ Frontend deployment started${NC}"
    echo ""
}

# Function to wait for deployments
wait_for_deployments() {
    echo -e "${YELLOW}⏳ Waiting for deployments to be ready...${NC}"
    
    echo "Waiting for backend..."
    kubectl wait --for=condition=available deployment/backend -n ${NAMESPACE} --timeout=180s 2>/dev/null || \
        echo -e "${YELLOW}⚠️  Backend may still be starting...${NC}"
    
    echo "Waiting for frontend..."
    kubectl wait --for=condition=available deployment/frontend -n ${NAMESPACE} --timeout=180s 2>/dev/null || \
        echo -e "${YELLOW}⚠️  Frontend may still be starting...${NC}"
    
    echo ""
}

# Function to show status
show_status() {
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   Deployment Status                   ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${BLUE}📊 Pods:${NC}"
    kubectl get pods -n ${NAMESPACE}
    echo ""
    
    echo -e "${BLUE}🌐 Services:${NC}"
    kubectl get svc -n ${NAMESPACE}
    echo ""
    
    echo -e "${BLUE}📦 Deployments:${NC}"
    kubectl get deployments -n ${NAMESPACE}
    echo ""
}

# Function to show access instructions
show_access() {
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   Access Instructions                 ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo "To access the application:"
    echo ""
    echo -e "${YELLOW}Backend:${NC}"
    echo "  kubectl port-forward -n ${NAMESPACE} svc/backend-service 5000:5000"
    echo "  Then visit: http://localhost:5000/api/health"
    echo ""
    echo -e "${YELLOW}Frontend:${NC}"
    echo "  kubectl port-forward -n ${NAMESPACE} svc/frontend-service 8080:80"
    echo "  Then visit: http://localhost:8080"
    echo ""
    echo -e "${YELLOW}View logs:${NC}"
    echo "  Backend:  kubectl logs -f deployment/backend -n ${NAMESPACE}"
    echo "  Frontend: kubectl logs -f deployment/frontend -n ${NAMESPACE}"
    echo ""
    echo -e "${YELLOW}Delete deployment:${NC}"
    echo "  kubectl delete namespace ${NAMESPACE}"
    echo ""
}

# Main deployment flow
main() {
    check_prerequisites
    verify_images
    
    echo -e "${YELLOW}⚠️  This will deploy to Kubernetes${NC}"
    echo -e "${YELLOW}   Docker Compose will NOT be affected${NC}"
    echo ""
    read -p "Continue? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Deployment cancelled"
        exit 0
    fi
    echo ""
    
    create_namespace
    apply_config
    deploy_mongodb
    deploy_backend
    deploy_frontend
    
    # Wait a bit before checking status
    sleep 5
    
    wait_for_deployments
    show_status
    show_access
    
    echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}💡 Note: Docker Compose is still running independently${NC}"
    echo -e "${BLUE}   Kubernetes deployment uses different ports/services${NC}"
}

# Run main function
main
