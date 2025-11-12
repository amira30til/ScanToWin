# 🚀 TEST NOW - Step by Step Guide

Follow these steps **in order** to test your DevOps setup.

## ✅ Step 1: Test Docker Compose (Easiest - Start Here!)

### 1.1: Check if you have a .env file

```bash
cd /home/amira/Desktop/MERN

# Check if .env exists
ls -la .env

# If it doesn't exist, create it from example
cp .env.example .env
```

### 1.2: Update .env file (if needed)

```bash
# Open and edit .env file
nano .env

# Make sure these values are set:
# MONGO_ROOT_USERNAME=admin
# MONGO_ROOT_PASSWORD=admin123
# MONGO_DATABASE=scan2win
# MONGO_URI=mongodb://mongodb:27017/scan2win
# BACKEND_PORT=5000
# FRONTEND_PORT=5173
# JWT_SECRET=test-secret-key-123
# FRONTEND_URL=http://localhost:5173
# VITE_API_BASE_URL=http://localhost:5000/api
# VITE_FRONTEND_URL=http://localhost:5173
```

### 1.3: Stop any running containers

```bash
docker-compose down -v
```

### 1.4: Build and start services

```bash
# Build images (this takes 2-5 minutes)
docker-compose build

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

**Expected output:**
```
NAME                STATUS          PORTS
backend             Up (healthy)    0.0.0.0:5000->5000/tcp
frontend            Up (healthy)    0.0.0.0:5173->80/tcp
mongodb             Up (healthy)    0.0.0.0:27018->27017/tcp
```

### 1.5: Wait for services to be ready (30 seconds)

```bash
# Wait a bit for services to start
sleep 30

# Check logs to see if everything started correctly
docker-compose logs --tail=50
```

### 1.6: Test the services

```bash
# Test backend health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"Server is running"}

# Test frontend health endpoint
curl http://localhost:5173/health

# Expected response:
# healthy

# Check MongoDB connection in backend logs
docker-compose logs backend | grep "MongoDB connected"

# Should see: ✅ MongoDB connected successfully
```

### 1.7: Test in browser

```bash
# Open these URLs in your browser:
# Frontend: http://localhost:5173
# Backend API: http://localhost:5000/api/health
```

### 1.8: View logs (if needed)

```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb
```

### ✅ Success Criteria:
- [ ] All containers show "Up (healthy)"
- [ ] Backend health endpoint returns: `{"status":"OK","message":"Server is running"}`
- [ ] Frontend health endpoint returns: `healthy`
- [ ] MongoDB connection successful in logs
- [ ] Frontend loads in browser

---

## 🔧 Step 2: Troubleshooting Docker Compose

### If containers won't start:

```bash
# Check what's wrong
docker-compose logs

# Check if ports are already in use
sudo lsof -i :5000
sudo lsof -i :5173
sudo lsof -i :27018

# If ports are in use, stop the conflicting service or change ports in docker-compose.yml
```

### If backend won't connect to MongoDB:

```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Try connecting manually
docker-compose exec mongodb mongosh -u admin -p admin123
```

### If images won't build:

```bash
# Build without cache
docker-compose build --no-cache

# Check for errors
docker-compose build 2>&1 | tee build.log
```

---

## ☸️ Step 3: Test Kubernetes (If you have a cluster)

### 3.1: Check if you have Kubernetes

```bash
# Check if kubectl is installed
kubectl version --client

# Check if you have a cluster
kubectl cluster-info

# If you see an error, you need to set up a cluster first
```

### 3.2: Set up local Kubernetes (if needed)

**Option A: Minikube**
```bash
# Install Minikube (if not installed)
# Visit: https://minikube.sigs.k8s.io/docs/start/

# Start Minikube
minikube start --memory=4096 --cpus=2

# Verify
kubectl cluster-info
```

**Option B: Kind**
```bash
# Install Kind (if not installed)
# Visit: https://kind.sigs.k8s.io/docs/user/quick-start/

# Create cluster
kind create cluster --name mern-cluster

# Verify
kubectl cluster-info
```

### 3.3: Update Docker Hub username (IMPORTANT!)

```bash
cd /home/amira/Desktop/MERN/k8s

# Replace 'your-dockerhub-username' with your actual Docker Hub username
# Or set it as environment variable
export DOCKER_HUB_USERNAME="your-actual-username"

# Update files
sed -i "s|your-dockerhub-username|${DOCKER_HUB_USERNAME}|g" backend/deployment.yaml
sed -i "s|your-dockerhub-username|${DOCKER_HUB_USERNAME}|g" frontend/deployment.yaml
```

### 3.4: Deploy to Kubernetes

```bash
# Use the deployment script
./deploy.sh

# OR deploy manually:
kubectl apply -f namespace.yaml
kubectl apply -f configmap.yaml
kubectl apply -f mongodb/
kubectl wait --for=condition=ready pod -l app=mongodb -n mern-app --timeout=120s
kubectl apply -f backend/
kubectl apply -f frontend/
```

### 3.5: Verify deployment

```bash
# Check pods
kubectl get pods -n mern-app

