# Complete Testing Guide - Step by Step

This guide provides detailed steps to test every component of the DevOps setup.

## 📋 Prerequisites Check

Before starting, verify you have:

```bash
# Check Docker
docker --version
docker-compose --version

# Check Kubernetes
kubectl version --client

# Check Helm (optional)
helm version

# Check if you have a Kubernetes cluster
kubectl cluster-info
```

---

## 🐳 Test 1: Docker Compose (Local Development)

### Step 1.1: Prepare Environment

```bash
# Navigate to project root
cd /home/amira/Desktop/MERN

# Create .env file if it doesn't exist
cp .env.example .env

# Edit .env file (update with your values)
nano .env
```

**Required values in `.env`:**
```bash
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DATABASE=scan2win
MONGO_URI=mongodb://mongodb:27017/scan2win
BACKEND_PORT=5000
FRONTEND_PORT=5173
JWT_SECRET=test-secret-key-123
FRONTEND_URL=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:5173
```

### Step 1.2: Build and Start Services

```bash
# Stop any running containers
docker-compose down

# Build images (this may take a few minutes)
docker-compose build --no-cache

# Start all services
docker-compose up -d

# Check status
docker-compose ps
```

**Expected Output:**
```
NAME                STATUS          PORTS
backend             Up (healthy)    0.0.0.0:5000->5000/tcp
frontend            Up (healthy)    0.0.0.0:5173->80/tcp
mongodb             Up (healthy)    0.0.0.0:27018->27017/tcp
```

### Step 1.3: Verify Services

```bash
# Check backend health
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"Server is running"}

# Check frontend health
curl http://localhost:5173/health

# Expected response:
# healthy

# Check MongoDB connection (from backend logs)
docker-compose logs backend | grep "MongoDB connected"

# View all logs
docker-compose logs -f
```

### Step 1.4: Test Application Functionality

```bash
# Open browser and test:
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api/health

# Test API endpoints (if available)
curl http://localhost:5000/api/users
curl http://localhost:5000/api/auth/login
```

### Step 1.5: Cleanup

```bash
# Stop services
docker-compose down

# Remove volumes (clean slate)
docker-compose down -v
```

**✅ Test 1 Pass Criteria:**
- [ ] All containers start successfully
- [ ] Health checks pass
- [ ] Backend responds to API calls
- [ ] Frontend loads in browser
- [ ] MongoDB connection successful

---

## ☸️ Test 2: Kubernetes Deployment (Minikube/Kind)

### Step 2.1: Start Local Kubernetes Cluster

**Option A: Minikube**
```bash
# Start Minikube
minikube start --memory=4096 --cpus=2

# Verify cluster is running
kubectl cluster-info

# Enable ingress (optional)
minikube addons enable ingress
```

**Option B: Kind**
```bash
# Create cluster
kind create cluster --name mern-cluster

# Verify
kubectl cluster-info
```

### Step 2.2: Update Configuration

```bash
# Navigate to k8s directory
cd /home/amira/Desktop/MERN/k8s

# IMPORTANT: Update Docker Hub username in deployment files
# Replace 'your-dockerhub-username' with your actual Docker Hub username

# Edit backend deployment
nano backend/deployment.yaml
# Find: your-dockerhub-username/mern-backend:latest
# Replace with: YOUR_USERNAME/mern-backend:latest

# Edit frontend deployment
nano frontend/deployment.yaml
# Find: your-dockerhub-username/mern-frontend:latest
# Replace with: YOUR_USERNAME/mern-frontend:latest
```

**OR use sed to replace:**
```bash
export DOCKER_HUB_USERNAME="your-actual-username"

# Update backend
sed -i "s|your-dockerhub-username|${DOCKER_HUB_USERNAME}|g" backend/deployment.yaml

# Update frontend
sed -i "s|your-dockerhub-username|${DOCKER_HUB_USERNAME}|g" frontend/deployment.yaml
```

### Step 2.3: Deploy Using Script

```bash
# Make script executable (if not already)
chmod +x deploy.sh

# Set Docker Hub username
export DOCKER_HUB_USERNAME="your-actual-username"

# Run deployment script
./deploy.sh
```

**OR deploy manually:**

