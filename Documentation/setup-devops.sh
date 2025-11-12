#!/bin/bash

# Script d'aide pour la configuration DevOps
# Usage: ./setup-devops.sh

set -e

echo "🚀 Script de configuration DevOps pour MERN Stack"
echo "=================================================="
echo ""

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${GREEN}ℹ️  $1${NC}"
}

# Vérifier les prérequis
echo "📋 Vérification des prérequis..."
echo ""

if command -v docker &> /dev/null; then
    print_success "Docker est installé: $(docker --version)"
else
    print_error "Docker n'est pas installé. Installez Docker d'abord."
    exit 1
fi

# Détecter quelle commande Docker Compose est disponible
if docker compose version &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker compose"
    print_success "Docker Compose est installé (nouvelle syntaxe)"
elif command -v docker-compose &> /dev/null; then
    DOCKER_COMPOSE_CMD="docker-compose"
    print_success "Docker Compose est installé (ancienne syntaxe)"
else
    print_error "Docker Compose n'est pas installé."
    exit 1
fi

if command -v git &> /dev/null; then
    print_success "Git est installé: $(git --version)"
else
    print_warning "Git n'est pas installé (optionnel)"
fi

echo ""
echo "=================================================="
echo ""

# Demander le username Docker Hub
read -p "🔐 Entrez votre username Docker Hub: " DOCKERHUB_USERNAME

if [ -z "$DOCKERHUB_USERNAME" ]; then
    print_error "Username Docker Hub requis!"
    exit 1
fi

print_info "Username Docker Hub: $DOCKERHUB_USERNAME"
echo ""

# Demander confirmation
read -p "Voulez-vous remplacer 'your-dockerhub-username' par '$DOCKERHUB_USERNAME' dans tous les fichiers? (y/n): " CONFIRM

if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    print_warning "Opération annulée."
    exit 0
fi

# Remplacer dans les fichiers
echo ""
echo "📝 Remplacement de 'your-dockerhub-username' par '$DOCKERHUB_USERNAME'..."
echo ""

FILES=(
    "k8s/backend/deployment.yaml"
    "k8s/frontend/deployment.yaml"
    "helm/backend/values.yaml"
    "helm/frontend/values.yaml"
    "Jenkinsfile"
    ".gitlab-ci.yml"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            sed -i '' "s/your-dockerhub-username/$DOCKERHUB_USERNAME/g" "$file"
        else
            # Linux
            sed -i "s/your-dockerhub-username/$DOCKERHUB_USERNAME/g" "$file"
        fi
        print_success "Modifié: $file"
    else
        print_warning "Fichier non trouvé: $file"
    fi
done

echo ""
print_success "Remplacement terminé!"
echo ""

# Vérifier qu'il ne reste plus de "your-dockerhub-username"
REMAINING=$(grep -r "your-dockerhub-username" k8s/ helm/ Jenkinsfile .gitlab-ci.yml 2>/dev/null | wc -l)

if [ "$REMAINING" -eq 0 ]; then
    print_success "Aucune occurrence restante de 'your-dockerhub-username'"
else
    print_warning "Il reste $REMAINING occurrence(s) de 'your-dockerhub-username'"
    echo "Fichiers concernés:"
    grep -r "your-dockerhub-username" k8s/ helm/ Jenkinsfile .gitlab-ci.yml 2>/dev/null || true
fi

echo ""
echo "=================================================="
echo ""

# Demander si l'utilisateur veut tester Docker Compose
read -p "Voulez-vous tester avec Docker Compose maintenant? (y/n): " TEST_DOCKER

if [ "$TEST_DOCKER" == "y" ] || [ "$TEST_DOCKER" == "Y" ]; then
    echo ""
    print_info "Construction des images Docker..."
    echo ""
    
    # Construire le backend
    print_info "Construction du backend..."
    docker build -t ${DOCKERHUB_USERNAME}/mern-backend:latest ./backend || {
        print_error "Échec de la construction du backend"
        exit 1
    }
    print_success "Backend construit avec succès"
    
    # Construire le frontend
    print_info "Construction du frontend..."
    docker build -t ${DOCKERHUB_USERNAME}/mern-frontend:latest \
        --build-arg VITE_API_BASE_URL=http://localhost:5000/api \
        --build-arg VITE_FRONTEND_URL=http://localhost:5173 \
        ./frontend || {
        print_error "Échec de la construction du frontend"
        exit 1
    }
    print_success "Frontend construit avec succès"
    
    echo ""
    print_info "Démarrage de Docker Compose..."
    echo ""
    
    # Mettre à jour docker-compose.yml avec les nouvelles images
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s|your-dockerhub-username|${DOCKERHUB_USERNAME}|g" docker-compose.yml 2>/dev/null || true
    else
        sed -i "s|your-dockerhub-username|${DOCKERHUB_USERNAME}|g" docker-compose.yml 2>/dev/null || true
    fi
    
    # Lancer Docker Compose
    ${DOCKER_COMPOSE_CMD} up -d || {
        print_error "Échec du démarrage de Docker Compose"
        exit 1
    }
    
    echo ""
    print_success "Docker Compose démarré!"
    echo ""
    print_info "Vérification du statut des conteneurs..."
    sleep 5
    ${DOCKER_COMPOSE_CMD} ps
    
    echo ""
    print_info "Pour voir les logs: ${DOCKER_COMPOSE_CMD} logs -f"
    print_info "Pour tester le backend: curl http://localhost:5000/api/health"
    print_info "Pour tester le frontend: http://localhost:5173"
    echo ""
fi

echo ""
echo "=================================================="
echo ""
print_success "Configuration terminée!"
echo ""
print_info "Prochaines étapes:"
echo "  1. Modifiez les secrets dans k8s/backend/secret.yaml et k8s/mongodb/secret.yaml"
echo "  2. Testez avec: ${DOCKER_COMPOSE_CMD} up -d"
echo "  3. Vérifiez les logs: ${DOCKER_COMPOSE_CMD} logs -f"
echo "  4. Consultez GUIDE-ETAPES.md pour plus de détails"
echo ""
