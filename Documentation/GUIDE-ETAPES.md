# Guide Pas-à-Pas pour Débutants - Configuration DevOps

Ce guide vous accompagne étape par étape pour configurer et tester votre projet DevOps.

## 📋 Prérequis à vérifier

Avant de commencer, vérifiez que vous avez installé :

```bash
# Vérifier Docker
docker --version
docker-compose --version

# Vérifier Git
git --version

# Vérifier Node.js (optionnel, pour développement local)
node --version
```

Si quelque chose manque, installez-le d'abord.

---

## ÉTAPE 1 : Créer un compte Docker Hub et trouver votre username

### 1.1 Créer un compte Docker Hub

1. Allez sur https://hub.docker.com
2. Cliquez sur "Sign Up"
3. Créez un compte gratuit
4. Confirmez votre email

### 1.2 Trouver votre username Docker Hub

1. Connectez-vous sur Docker Hub
2. Votre username est visible en haut à droite (ex: `monnom` ou `monnom123`)
3. **Notez-le quelque part** - vous en aurez besoin !

### 1.3 Se connecter à Docker Hub depuis votre terminal

```bash
docker login
# Entrez votre username Docker Hub
# Entrez votre mot de passe Docker Hub
```

**Vérification** : Si vous voyez "Login Succeeded", c'est bon ! ✅

---

## ÉTAPE 2 : Remplacer "your-dockerhub-username" dans tous les fichiers

### 2.1 Trouver tous les fichiers à modifier

**Fichiers à modifier** :
- `k8s/backend/deployment.yaml`
- `k8s/frontend/deployment.yaml`
- `helm/backend/values.yaml`
- `helm/frontend/values.yaml`
- `Jenkinsfile`
- `.gitlab-ci.yml`

### 2.2 Méthode manuelle (recommandée pour apprendre)

**Remplacez `your-dockerhub-username` par VOTRE username Docker Hub**

Exemple : Si votre username est `johndoe`, remplacez `your-dockerhub-username` par `johndoe`

```bash
# Exemple de commande pour remplacer automatiquement (remplacez VOTRE_USERNAME)
# ATTENTION : Remplacez VOTRE_USERNAME par votre vrai username Docker Hub !

# Pour Linux/Mac :
sed -i 's/your-dockerhub-username/VOTRE_USERNAME/g' k8s/backend/deployment.yaml
sed -i 's/your-dockerhub-username/VOTRE_USERNAME/g' k8s/frontend/deployment.yaml
sed -i 's/your-dockerhub-username/VOTRE_USERNAME/g' helm/backend/values.yaml
sed -i 's/your-dockerhub-username/VOTRE_USERNAME/g' helm/frontend/values.yaml
sed -i 's/your-dockerhub-username/VOTRE_USERNAME/g' Jenkinsfile
sed -i 's/your-dockerhub-username/VOTRE_USERNAME/g' .gitlab-ci.yml

# Pour Windows (PowerShell) :
# Utilisez l'éditeur de texte pour remplacer manuellement
```

**Vérification** : Vérifiez qu'il n'y a plus de "your-dockerhub-username" :

```bash
grep -r "your-dockerhub-username" k8s/ helm/ Jenkinsfile .gitlab-ci.yml
# Si rien ne s'affiche, c'est bon ! ✅
```

---

## ÉTAPE 3 : Configurer les secrets et mots de passe

### 3.1 Changer les mots de passe MongoDB

Ouvrez le fichier `k8s/mongodb/secret.yaml` :

```yaml
# AVANT (à changer) :
MONGO_INITDB_ROOT_PASSWORD: "admin123"

# APRÈS (choisissez un mot de passe fort) :
MONGO_INITDB_ROOT_PASSWORD: "VotreMotDePasseSecurise123!"
```

