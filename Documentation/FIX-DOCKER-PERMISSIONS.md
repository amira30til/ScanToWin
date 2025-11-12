# Solution au problème de permission Docker

## Problème
Vous avez l'erreur : "permission denied while trying to connect to the Docker daemon socket"

Cela signifie que votre utilisateur n'a pas les permissions pour utiliser Docker.

## Solution

### Étape 1 : Ajouter votre utilisateur au groupe docker

```bash
sudo usermod -aG docker $USER
```

### Étape 2 : Redémarrer votre session

Vous devez vous déconnecter et reconnecter, OU redémarrer votre terminal, OU utiliser :

```bash
newgrp docker
```

### Étape 3 : Vérifier que ça fonctionne

```bash
docker ps
# Si ça fonctionne sans sudo, c'est bon !
```

### Étape 4 : Relancer le script

```bash
cd /home/amira/Desktop/MERN
./setup-devops.sh
```

## Alternative : Utiliser sudo (temporaire)

Si vous ne voulez pas modifier les groupes maintenant, vous pouvez utiliser sudo :

```bash
sudo docker build -t amiratilouche/mern-backend:latest ./backend
sudo docker build -t amiratilouche/mern-frontend:latest \
  --build-arg VITE_API_BASE_URL=http://localhost:5000/api \
  --build-arg VITE_FRONTEND_URL=http://localhost:5173 \
  ./frontend

sudo docker-compose up -d
```

Mais la meilleure solution est d'ajouter votre utilisateur au groupe docker.
