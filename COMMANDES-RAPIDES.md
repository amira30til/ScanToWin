# Guide de Test Rapide - Commandes Essentielles

## 🚀 Commandes de Base

### Vérifier que tout est installé
```bash
docker --version
docker-compose --version
git --version
```

### Se connecter à Docker Hub
```bash
docker login
# Entrez votre username et mot de passe
```

---

## 📝 Étape 1 : Remplacer votre username Docker Hub

### Option A : Utiliser le script automatique
```bash
cd /home/amira/Desktop/MERN
chmod +x setup-devops.sh
./setup-devops.sh
```

### Option B : Remplacer manuellement
Remplacez `your-dockerhub-username` par VOTRE username dans ces fichiers :
- `k8s/backend/deployment.yaml`
- `k8s/frontend/deployment.yaml`
- `helm/backend/values.yaml`
- `helm/frontend/values.yaml`

---

## 🐳 Étape 2 : Tester avec Docker Compose

### 1. Aller dans le dossier du projet
```bash
cd /home/amira/Desktop/MERN
```

### 2. Construire les images
```bash
# Remplacez VOTRE_USERNAME par votre vrai username Docker Hub
VOTRE_USERNAME="votre-username"

# Backend
docker build -t ${VOTRE_USERNAME}/mern-backend:latest ./backend

# Frontend
docker build -t ${VOTRE_USERNAME}/mern-frontend:latest \
  --build-arg VITE_API_BASE_URL=http://localhost:5000/api \
  --build-arg VITE_FRONTEND_URL=http://localhost:5173 \
  ./frontend
```

### 3. Lancer Docker Compose
```bash
docker-compose up -d
```

### 4. Vérifier que tout fonctionne
```bash
# Voir le statut
docker-compose ps

# Voir les logs
docker-compose logs -f

# Tester le backend (dans un nouveau terminal)
curl http://localhost:5000/api/health

# Tester le frontend
# Ouvrez http://localhost:5173 dans votre navigateur
```

### 5. Si tout fonctionne ✅
```bash
# Vous devriez voir :
# - mongodb: Up
# - backend: Up
# - frontend: Up

# Et curl devrait retourner :
# {"status":"OK","message":"Server is running"}
```

### 6. Arrêter les services
```bash
docker-compose down
```

---

## 🔍 Commandes de Diagnostic

### Voir les logs d'un service spécifique
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongodb
```

### Redémarrer un service
```bash
docker-compose restart backend
```

### Voir les images Docker
```bash
docker images | grep mern
```

### Voir les conteneurs en cours d'exécution
```bash
docker ps
```

### Entrer dans un conteneur
```bash
docker exec -it backend sh
docker exec -it mongodb mongosh
```

---

## 🐛 Résolution de Problèmes

### Problème : Port déjà utilisé
```bash
# Trouver ce qui utilise le port
sudo lsof -i :5000
sudo lsof -i :5173
sudo lsof -i :27017

# Arrêter le processus ou changer le port dans docker-compose.yml
```

### Problème : Conteneur ne démarre pas
```bash
# Voir les logs détaillés
docker-compose logs nom-du-service

# Voir les événements
docker-compose events
```

### Problème : Image non trouvée
```bash
# Vérifier que l'image existe
docker images

# Reconstruire l'image
docker-compose build --no-cache nom-du-service
```

### Problème : MongoDB ne se connecte pas
```bash
# Vérifier que MongoDB est démarré
docker-compose ps | grep mongodb

# Vérifier les logs MongoDB
docker-compose logs mongodb

# Tester la connexion
docker exec -it mongodb mongosh -u admin -p admin123
```

---

## 📦 Pousser les images sur Docker Hub

```bash
# S'assurer d'être connecté
docker login

# Taguer les images (si pas déjà fait)
VOTRE_USERNAME="votre-username"
docker tag mern-backend:latest ${VOTRE_USERNAME}/mern-backend:latest
docker tag mern-frontend:latest ${VOTRE_USERNAME}/mern-frontend:latest

# Pousser
docker push ${VOTRE_USERNAME}/mern-backend:latest
docker push ${VOTRE_USERNAME}/mern-frontend:latest
```

---

## ☸️ Tester avec Kubernetes (Optionnel)

### Prérequis
```bash
# Vérifier kubectl
kubectl version --client

# Si pas installé, installer Minikube
# Linux: https://minikube.sigs.k8s.io/docs/start/
```

### Déployer
```bash
# Créer le namespace
kubectl apply -f k8s/namespace.yaml

# Déployer MongoDB
kubectl apply -f k8s/mongodb/

# Attendre que MongoDB soit prêt
kubectl wait --for=condition=ready pod -l app=mongodb -n mern-app --timeout=120s

# Déployer le backend
kubectl apply -f k8s/backend/

# Déployer le frontend
kubectl apply -f k8s/frontend/

# Vérifier
kubectl get pods -n mern-app
kubectl get services -n mern-app
```

### Accéder aux services
```bash
# Port-forward backend
kubectl port-forward svc/backend-service 5000:5000 -n mern-app

# Port-forward frontend (dans un autre terminal)
kubectl port-forward svc/frontend-service 5173:80 -n mern-app
```

---

## ✅ Checklist de Test

- [ ] Docker est installé et fonctionne
- [ ] Docker Compose fonctionne
- [ ] Je suis connecté à Docker Hub
- [ ] J'ai remplacé "your-dockerhub-username" partout
- [ ] Les images Docker se construisent sans erreur
- [ ] Docker Compose démarre tous les services
- [ ] Le backend répond sur http://localhost:5000/api/health
- [ ] Le frontend s'affiche sur http://localhost:5173
- [ ] MongoDB fonctionne
- [ ] Les images sont poussées sur Docker Hub

---

## 📚 Besoin d'aide ?

1. Consultez `GUIDE-ETAPES.md` pour un guide détaillé
2. Consultez `README-DEVOPS.md` pour la documentation complète
3. Vérifiez les logs : `docker-compose logs -f`
