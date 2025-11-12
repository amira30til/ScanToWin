#!/bin/bash

# Script d'installation automatique de Minikube

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Installation de Minikube           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si déjà installé
if command -v minikube &> /dev/null; then
    echo -e "${GREEN}✅ Minikube est déjà installé${NC}"
    minikube version
    echo ""
    read -p "Voulez-vous continuer quand même? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${YELLOW}⚠️  Docker n'est pas installé${NC}"
    echo "Minikube peut fonctionner sans Docker, mais Docker est recommandé"
    echo ""
fi

# Télécharger Minikube
echo -e "${YELLOW}📥 Téléchargement de Minikube...${NC}"
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Installer
echo -e "${YELLOW}📦 Installation de Minikube...${NC}"
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Nettoyer
rm minikube-linux-amd64

# Vérifier
echo -e "${YELLOW}🔍 Vérification...${NC}"
if command -v minikube &> /dev/null; then
    echo -e "${GREEN}✅ Minikube installé avec succès!${NC}"
    minikube version
    echo ""
    echo -e "${GREEN}Prochaines étapes:${NC}"
    echo "1. Démarrer le cluster:"
    echo "   ${BLUE}minikube start --memory=4096 --cpus=2${NC}"
    echo ""
    echo "2. Vérifier:"
    echo "   ${BLUE}kubectl cluster-info${NC}"
    echo ""
    echo "3. Déployer:"
    echo "   ${BLUE}cd /home/amira/Desktop/MERN/k8s${NC}"
    echo "   ${BLUE}./safe-deploy.sh${NC}"
else
    echo -e "${RED}❌ Erreur lors de l'installation${NC}"
    exit 1
fi