```bash
# 1. Create namespace
kubectl apply -f namespace.yaml

# 2. Create ConfigMap and Secrets
kubectl apply -f configmap.yaml

# 3. Deploy MongoDB
kubectl apply -f mongodb/deployment.yaml
kubectl apply -f mongodb/service.yaml

# 4. Wait for MongoDB to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n mern-app --timeout=120s

# 5. Deploy Backend
kubectl apply -f backend/deployment.yaml
kubectl apply -f backend/service.yaml

# 6. Deploy Frontend
kubectl apply -f frontend/deployment.yaml
kubectl apply -f frontend/service.yaml
```

### Step 2.4: Verify Deployment

```bash
# Check namespace
kubectl get namespace mern-app

# Check all pods
kubectl get pods -n mern-app

# Expected output (all pods should be Running):
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-xxxxxxxxxx-xxxxx     1/1     Running   0          2m
# frontend-xxxxxxxxxx-xxxxx    1/1     Running   0          2m
# mongodb-xxxxxxxxxx-xxxxx     1/1     Running   0          3m

# Check services
kubectl get svc -n mern-app

# Check deployments
kubectl get deployments -n mern-app

# Check pod logs
kubectl logs -f deployment/backend -n mern-app
kubectl logs -f deployment/frontend -n mern-app
kubectl logs -f deployment/mongodb -n mern-app
```

### Step 2.5: Test Services via Port Forwarding

```bash
# Terminal 1: Forward backend
kubectl port-forward -n mern-app svc/backend-service 5000:5000

# Terminal 2: Forward frontend
kubectl port-forward -n mern-app svc/frontend-service 8080:80

# Terminal 3: Test endpoints
curl http://localhost:5000/api/health
curl http://localhost:8080/health

# Open browser:
# Frontend: http://localhost:8080
# Backend: http://localhost:5000/api/health
```

### Step 2.6: Test Ingress (if deployed)

```bash
# Apply ingress
kubectl apply -f ingress.yaml

# Get ingress IP (Minikube)
minikube ip

# Add to /etc/hosts (or use curl with Host header)
# Example: echo "192.168.49.2 mern-app.local" | sudo tee -a /etc/hosts

# Test ingress
curl -H "Host: mern-app.local" http://$(minikube ip)/
curl -H "Host: mern-app.local" http://$(minikube ip)/api/health
```

### Step 2.7: Cleanup

```bash
# Delete all resources
kubectl delete -f . --recursive

# Delete namespace
kubectl delete namespace mern-app

# Stop Minikube (if using)
minikube stop
```

**✅ Test 2 Pass Criteria:**
- [ ] All pods are Running
- [ ] Services are created and accessible
- [ ] Port forwarding works
- [ ] Health endpoints respond
- [ ] Application functions correctly

---

## 📦 Test 3: Helm Chart Deployment

### Step 3.1: Update Helm Values

```bash
cd /home/amira/Desktop/MERN/helm

# Edit values.yaml
nano values.yaml

# Update these values:
# - backend.image.repository: your-username/mern-backend
# - frontend.image.repository: your-username/mern-frontend
# - secrets.jwtSecret: your-secret-key
# - mongodb.auth.rootPassword: your-password
```

### Step 3.2: Validate Helm Chart

```bash
# Lint the chart
helm lint ./helm

# Dry run (test without deploying)
helm install mern-app ./helm \
  --namespace mern-app \
  --create-namespace \
  --dry-run \
  --debug
```

### Step 3.3: Install Helm Chart

```bash
# Install the chart
helm install mern-app ./helm \
  --namespace mern-app \
  --create-namespace \
  --set backend.image.repository=your-username/mern-backend \
  --set frontend.image.repository=your-username/mern-frontend

# Check installation
helm list -n mern-app

# Check status
helm status mern-app -n mern-app
```

### Step 3.4: Verify Helm Deployment

```bash
# Check all resources
kubectl get all -n mern-app

# Check Helm release
helm get manifest mern-app -n mern-app

# Check values
helm get values mern-app -n mern-app
```

### Step 3.5: Upgrade Test

```bash
# Upgrade with new values
helm upgrade mern-app ./helm \
  --namespace mern-app \
  --set backend.replicaCount=3 \
  --set frontend.replicaCount=2

# Verify upgrade
kubectl get deployments -n mern-app
```

### Step 3.6: Rollback Test

```bash
# Check revision history
helm history mern-app -n mern-app

# Rollback to previous version
helm rollback mern-app -n mern-app

# Verify rollback
helm status mern-app -n mern-app
```