**Faites de même dans** :
- `k8s/backend/secret.yaml` (JWT_SECRET et MONGO_ROOT_PASSWORD)
- `docker-compose.yml` (si vous l'utilisez)

### 3.2 Changer le JWT_SECRET

Ouvrez `k8s/backend/secret.yaml` :

```yaml
# AVANT :
JWT_SECRET: "change-this-secret-key-in-production"

# APRÈS (générez une clé aléatoire) :
JWT_SECRET: "MaCleSecreteSuperLongueEtAleatoire123456789"
```

**Générer une clé aléatoire** :

```bash
# Linux/Mac :
openssl rand -base64 32

# Ou utilisez un générateur en ligne : https://randomkeygen.com/
```

---

## ÉTAPE 4 : Tester avec Docker Compose (RECOMMANDÉ EN PREMIER)

### 4.1 Vérifier que vous êtes dans le bon dossier

```bash
cd /home/amira/Desktop/MERN
pwd
# Vous devriez voir : /home/amira/Desktop/MERN
ls -la
# Vous devriez voir : docker-compose.yml, backend/, frontend/, etc.
```

### 4.2 Vérifier que MongoDB n'utilise pas déjà le port 27017

```bash
# Vérifier si le port est libre
sudo netstat -tulpn | grep 27017
# Ou
sudo lsof -i :27017

# Si quelque chose utilise le port, arrêtez-le ou changez le port dans docker-compose.yml
```

### 4.3 Créer un fichier .env (optionnel mais recommandé)

```bash
# Créer le fichier .env à la racine
cat > .env << 'EOF'
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=VotreMotDePasseMongoDB123
MONGO_DATABASE=scan2win
MONGO_URI=mongodb://mongodb:27017/scan2win
BACKEND_PORT=5000
FRONTEND_PORT=5173
FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:5173
JWT_SECRET=VotreJWTSecretTresLongEtAleatoire123456789
EOF
```

### 4.4 Construire les images Docker

```bash
# Construire le backend
docker build -t votre-username/mern-backend:latest ./backend

# Construire le frontend
docker build -t votre-username/mern-frontend:latest \
  --build-arg VITE_API_BASE_URL=http://localhost:5000/api \
  --build-arg VITE_FRONTEND_URL=http://localhost:5173 \
  ./frontend

# Vérifier que les images sont créées
docker images | grep mern
```

### 4.5 Lancer Docker Compose

```bash
# Lancer tous les services en arrière-plan
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Dans un autre terminal, vérifier le statut
docker-compose ps
```

**Résultat attendu** : Vous devriez voir 3 services :
- `mongodb` - Status: Up
- `backend` - Status: Up  
- `frontend` - Status: Up

### 4.6 Vérifier que tout fonctionne

**Test 1 : Vérifier les conteneurs**

```bash
docker-compose ps
# Tous les conteneurs doivent être "Up"
```

**Test 2 : Vérifier les logs**

```bash
# Logs MongoDB
docker-compose logs mongodb | tail -20

# Logs Backend
docker-compose logs backend | tail -20

# Logs Frontend
docker-compose logs frontend | tail -20
```

**Test 3 : Tester l'API Backend**

```bash
# Tester l'endpoint de santé
curl http://localhost:5000/api/health

# Réponse attendue : {"status":"OK","message":"Server is running"}
```

**Test 4 : Tester le Frontend**

1. Ouvrez votre navigateur
2. Allez sur : http://localhost:5173
3. Vous devriez voir votre application React

**Test 5 : Vérifier MongoDB**

```bash
# Se connecter à MongoDB
docker exec -it mongodb mongosh -u admin -p VotreMotDePasseMongoDB123

# Dans MongoDB shell :
show dbs
exit
```

### 4.7 Si quelque chose ne fonctionne pas

```bash
# Voir tous les logs
docker-compose logs

# Redémarrer un service spécifique
docker-compose restart backend

# Arrêter tout
docker-compose down

# Arrêter et supprimer les volumes (ATTENTION : supprime les données)
docker-compose down -v
```

---

## ÉTAPE 5 : Pousser les images sur Docker Hub

### 5.1 Taguer les images avec votre username

```bash
# Remplacez VOTRE_USERNAME par votre vrai username Docker Hub
VOTRE_USERNAME="votre-username-dockerhub"

# Taguer le backend
docker tag votre-username/mern-backend:latest ${VOTRE_USERNAME}/mern-backend:latest

# Taguer le frontend
docker tag votre-username/mern-frontend:latest ${VOTRE_USERNAME}/mern-frontend:latest
```

### 5.2 Pousser sur Docker Hub

```bash
# S'assurer d'être connecté
docker login

# Pousser le backend
docker push ${VOTRE_USERNAME}/mern-backend:latest

# Pousser le frontend
docker push ${VOTRE_USERNAME}/mern-frontend:latest
```

**Vérification** : Allez sur https://hub.docker.com et vérifiez que vos images apparaissent !

---

## ÉTAPE 6 : Tester avec Kubernetes (OPTIONNEL - Plus avancé)

### 6.1 Prérequis Kubernetes

```bash
# Vérifier que kubectl est installé
kubectl version --client

# Vérifier que vous avez accès à un cluster
kubectl cluster-info

# Si vous n'avez pas de cluster, installez Minikube ou utilisez Docker Desktop Kubernetes
```

### 6.2 Installer Minikube (si vous n'avez pas de cluster)

```bash
# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube start

# Vérifier
kubectl get nodes
```

### 6.3 Déployer sur Kubernetes

```bash
# 1. Créer le namespace
kubectl apply -f k8s/namespace.yaml

# 2. Déployer MongoDB
kubectl apply -f k8s/mongodb/

# 3. Attendre que MongoDB soit prêt (environ 30 secondes)
kubectl wait --for=condition=ready pod -l app=mongodb -n mern-app --timeout=120s

# 4. Déployer le backend
kubectl apply -f k8s/backend/

# 5. Déployer le frontend
kubectl apply -f k8s/frontend/

# 6. Vérifier le statut
kubectl get pods -n mern-app
kubectl get services -n mern-app
```

### 6.4 Accéder aux services

```bash
# Port-forward pour le backend
kubectl port-forward svc/backend-service 5000:5000 -n mern-app

# Dans un autre terminal, port-forward pour le frontend
kubectl port-forward svc/frontend-service 5173:80 -n mern-app

# Tester
curl http://localhost:5000/api/health
# Ouvrir http://localhost:5173 dans le navigateur
```

---

## ÉTAPE 7 : Configuration CI/CD (OPTIONNEL - Pour plus tard)

### 7.1 Jenkins (si vous utilisez Jenkins)

1. Installer Jenkins : https://www.jenkins.io/doc/book/installing/
2. Créer les credentials :
   - Docker Hub : `dockerhub-credentials` (username/password)
   - Kubernetes : `kubeconfig-credentials`
3. Le pipeline s'exécutera automatiquement sur push

### 7.2 GitLab CI (si vous utilisez GitLab)

1. Créer un projet sur GitLab
2. Aller dans Settings > CI/CD > Variables
3. Ajouter :
   - `DOCKERHUB_USERNAME` : votre username Docker Hub
   - `DOCKERHUB_PASSWORD` : votre mot de passe Docker Hub
   - `KUBE_CONTEXT` : votre contexte Kubernetes (si applicable)

---

## ✅ Checklist de vérification finale

Cochez chaque étape au fur et à mesure :

- [ ] Compte Docker Hub créé et connecté
- [ ] Tous les fichiers modifiés (remplacement de `your-dockerhub-username`)
- [ ] Secrets et mots de passe changés
- [ ] Docker Compose fonctionne (`docker-compose up -d`)
- [ ] Backend accessible (http://localhost:5000/api/health)
- [ ] Frontend accessible (http://localhost:5173)
- [ ] MongoDB fonctionne
- [ ] Images Docker poussées sur Docker Hub
- [ ] (Optionnel) Kubernetes fonctionne
- [ ] (Optionnel) CI/CD configuré

---

## 🆘 Problèmes courants et solutions

### Problème : "Cannot connect to Docker daemon"

```bash
# Vérifier que Docker est démarré
sudo systemctl start docker
# Ou redémarrer Docker Desktop
```

### Problème : "Port already in use"

```bash
# Trouver ce qui utilise le port
sudo lsof -i :5000  # ou :5173, :27017

# Arrêter le processus ou changer le port dans docker-compose.yml
```

### Problème : "Image not found" dans Kubernetes

```bash
# Vérifier que l'image est bien sur Docker Hub
# Vérifier le nom de l'image dans les manifests
kubectl describe pod <pod-name> -n mern-app
```

### Problème : "MongoDB connection error"

```bash
# Vérifier que MongoDB est démarré
docker-compose ps | grep mongodb

# Vérifier les logs
docker-compose logs mongodb

# Vérifier la variable MONGO_URI dans docker-compose.yml
```

---

## 📚 Ressources d'apprentissage

- [Docker Documentation](https://docs.docker.com/get-started/)
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Docker Compose Guide](https://docs.docker.com/compose/gettingstarted/)

---

## 🎉 Félicitations !

Si vous avez réussi toutes les étapes, votre environnement DevOps est configuré et fonctionnel !

**Prochaines étapes suggérées** :
1. Explorer les logs et métriques
2. Tester le déploiement avec Helm
3. Configurer le monitoring Prometheus/Grafana
4. Mettre en place le CI/CD
