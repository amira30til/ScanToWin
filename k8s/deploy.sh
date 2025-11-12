#!/bin/bash

# MERN Stack Kubernetes Deployment Script
# This script helps deploy the MERN application to Kubernetes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
NAMESPACE="mern-app"
DOCKER_HUB_USERNAME="${DOCKER_HUB_USERNAME:-your-dockerhub-username}"

echo -e "${GREEN}🚀 MERN Stack Kubernetes Deployment${NC}"
echo ""

# Check if kubectl is installed
if ! command -v kubectl &> /dev/null; then
    echo -e "${RED}❌ kubectl is not installed. Please install kubectl first.${NC}"
    exit 1
fi

# Check if cluster is accessible
if ! kubectl cluster-info &> /dev/null; then
    echo -e "${RED}❌ Cannot connect to Kubernetes cluster. Please check your kubeconfig.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Kubernetes cluster is accessible${NC}"

# Create namespace
echo -e "${YELLOW}📦 Creating namespace...${NC}"
kubectl apply -f namespace.yaml

# Apply ConfigMap and Secrets
echo -e "${YELLOW}⚙️  Applying ConfigMap and Secrets...${NC}"
kubectl apply -f configmap.yaml

# Deploy MongoDB
echo -e "${YELLOW}🍃 Deploying MongoDB...${NC}"
kubectl apply -f mongodb/deployment.yaml
kubectl apply -f mongodb/service.yaml

# Wait for MongoDB to be ready
echo -e "${YELLOW}⏳ Waiting for MongoDB to be ready...${NC}"
kubectl wait --for=condition=ready pod -l app=mongodb -n ${NAMESPACE} --timeout=120s

# Update backend deployment with Docker Hub image
echo -e "${YELLOW}🔧 Updating backend deployment with image: ${DOCKER_HUB_USERNAME}/mern-backend:latest${NC}"
sed "s|your-dockerhub-username|${DOCKER_HUB_USERNAME}|g" backend/deployment.yaml | kubectl apply -f -
kubectl apply -f backend/service.yaml

# Update frontend deployment with Docker Hub image
echo -e "${YELLOW}🔧 Updating frontend deployment with image: ${DOCKER_HUB_USERNAME}/mern-frontend:latest${NC}"
sed "s|your-dockerhub-username|${DOCKER_HUB_USERNAME}|g" frontend/deployment.yaml | kubectl apply -f -
kubectl apply -f frontend/service.yaml

# Deploy Ingress (optional)
read -p "Do you want to deploy Ingress? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}🌐 Deploying Ingress...${NC}"
    kubectl apply -f ingress.yaml
fi

# Wait for deployments to be ready
echo -e "${YELLOW}⏳ Waiting for deployments to be ready...${NC}"
kubectl wait --for=condition=available deployment/backend -n ${NAMESPACE} --timeout=120s || true
kubectl wait --for=condition=available deployment/frontend -n ${NAMESPACE} --timeout=120s || true

# Show deployment status
echo ""
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo ""
echo -e "${GREEN}📊 Deployment Status:${NC}"
kubectl get pods -n ${NAMESPACE}
echo ""
echo -e "${GREEN}🌐 Services:${NC}"
kubectl get svc -n ${NAMESPACE}
echo ""
echo -e "${YELLOW}💡 To access services, use port-forwarding:${NC}"
echo "  Backend:  kubectl port-forward -n ${NAMESPACE} svc/backend-service 5000:5000"
echo "  Frontend: kubectl port-forward -n ${NAMESPACE} svc/frontend-service 8080:80"
echo ""