### Step 3.7: Cleanup

```bash
# Uninstall chart
helm uninstall mern-app -n mern-app

# Delete namespace
kubectl delete namespace mern-app
```

**✅ Test 3 Pass Criteria:**
- [ ] Helm chart validates successfully
- [ ] Chart installs without errors
- [ ] All resources are created
- [ ] Upgrade works correctly
- [ ] Rollback works correctly

---

## 🔄 Test 4: CI/CD Pipeline (Jenkins)

### Step 4.1: Setup Jenkins

```bash
# If Jenkins is not installed, install it:

# Using Docker:
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# Get initial admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Step 4.2: Configure Jenkins

1. **Access Jenkins UI:** http://localhost:8080
2. **Install Plugins:**
   - Docker Pipeline
   - Docker
   - Credentials Binding

3. **Configure Credentials:**
   - Go to: Manage Jenkins → Credentials → System → Global credentials
   - Add Secret text:
     - ID: `docker-hub-credentials`
     - Secret: Your Docker Hub password/token
   - Add Secret text:
     - ID: `docker-hub-username`
     - Secret: Your Docker Hub username

### Step 4.3: Create Pipeline Job

1. **New Item** → **Pipeline**
2. **Pipeline name:** `mern-app-pipeline`
3. **Pipeline definition:** Pipeline script from SCM
4. **SCM:** Git
5. **Repository URL:** Your repository URL (or local path)
6. **Script Path:** `Jenkinsfile`
7. **Save**

### Step 4.4: Update Jenkinsfile

```bash
# Edit Jenkinsfile
nano /home/amira/Desktop/MERN/Jenkinsfile

# Update line 9:
DOCKER_HUB_REPO = 'your-actual-dockerhub-username'
```

### Step 4.5: Run Pipeline

1. Click **"Build Now"** in Jenkins UI
2. Watch the build progress
3. Check console output

**Expected Stages:**
- ✅ Build Backend
- ✅ Build Frontend
- ✅ Scan Backend
- ✅ Scan Frontend
- ✅ Push to Docker Hub

### Step 4.6: Verify Pipeline Results

```bash
# Check Docker Hub for pushed images
docker pull your-username/mern-backend:latest
docker pull your-username/mern-frontend:latest

# Verify images exist
docker images | grep mern
```

**✅ Test 4 Pass Criteria:**
- [ ] Pipeline runs successfully
- [ ] Images are built
- [ ] Security scan completes
- [ ] Images are pushed to Docker Hub
- [ ] No critical vulnerabilities found

---

## 📊 Test 5: Monitoring (Prometheus & Grafana)

### Step 5.1: Deploy Prometheus

```bash
cd /home/amira/Desktop/MERN/k8s/monitoring

# Deploy Prometheus
kubectl apply -f prometheus-configmap.yaml
kubectl apply -f prometheus-rbac.yaml
kubectl apply -f prometheus-deployment.yaml
kubectl apply -f prometheus-service.yaml

# Wait for Prometheus to be ready
kubectl wait --for=condition=ready pod -l app=prometheus -n mern-app --timeout=120s
```

### Step 5.2: Verify Prometheus

```bash
# Check Prometheus pod
kubectl get pods -n mern-app | grep prometheus

# Port forward Prometheus
kubectl port-forward -n mern-app svc/prometheus-service 9090:9090

# Access Prometheus UI: http://localhost:9090
# Check targets: http://localhost:9090/targets
# Check metrics: http://localhost:9090/metrics
```

### Step 5.3: Deploy Grafana

```bash
# Deploy Grafana
kubectl apply -f grafana-secrets.yaml
kubectl apply -f grafana-datasources.yaml
kubectl apply -f grafana-dashboards.yaml
kubectl apply -f grafana-deployment.yaml
kubectl apply -f grafana-service.yaml

# Wait for Grafana to be ready
kubectl wait --for=condition=ready pod -l app=grafana -n mern-app --timeout=120s
```

### Step 5.4: Verify Grafana

```bash
# Check Grafana pod
kubectl get pods -n mern-app | grep grafana

# Port forward Grafana
kubectl port-forward -n mern-app svc/grafana-service 3000:3000

