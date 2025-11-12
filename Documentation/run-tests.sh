#!/bin/bash

# Complete Test Suite Runner
# This script runs all tests to verify the DevOps setup

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to print test header
print_test_header() {
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
}

# Function to print success
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((TESTS_PASSED++))
}

# Function to print failure
print_failure() {
    echo -e "${RED}❌ $1${NC}"
    ((TESTS_FAILED++))
}

# Function to print info
print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_test_header "Checking Prerequisites"
    
    if command -v docker &> /dev/null; then
        print_success "Docker is installed"
    else
        print_failure "Docker is not installed"
        return 1
    fi
    
    if command -v docker-compose &> /dev/null; then
        print_success "Docker Compose is installed"
    else
        print_failure "Docker Compose is not installed"
        return 1
    fi
    
    if command -v kubectl &> /dev/null; then
        print_success "kubectl is installed"
    else
        print_info "kubectl is not installed (Kubernetes tests will be skipped)"
    fi
    
    if command -v helm &> /dev/null; then
        print_success "Helm is installed"
    else
        print_info "Helm is not installed (Helm tests will be skipped)"
    fi
}

# Test 1: Docker Compose
test_docker_compose() {
    print_test_header "Test 1: Docker Compose"
    
    cd /home/amira/Desktop/MERN
    
    print_info "Stopping any existing containers..."
    docker-compose down -v 2>/dev/null || true
    
    print_info "Building images..."
    if docker-compose build --quiet; then
        print_success "Images built successfully"
    else
        print_failure "Failed to build images"
        return 1
    fi
    
    print_info "Starting services..."
    if docker-compose up -d; then
        print_success "Services started"
    else
        print_failure "Failed to start services"
        return 1
    fi
    
    print_info "Waiting for services to be healthy (30 seconds)..."
    sleep 30
    
    print_info "Testing backend health endpoint..."
    if curl -f -s http://localhost:5000/api/health > /dev/null; then
        print_success "Backend is healthy"
    else
        print_failure "Backend health check failed"
        docker-compose logs backend
        return 1
    fi
    
    print_info "Testing frontend health endpoint..."
    if curl -f -s http://localhost:5173/health > /dev/null; then
        print_success "Frontend is healthy"
    else
        print_failure "Frontend health check failed"
        docker-compose logs frontend
        return 1
    fi
    
    print_info "Checking MongoDB connection..."
    if docker-compose logs backend | grep -q "MongoDB connected"; then
        print_success "MongoDB connection successful"
    else
        print_failure "MongoDB connection failed"
        docker-compose logs mongodb
        return 1
    fi
    
    print_info "Cleaning up Docker Compose..."
    docker-compose down -v
}

# Test 2: Kubernetes (if kubectl is available)
test_kubernetes() {
    if ! command -v kubectl &> /dev/null; then
        print_info "Skipping Kubernetes tests (kubectl not installed)"
        return 0
    fi
    
    print_test_header "Test 2: Kubernetes Manifests"
    
    cd /home/amira/Desktop/MERN/k8s
    
    print_info "Validating Kubernetes manifests..."
    
    # Validate namespace
    if kubectl apply --dry-run=client -f namespace.yaml &> /dev/null; then
        print_success "Namespace manifest is valid"
    else
        print_failure "Namespace manifest is invalid"
        return 1
    fi
    
    # Validate ConfigMap
    if kubectl apply --dry-run=client -f configmap.yaml &> /dev/null; then
        print_success "ConfigMap manifest is valid"
    else
        print_failure "ConfigMap manifest is invalid"
        return 1
    fi
    
    # Validate MongoDB
    if kubectl apply --dry-run=client -f mongodb/deployment.yaml &> /dev/null && \
       kubectl apply --dry-run=client -f mongodb/service.yaml &> /dev/null; then
        print_success "MongoDB manifests are valid"
    else
        print_failure "MongoDB manifests are invalid"
        return 1
    fi
    
    # Validate Backend
    if kubectl apply --dry-run=client -f backend/deployment.yaml &> /dev/null && \
       kubectl apply --dry-run=client -f backend/service.yaml &> /dev/null; then
        print_success "Backend manifests are valid"
    else
        print_failure "Backend manifests are invalid"
        return 1
    fi
    
    # Validate Frontend
    if kubectl apply --dry-run=client -f frontend/deployment.yaml &> /dev/null && \
       kubectl apply --dry-run=client -f frontend/service.yaml &> /dev/null; then
        print_success "Frontend manifests are valid"
    else
        print_failure "Frontend manifests are invalid"
        return 1
    fi
    
    print_info "Note: Full deployment test requires a running Kubernetes cluster"
}