# All pods should show "Running"
# Wait for all pods to be ready (may take 1-2 minutes)

# Check services
kubectl get svc -n mern-app

# Check logs
kubectl logs -f deployment/backend -n mern-app
```

### 3.6: Access services

```bash
# Port forward backend
kubectl port-forward -n mern-app svc/backend-service 5000:5000

# In another terminal, port forward frontend
kubectl port-forward -n mern-app svc/frontend-service 8080:80

# Test
curl http://localhost:5000/api/health
curl http://localhost:8080/health
```

---

## 📦 Step 4: Test Helm Chart (If Helm is installed)

```bash
# Check if Helm is installed
helm version

# If not installed, install it:
# Visit: https://helm.sh/docs/intro/install/
```

### 4.1: Update Helm values

```bash
cd /home/amira/Desktop/MERN/helm

# Edit values.yaml
nano values.yaml

# Update:
# - backend.image.repository: your-username/mern-backend
# - frontend.image.repository: your-username/mern-frontend
```

### 4.2: Validate Helm chart

```bash
# Lint the chart
helm lint .

# Should show: "1 chart(s) linted, no failures"
```

### 4.3: Test installation (dry-run)

```bash
# Test without actually installing
helm install mern-app-test . \
  --namespace mern-app-test \
  --create-namespace \
  --dry-run \
  --debug

# Should show all YAML manifests without errors
```

---

## 🔄 Step 5: Test CI/CD Pipeline (Jenkins)

### 5.1: Install Jenkins (if not installed)

```bash
# Using Docker
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  jenkins/jenkins:lts

# Get admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### 5.2: Configure Jenkins

1. Access: http://localhost:8080
2. Install plugins: Docker Pipeline, Docker, Credentials Binding
3. Add credentials:
   - `docker-hub-credentials`: Your Docker Hub password
   - `docker-hub-username`: Your Docker Hub username

### 5.3: Update Jenkinsfile

```bash
cd /home/amira/Desktop/MERN

# Edit Jenkinsfile
nano Jenkinsfile

# Update line 9:
# DOCKER_HUB_REPO = 'your-actual-dockerhub-username'
```

### 5.4: Create Pipeline Job

1. New Item → Pipeline
2. Pipeline script from SCM
3. Repository: Your repo URL
4. Script Path: `Jenkinsfile`
5. Build Now

---

## 📊 Step 6: Test Monitoring (Optional)

### 6.1: Deploy Prometheus & Grafana

```bash
cd /home/amira/Desktop/MERN/k8s/monitoring

# Deploy Prometheus
kubectl apply -f prometheus-configmap.yaml
kubectl apply -f prometheus-rbac.yaml
kubectl apply -f prometheus-deployment.yaml
kubectl apply -f prometheus-service.yaml

# Deploy Grafana
kubectl apply -f grafana-secrets.yaml
kubectl apply -f grafana-datasources.yaml
kubectl apply -f grafana-dashboards.yaml
kubectl apply -f grafana-deployment.yaml
kubectl apply -f grafana-service.yaml
```

### 6.2: Access Monitoring

```bash
# Prometheus
kubectl port-forward -n mern-app svc/prometheus-service 9090:9090
# Access: http://localhost:9090

# Grafana
kubectl port-forward -n mern-app svc/grafana-service 3000:3000
# Access: http://localhost:3000
# Login: admin / admin123
```

---

## ✅ Quick Test Checklist

Run these commands in order:

```bash
# 1. Verify setup
cd /home/amira/Desktop/MERN
./verify-setup.sh

# 2. Test Docker Compose
docker-compose down -v
docker-compose build
docker-compose up -d
sleep 30
curl http://localhost:5000/api/health
curl http://localhost:5173/health

# 3. Check logs
docker-compose logs --tail=50

# 4. Test in browser
# Open: http://localhost:5173

# 5. Cleanup when done
docker-compose down
```

---

## 🆘 Common Issues & Solutions

### Issue: "Port already in use"
```bash
# Find what's using the port
sudo lsof -i :5000
sudo lsof -i :5173

# Kill the process or change ports in docker-compose.yml
```

### Issue: "Cannot connect to MongoDB"
```bash
# Check MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Issue: "Backend won't start"
```bash
# Check backend logs
docker-compose logs backend

# Common issues:
# - Missing .env file
# - Wrong MONGO_URI
# - Port conflict
```

---

## 🎯 Recommended Testing Order

1. ✅ **Docker Compose** (Easiest - Do this first!)
2. ✅ **Kubernetes** (If you have a cluster)
3. ✅ **Helm** (If Helm is installed)
4. ✅ **CI/CD** (If Jenkins is set up)
5. ✅ **Monitoring** (Optional)

---

**Start with Docker Compose - it's the easiest way to test everything! 🚀**