# Access Grafana UI: http://localhost:3000
# Login: admin / admin123
# Verify Prometheus datasource is configured
```

### Step 5.5: Test Metrics Collection

```bash
# Check if backend exposes metrics (if configured)
curl http://localhost:5000/api/metrics

# In Prometheus UI, try queries:
# - up
# - rate(http_requests_total[5m])
# - container_memory_usage_bytes
```

**✅ Test 5 Pass Criteria:**
- [ ] Prometheus is running
- [ ] Prometheus can scrape targets
- [ ] Grafana is running
- [ ] Grafana can connect to Prometheus
- [ ] Metrics are being collected

---

## 🔄 Test 6: GitOps (ArgoCD) - Optional

### Step 6.1: Install ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD to be ready
kubectl wait --for=condition=ready pod -l app.kubernetes.io/name=argocd-server -n argocd --timeout=300s
```

### Step 6.2: Access ArgoCD

```bash
# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d && echo

# Port forward ArgoCD
kubectl port-forward svc/argocd-server -n argocd 8080:443

# Access: https://localhost:8080
# Username: admin
# Password: (from above command)
```

### Step 6.3: Deploy Application via ArgoCD

```bash
cd /home/amira/Desktop/MERN/k8s

# Update argocd-application.yaml with your repository URL
nano argocd-application.yaml

# Apply ArgoCD application
kubectl apply -f argocd-application.yaml

# Check application status
kubectl get applications -n argocd
```

### Step 6.4: Verify ArgoCD Sync

```bash
# Check application sync status
kubectl describe application mern-app -n argocd

# In ArgoCD UI, verify:
# - Application is synced
# - All resources are healthy
# - Auto-sync is enabled
```

**✅ Test 6 Pass Criteria:**
- [ ] ArgoCD is installed
- [ ] Application is created
- [ ] Application syncs successfully
- [ ] Resources are deployed
- [ ] Auto-sync works

---

## 🧪 Complete Test Suite

Run all tests in sequence:

```bash
#!/bin/bash
# Complete test script

echo "🧪 Starting Complete Test Suite..."

# Test 1: Docker Compose
echo "Test 1: Docker Compose..."
cd /home/amira/Desktop/MERN
docker-compose up -d --build
sleep 30
curl -f http://localhost:5000/api/health && echo "✅ Backend OK" || echo "❌ Backend Failed"
curl -f http://localhost:5173/health && echo "✅ Frontend OK" || echo "❌ Frontend Failed"
docker-compose down

# Test 2: Kubernetes
echo "Test 2: Kubernetes..."
cd k8s
./deploy.sh
sleep 60
kubectl get pods -n mern-app | grep Running && echo "✅ K8s OK" || echo "❌ K8s Failed"

# Test 3: Helm
echo "Test 3: Helm..."
cd ../helm
helm install mern-app-test ./helm -n mern-app --create-namespace --dry-run && echo "✅ Helm OK" || echo "❌ Helm Failed"

echo "🧪 Test Suite Complete!"
```

---

## 📝 Troubleshooting Common Issues

### Issue: Containers won't start
```bash
# Check logs
docker-compose logs
kubectl logs -n mern-app <pod-name>

# Check resources
docker stats
kubectl top pods -n mern-app
```

### Issue: Image pull errors
```bash
# Verify image exists
docker pull your-image:tag

# Check image pull secrets
kubectl get secrets -n mern-app
```

### Issue: Services not accessible
```bash
# Check service endpoints
kubectl get endpoints -n mern-app

# Verify port forwarding
kubectl port-forward -n mern-app svc/<service-name> <local-port>:<service-port>
```

### Issue: Prometheus not scraping
```bash
# Check Prometheus targets
# Access: http://localhost:9090/targets

# Verify service discovery
kubectl get pods -n mern-app -o wide
```

---

## ✅ Final Verification Checklist

- [ ] Docker Compose: All services running and healthy
- [ ] Kubernetes: All pods Running, services accessible
- [ ] Helm: Chart installs and upgrades successfully
- [ ] Jenkins: Pipeline runs and pushes images
- [ ] Prometheus: Scraping targets successfully
- [ ] Grafana: Connected to Prometheus, dashboards working
- [ ] ArgoCD: Application syncs successfully (if tested)
- [ ] Application: Full functionality tested end-to-end

---

**🎉 If all tests pass, your DevOps setup is complete and working!**
