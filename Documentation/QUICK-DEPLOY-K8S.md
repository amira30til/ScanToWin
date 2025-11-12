# ⚡ Quick Kubernetes Deployment

## 🎯 **3 Simple Steps**

### **Step 1: Set Up Cluster (If Needed)**

```bash
# Option A: Minikube
minikube start --memory=4096 --cpus=2

# Option B: Kind
kind create cluster --name mern-cluster

# Verify
kubectl cluster-info
```

### **Step 2: Deploy**

```bash
cd /home/amira/Desktop/MERN/k8s
./safe-deploy.sh
```

### **Step 3: Access**

```bash
# Backend
kubectl port-forward -n mern-app svc/backend-service 5000:5000

# Frontend (in another terminal)
kubectl port-forward -n mern-app svc/frontend-service 8080:80
```

**Visit:** http://localhost:8080

---

## ✅ **What's Updated**

- ✅ Backend image: `amira30til/mern-backend:latest`
- ✅ Frontend image: `amira30til/mern-frontend:latest`
- ✅ Safe deployment script created
- ✅ All files ready

---

## 🛡️ **Safety Guarantees**

- ✅ **Won't affect Docker Compose** - Separate resources
- ✅ **Won't break anything** - Uses different ports
- ✅ **Easy rollback** - Just delete namespace

---

## 🚀 **Ready to Deploy!**

```bash
cd /home/amira/Desktop/MERN/k8s
./safe-deploy.sh
```

**That's it!** 🎉
