#!/bin/bash

# Quick Verification Script
# Verifies all DevOps files are in place

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   DevOps Setup Verification            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

cd /home/amira/Desktop/MERN

FILES_OK=0
FILES_MISSING=0

check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1${NC}"
        ((FILES_OK++))
        return 0
    else
        echo -e "${RED}❌ $1 (MISSING)${NC}"
        ((FILES_MISSING++))
        return 1
    fi
}

echo -e "${YELLOW}Checking CI/CD Files...${NC}"
check_file "Jenkinsfile"
echo ""

echo -e "${YELLOW}Checking Docker Files...${NC}"
check_file "docker-compose.yml"
check_file "backend/Dockerfile"
check_file "frontend/Dockerfile"
check_file "backend/.dockerignore"
check_file "frontend/.dockerignore"
echo ""

echo -e "${YELLOW}Checking Kubernetes Files...${NC}"
check_file "k8s/namespace.yaml"
check_file "k8s/configmap.yaml"
check_file "k8s/ingress.yaml"
check_file "k8s/deploy.sh"
check_file "k8s/backend/deployment.yaml"
check_file "k8s/backend/service.yaml"
check_file "k8s/frontend/deployment.yaml"
check_file "k8s/frontend/service.yaml"
check_file "k8s/mongodb/deployment.yaml"
check_file "k8s/mongodb/service.yaml"
check_file "k8s/argocd-application.yaml"
echo ""

echo -e "${YELLOW}Checking Helm Files...${NC}"
check_file "helm/Chart.yaml"
check_file "helm/values.yaml"
check_file "helm/templates/_helpers.tpl"
check_file "helm/templates/namespace.yaml"
check_file "helm/templates/configmap.yaml"
check_file "helm/templates/secret.yaml"
check_file "helm/templates/ingress.yaml"
check_file "helm/templates/backend/deployment.yaml"
check_file "helm/templates/backend/service.yaml"
check_file "helm/templates/frontend/deployment.yaml"
check_file "helm/templates/frontend/service.yaml"
check_file "helm/templates/mongodb/deployment.yaml"
check_file "helm/templates/mongodb/service.yaml"
check_file "helm/templates/mongodb/pvc.yaml"
echo ""

echo -e "${YELLOW}Checking Monitoring Files...${NC}"
check_file "k8s/monitoring/prometheus-configmap.yaml"
check_file "k8s/monitoring/prometheus-deployment.yaml"
check_file "k8s/monitoring/prometheus-service.yaml"
check_file "k8s/monitoring/grafana-deployment.yaml"
check_file "k8s/monitoring/grafana-service.yaml"
check_file "k8s/monitoring/grafana-secrets.yaml"
check_file "k8s/monitoring/grafana-datasources.yaml"
check_file "k8s/monitoring/grafana-dashboards.yaml"
echo ""

echo -e "${YELLOW}Checking Documentation...${NC}"
check_file "README-DEVOPS.md"
check_file "QUICKSTART.md"
check_file "TESTING-GUIDE.md"
check_file "DEPLOYMENT-CHECKLIST.md"
check_file "DEVOPS-SETUP-SUMMARY.md"
check_file "COMPLETION-SUMMARY.md"
echo ""

echo -e "${YELLOW}Checking Scripts...${NC}"
check_file "run-tests.sh"
check_file "verify-setup.sh"
echo ""

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${BLUE}Verification Summary${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}Files Found: ${FILES_OK}${NC}"
if [ $FILES_MISSING -gt 0 ]; then
    echo -e "${RED}Files Missing: ${FILES_MISSING}${NC}"
else
    echo -e "${GREEN}Files Missing: 0${NC}"
fi
echo ""

if [ $FILES_MISSING -eq 0 ]; then
    echo -e "${GREEN}🎉 All files are in place! Setup is complete.${NC}"
    echo ""
    echo -e "${YELLOW}Next steps:${NC}"
    echo "  1. Review configuration files"
    echo "  2. Update Docker Hub username"
    echo "  3. Change default passwords"
    echo "  4. Run tests: ./run-tests.sh"
    echo "  5. Deploy: docker-compose up -d"
    exit 0
else
    echo -e "${RED}⚠️  Some files are missing. Please check above.${NC}"
    exit 1
fi