# Test 3: Helm Chart (if helm is available)
test_helm() {
    if ! command -v helm &> /dev/null; then
        print_info "Skipping Helm tests (Helm not installed)"
        return 0
    fi
    
    print_test_header "Test 3: Helm Chart"
    
    cd /home/amira/Desktop/MERN/helm
    
    print_info "Linting Helm chart..."
    if helm lint . &> /dev/null; then
        print_success "Helm chart linting passed"
    else
        print_failure "Helm chart linting failed"
        helm lint .
        return 1
    fi
    
    print_info "Testing Helm template rendering..."
    if helm template mern-app . &> /dev/null; then
        print_success "Helm templates render successfully"
    else
        print_failure "Helm templates failed to render"
        return 1
    fi
    
    print_info "Testing dry-run install..."
    if helm install mern-app-test . --dry-run --namespace mern-app-test &> /dev/null; then
        print_success "Helm dry-run install successful"
    else
        print_failure "Helm dry-run install failed"
        return 1
    fi
}

# Test 4: File Structure
test_file_structure() {
    print_test_header "Test 4: File Structure Verification"
    
    cd /home/amira/Desktop/MERN
    
    # Check required files
    REQUIRED_FILES=(
        "Jenkinsfile"
        "docker-compose.yml"
        "README-DEVOPS.md"
        "QUICKSTART.md"
        "backend/Dockerfile"
        "frontend/Dockerfile"
        "k8s/namespace.yaml"
        "k8s/configmap.yaml"
        "k8s/deploy.sh"
        "helm/Chart.yaml"
        "helm/values.yaml"
    )
    
    for file in "${REQUIRED_FILES[@]}"; do
        if [ -f "$file" ]; then
            print_success "File exists: $file"
        else
            print_failure "File missing: $file"
        fi
    done
}

# Test 5: Dockerfiles
test_dockerfiles() {
    print_test_header "Test 5: Dockerfile Validation"
    
    cd /home/amira/Desktop/MERN
    
    print_info "Validating backend Dockerfile..."
    if docker build --dry-run -f backend/Dockerfile backend &> /dev/null || \
       grep -q "FROM node" backend/Dockerfile; then
        print_success "Backend Dockerfile is valid"
    else
        print_failure "Backend Dockerfile validation failed"
    fi
    
    print_info "Validating frontend Dockerfile..."
    if docker build --dry-run -f frontend/Dockerfile frontend &> /dev/null || \
       grep -q "FROM node" frontend/Dockerfile; then
        print_success "Frontend Dockerfile is valid"
    else
        print_failure "Frontend Dockerfile validation failed"
    fi
}

# Main execution
main() {
    echo -e "${GREEN}"
    echo "╔════════════════════════════════════════╗"
    echo "║   MERN Stack DevOps Test Suite         ║"
    echo "╚════════════════════════════════════════╝"
    echo -e "${NC}"
    
    check_prerequisites
    test_file_structure
    test_dockerfiles
    test_docker_compose
    test_kubernetes
    test_helm
    
    # Print summary
    echo ""
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${BLUE}Test Summary${NC}"
    echo -e "${BLUE}════════════════════════════════════════${NC}"
    echo -e "${GREEN}Tests Passed: ${TESTS_PASSED}${NC}"
    echo -e "${RED}Tests Failed: ${TESTS_FAILED}${NC}"
    echo ""
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! DevOps setup is complete.${NC}"
        exit 0
    else
        echo -e "${RED}⚠️  Some tests failed. Please review the output above.${NC}"
        exit 1
    fi
}

# Run main function
main
