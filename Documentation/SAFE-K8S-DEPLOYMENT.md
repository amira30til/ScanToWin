# 🚀 Safe Kubernetes Deployment Guide

## ✅ **This Deployment is SAFE**

This guide shows you how to deploy to Kubernetes **without affecting** your Docker Compose setup.

**Key Points:**
- ✅ Docker Compose will continue running
- ✅ Kubernetes uses separate resources
- ✅ No conflicts between the two
- ✅ Easy rollback if needed

---

## 📋 **Prerequisites**

### **1. Check if you have a Kubernetes cluster:**

```bash
# Check if kubectl is installed
kubectl version --client

# Check if cluster is accessible
kubectl cluster-info
```

### **2. If NO cluster, set one up:**

**Option A: Minikube (Recommended)**
```bash
# Install Minikube
# Visit: https://minikube.sigs.k8s.io/docs/start/

# Start cluster
minikube start --memory=4096 --cpus=2

# Verify
kubectl cluster-info
```

**Option B: Kind**
```bash
# Install Kind
# Visit: https://kind.sigs.k8s.io/docs/user/quick-start/

# Create cluster
kind create cluster --name mern-cluster

# Verify
kubectl cluster-info
```

---

## 🚀 **Safe Deployment Steps**

### **Step 1: Verify Docker Compose (Optional)**

```bash
# Check Docker Compose is running (it's OK if it is)
docker compose ps

# This won't interfere with Kubernetes deployment
```

### **Step 2: Run Safe Deployment Script**

```bash
cd /home/amira/Desktop/MERN/k8s
./safe-deploy.sh
```

**What the script does:**
1. ✅ Checks prerequisites (kubectl, cluster)
2. ✅ Verifies Docker Hub images exist
3. ✅ Creates namespace
4. ✅ Deploys MongoDB
5. ✅ Deploys backend
6. ✅ Deploys frontend
7. ✅ Shows status

### **Step 3: Verify Deployment**

```bash
# Check pods
kubectl get pods -n mern-app

# Check services
kubectl get svc -n mern-app

# Check deployments
kubectl get deployments -n mern-app
```

---

## 🌐 **Access Your Application**

### **Backend:**
```bash
# Port forward backend
kubectl port-forward -n mern-app svc/backend-service 5000:5000

# In another terminal, test
curl http://localhost:5000/api/health
```

### **Frontend:**
```bash
# Port forward frontend
kubectl port-forward -n mern-app svc/frontend-service 8080:80

# Visit in browser: http://localhost:8080
```

**Note:** These ports (5000, 8080) are different from Docker Compose ports, so no conflict!

---

## 🔍 **Monitor Deployment**

### **View Logs:**
```bash
# Backend logs
kubectl logs -f deployment/backend -n mern-app

# Frontend logs
kubectl logs -f deployment/frontend -n mern-app

# MongoDB logs
kubectl logs -f deployment/mongodb -n mern-app
```

### **Check Pod Status:**
```bash
# Detailed pod status
kubectl describe pod -l app=backend -n mern-app

# Pod events
kubectl get events -n mern-app --sort-by='.lastTimestamp'
```

---

## 🔄 **Rollback (If Needed)**

### **Delete Kubernetes Deployment:**
```bash
# Delete everything in namespace
kubectl delete namespace mern-app

# This will NOT affect Docker Compose!
```

### **Delete Specific Resources:**
```bash
# Delete only backend
kubectl delete deployment backend -n mern-app

# Delete only frontend
kubectl delete deployment frontend -n mern-app
```

---

## ✅ **What's Safe About This Deployment**

### **1. Separate Namespaces**
- Kubernetes uses `mern-app` namespace
- Docker Compose uses Docker network
- **No conflicts**

### **2. Different Ports**
- Docker Compose: `localhost:5000` (backend), `localhost:5173` (frontend)
- Kubernetes: Uses port-forwarding or ingress
- **No port conflicts**

### **3. Separate Resources**
- Docker Compose: Uses Docker containers
- Kubernetes: Uses Kubernetes pods
- **Completely independent**

### **4. Easy Cleanup**
- Delete Kubernetes namespace = removes everything
- Docker Compose continues running
- **No side effects**

---

## 🎯 **Quick Commands Reference**

### **Deploy:**
```bash
cd /home/amira/Desktop/MERN/k8s
./safe-deploy.sh
```

### **Check Status:**
```bash
kubectl get all -n mern-app
```

### **Access Services:**
```bash
# Backend
kubectl port-forward -n mern-app svc/backend-service 5000:5000

# Frontend
kubectl port-forward -n mern-app svc/frontend-service 8080:80
```

### **View Logs:**
```bash
kubectl logs -f deployment/backend -n mern-app
kubectl logs -f deployment/frontend -n mern-app
```

### **Delete Everything:**
```bash
kubectl delete namespace mern-app
```

---

## 🐛 **Troubleshooting**

### **Problem: Pods not starting**

```bash
# Check pod status
kubectl get pods -n mern-app

# Describe pod for details
kubectl describe pod <pod-name> -n mern-app

# Check logs
kubectl logs <pod-name> -n mern-app
```

### **Problem: Image pull errors**

```bash
# Verify image exists
docker pull amira30til/mern-backend:latest
docker pull amira30til/mern-frontend:latest

# Check image pull policy
kubectl describe deployment backend -n mern-app | grep Image
```

### **Problem: Services not accessible**

```bash
# Check service endpoints
kubectl get endpoints -n mern-app

# Test from inside cluster
kubectl run -it --rm debug --image=busybox --restart=Never -n mern-app -- sh
# Inside pod: wget -O- http://backend-service:5000/api/health
```

---

## 📊 **Comparison: Docker Compose vs Kubernetes**

| Feature | Docker Compose | Kubernetes |
|---------|---------------|------------|
| **Status** | ✅ Running locally | ⚠️ Needs cluster |
| **Ports** | 5000, 5173 | Port-forwarding |
| **Resources** | Docker containers | Kubernetes pods |
| **Network** | Docker network | Kubernetes network |
| **Data** | Docker volumes | Kubernetes PVCs |
| **Management** | `docker compose` | `kubectl` |

**Both can run simultaneously!** ✅

---

## ✅ **Summary**

### **What This Deployment Does:**
- ✅ Deploys to Kubernetes cluster
- ✅ Uses images from Docker Hub
- ✅ Creates separate namespace
- ✅ Does NOT affect Docker Compose

### **What This Deployment Does NOT Do:**
- ❌ Does NOT stop Docker Compose
- ❌ Does NOT modify Docker Compose
- ❌ Does NOT conflict with local setup

### **Safety Guarantees:**
- ✅ Separate namespaces
- ✅ Different ports
- ✅ Independent resources
- ✅ Easy rollback

---

## 🎉 **You're Ready!**

Run the safe deployment script:

```bash
cd /home/amira/Desktop/MERN/k8s
./safe-deploy.sh
```

**Everything is safe and ready!** 🚀
