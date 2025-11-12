# 🚀 Installer un Cluster Kubernetes Local

## 📋 **Options Disponibles**

Vous avez **2 options** pour créer un cluster Kubernetes local:

1. **Minikube** (Recommandé) - Plus simple
2. **Kind** - Plus léger

---

## 🎯 **Option 1: Minikube (Recommandé)**

### **Installation:**

```bash
# Télécharger Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64

# Installer
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Vérifier
minikube version
```

### **Démarrer le Cluster:**

```bash
# Démarrer avec ressources suffisantes
minikube start --memory=4096 --cpus=2

# Vérifier
kubectl cluster-info
kubectl get nodes
```

### **Si vous avez besoin de Docker:**

```bash
# Minikube peut utiliser Docker comme driver
minikube start --memory=4096 --cpus=2 --driver=docker

# Ou utiliser le driver par défaut
minikube start --memory=4096 --cpus=2
```

---

## 🎯 **Option 2: Kind (Plus Léger)**

### **Installation:**

```bash
# Télécharger Kind
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64

# Rendre exécutable
chmod +x ./kind

# Déplacer vers PATH
sudo mv ./kind /usr/local/bin/kind

# Vérifier
kind version
```

### **Créer le Cluster:**

```bash
# Créer un cluster
kind create cluster --name mern-cluster

# Vérifier
kubectl cluster-info
kubectl get nodes
```

---

## 🔧 **Configuration de kubectl**

Après avoir créé un cluster local, vérifiez que kubectl pointe vers le bon cluster:

```bash
# Voir le contexte actuel
kubectl config current-context

# Lister tous les contextes
kubectl config get-contexts

# Changer vers le cluster local (Minikube)
kubectl config use-context minikube

# Ou pour Kind
kubectl config use-context kind-mern-cluster
```

---

## ✅ **Vérification**

Après installation, vérifiez:

```bash
# Vérifier le cluster
kubectl cluster-info

# Devrait afficher quelque chose comme:
# Kubernetes control plane is running at https://127.0.0.1:xxxxx

# Vérifier les nodes
kubectl get nodes

# Devrait afficher:
# NAME       STATUS   ROLES           AGE   VERSION
# minikube   Ready    control-plane   ...   v1.x.x
```

---

## 🚀 **Après Installation - Déployer**

Une fois le cluster installé:

```bash
cd /home/amira/Desktop/MERN/k8s
./safe-deploy.sh
```

---

## 🐛 **Dépannage**

### **Problème: kubectl pointe vers un mauvais cluster**

```bash
# Voir tous les contextes
kubectl config get-contexts

# Changer vers Minikube
kubectl config use-context minikube

# Ou changer vers Kind
kubectl config use-context kind-mern-cluster
```

### **Problème: Minikube ne démarre pas**

```bash
# Vérifier les logs
minikube logs

# Réinitialiser
minikube delete
minikube start --memory=4096 --cpus=2
```

### **Problème: Pas assez de ressources**

```bash
# Utiliser moins de ressources
minikube start --memory=2048 --cpus=1

# Ou utiliser Kind (plus léger)
kind create cluster --name mern-cluster
```

---

## 📝 **Résumé Rapide**

### **Minikube:**
```bash
# Installer
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Démarrer
minikube start --memory=4096 --cpus=2

# Vérifier
kubectl cluster-info
```

### **Kind:**
```bash
# Installer
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind

# Créer cluster
kind create cluster --name mern-cluster

# Vérifier
kubectl cluster-info
```

---

## 🎯 **Recommandation**

**Pour votre projet, je recommande Minikube** car:
- ✅ Plus simple à utiliser
- ✅ Meilleure documentation
- ✅ Plus facile à déboguer
- ✅ Interface graphique disponible

---

## ✅ **Prochaines Étapes**

1. Installer Minikube ou Kind
2. Démarrer le cluster
3. Vérifier avec `kubectl cluster-info`
4. Déployer avec `./safe-deploy.sh`

**C'est tout!** 🎉
