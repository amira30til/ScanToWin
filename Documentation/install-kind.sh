#!/bin/bash

# Script d'installation automatique de Kind

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Installation de Kind               ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Vérifier si déjà installé
if command -v kind &> /dev/null; then
    echo -e "${GREEN}✅ Kind est déjà installé${NC}"
    kind version
    echo ""
    read -p "Voulez-vous continuer quand même? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
    fi
fi

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker est requis pour Kind${NC}"
    echo "Installez Docker d'abord:"
    echo "  sudo apt-get update"
    echo "  sudo apt-get install docker.io"
    exit 1
fi

# Télécharger Kind
echo -e "${YELLOW}📥 Téléchargement de Kind...${NC}"
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64

# Rendre exécutable
chmod +x ./kind

# Installer
echo -e "${YELLOW}📦 Installation de Kind...${NC}"
sudo mv ./kind /usr/local/bin/kind

# Vérifier
echo -e "${YELLOW}🔍 Vérification...${NC}"
if command -v kind &> /dev/null; then
    echo -e "${GREEN}✅ Kind installé avec succès!${NC}"
    kind version
    echo ""
    echo -e "${GREEN}Prochaines étapes:${NC}"
    echo "1. Créer le cluster:"
    echo "   ${BLUE}kind create cluster --name mern-cluster${NC}"
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
