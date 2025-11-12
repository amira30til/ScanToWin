# MERN Stack DevOps Setup

Complete DevOps implementation for a MERN (MongoDB, Express, React, Node.js) full-stack web application with Docker, Kubernetes, CI/CD, and monitoring.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Local Docker Setup](#local-docker-setup)
- [CI/CD Pipeline](#cicd-pipeline)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Helm Charts](#helm-charts)
- [Monitoring](#monitoring)
- [GitOps with ArgoCD](#gitops-with-argocd)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

This DevOps mini-project demonstrates a complete containerization and deployment pipeline for a MERN stack application, including:

- **Docker** containerization with multi-stage builds
- **Docker Compose** for local development
- **Jenkins CI/CD** pipeline with security scanning
- **Kubernetes** orchestration with production-ready manifests
- **Helm** charts for package management
- **Prometheus & Grafana** for monitoring
- **ArgoCD** for GitOps deployment

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                     │
│                    Port: 80 (Nginx)                         │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ HTTP/API Calls
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                    Backend (Node.js/Express)                │
│                      Port: 5000                             │
└───────────────────────┬─────────────────────────────────────┘
                        │
                        │ MongoDB Connection
                        │
┌───────────────────────▼─────────────────────────────────────┐
│                      MongoDB                                 │
│                    Port: 27017                               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              Monitoring Stack                                │
│  ┌──────────────┐         ┌──────────────┐                 │
│  │  Prometheus  │◄────────│   Grafana    │                 │
│  │   Port: 9090 │         │  Port: 3000  │                 │
│  └──────────────┘         └──────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 📦 Prerequisites

### Required Tools

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **kubectl** (1.19+)
- **Helm** (3.0+)
- **Minikube** or **Kind** (for local Kubernetes)
- **Jenkins** (2.300+) or **GitLab CI**

### Optional Tools

- **ArgoCD** (for GitOps)
- **Trivy** (for security scanning)

---

## 🐳 Local Docker Setup

### 1. Environment Variables

Create a `.env` file in the project root:

```bash
# Backend
BACKEND_PORT=5000
MONGO_URI=mongodb://mongodb:27017/scan2win
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
SENDGRID_API_KEY=your-sendgrid-key
MAIL_FROM=noreply@example.com

# Frontend
FRONTEND_PORT=5173
VITE_API_BASE_URL=http://localhost:5000/api
VITE_FRONTEND_URL=http://localhost:5173

# MongoDB
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=admin123
MONGO_DATABASE=scan2win
```

### 2. Build and Run with Docker Compose

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v
```

### 3. Access Services

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **MongoDB**: localhost:27018 (external access)

### 4. Verify Services

```bash
# Check running containers
docker-compose ps

# Check backend health
curl http://localhost:5000/api/health

# Check frontend health
curl http://localhost:5173/health
```

---

## 🔄 CI/CD Pipeline

### Jenkins Pipeline

The `Jenkinsfile` defines a complete CI/CD pipeline with the following stages:

1. **Build**: Builds Docker images for backend and frontend in parallel
2. **Security Scan**: Scans images with Trivy for vulnerabilities
3. **Push**: Pushes validated images to Docker Hub

### Jenkins Setup

#### 1. Install Required Plugins

- Docker Pipeline
- Docker
- Credentials Binding

#### 2. Configure Credentials

In Jenkins → Manage Jenkins → Credentials:

1. Add **Secret text** credential:
   - ID: `docker-hub-credentials`
   - Secret: Your Docker Hub password/token

2. Add **Secret text** credential:
   - ID: `docker-hub-username`
   - Secret: Your Docker Hub username

#### 3. Configure Jenkinsfile

Update the `Jenkinsfile` with your Docker Hub username:

```groovy
DOCKER_HUB_REPO = 'your-dockerhub-username' // Change this
```

#### 4. Create Pipeline Job

1. New Item → Pipeline
2. Pipeline definition: Pipeline script from SCM
3. SCM: Git
4. Repository URL: Your repository URL
5. Script Path: `Jenkinsfile`

#### 5. Run Pipeline

Click "Build Now" to trigger the pipeline.

### GitLab CI Alternative

If using GitLab CI, create `.gitlab-ci.yml`:

```yaml
stages:
  - build
  - security_scan
  - push

variables:
  DOCKER_DRIVER: overlay2
  DOCKER_TLS_CERTDIR: "/certs"

build-backend:
  stage: build
  script:
    - cd backend
    - docker build -t $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA -t $CI_REGISTRY_IMAGE/backend:latest .
  only:
    - main

build-frontend:
  stage: build
  script:
    - cd frontend
    - docker build -t $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA -t $CI_REGISTRY_IMAGE/frontend:latest .
  only:
    - main

security-scan:
  stage: security_scan
  image: aquasec/trivy:latest
  script:
    - trivy image --exit-code 0 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - trivy image --exit-code 0 --severity HIGH,CRITICAL $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA
  only:
    - main

push-images:
  stage: push
  script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
    - docker push $CI_REGISTRY_IMAGE/backend:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE/backend:latest
    - docker push $CI_REGISTRY_IMAGE/frontend:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE/frontend:latest
  only:
    - main
```

---

## ☸️ Kubernetes Deployment

### Local Kubernetes Setup

#### Option 1: Minikube

```bash
# Start Minikube
minikube start --memory=4096 --cpus=2

# Enable ingress addon
minikube addons enable ingress

# Get Minikube IP
minikube ip
```

#### Option 2: Kind

```bash
# Create cluster
kind create cluster --name mern-cluster

# Load images (if built locally)
kind load docker-image mern-backend:latest --name mern-cluster
kind load docker-image mern-frontend:latest --name mern-cluster
```

### Deploy to Kubernetes

#### 1. Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

#### 2. Create ConfigMap and Secrets

```bash
# Update secrets in k8s/configmap.yaml before applying
kubectl apply -f k8s/configmap.yaml
```

#### 3. Deploy MongoDB

```bash
kubectl apply -f k8s/mongodb/deployment.yaml
kubectl apply -f k8s/mongodb/service.yaml
```

#### 4. Deploy Backend

```bash
# Update image name in k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml
```

#### 5. Deploy Frontend

```bash
# Update image name in k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
```

#### 6. Deploy Ingress (Optional)

```bash
# Update host in k8s/ingress.yaml
kubectl apply -f k8s/ingress.yaml
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -n mern-app

# Check services
kubectl get svc -n mern-app

# Check deployments
kubectl get deployments -n mern-app

# View logs
kubectl logs -f deployment/backend -n mern-app
kubectl logs -f deployment/frontend -n mern-app
```

### Port Forwarding (for local access)

```bash
# Backend
kubectl port-forward -n mern-app svc/backend-service 5000:5000

# Frontend
kubectl port-forward -n mern-app svc/frontend-service 8080:80

# MongoDB (for debugging)
kubectl port-forward -n mern-app svc/mongodb-service 27017:27017
```

---

## 📦 Helm Charts

### Install with Helm

#### 1. Update Values

Edit `helm/values.yaml` with your image repositories and tags.

#### 2. Install Chart

```bash
# Install
helm install mern-app ./helm \
  --namespace mern-app \
  --create-namespace \
  --set backend.image.repository=your-dockerhub-username/mern-backend \
  --set frontend.image.repository=your-dockerhub-username/mern-frontend

# Upgrade
helm upgrade mern-app ./helm \
  --namespace mern-app \
  --set backend.image.tag=v1.1.0

# Uninstall
helm uninstall mern-app --namespace mern-app
```

#### 3. Verify Installation

```bash
helm list -n mern-app
helm status mern-app -n mern-app
```

### Custom Values

Create `custom-values.yaml`:

```yaml
backend:
  replicaCount: 3
  image:
    tag: v1.0.0
frontend:
  replicaCount: 2
mongodb:
  persistence:
    size: 20Gi
```

Install with custom values:

```bash
helm install mern-app ./helm -f custom-values.yaml -n mern-app --create-namespace
```

---

## 📊 Monitoring

### Deploy Prometheus and Grafana

```bash
# Deploy Prometheus
kubectl apply -f k8s/monitoring/prometheus-configmap.yaml
kubectl apply -f k8s/monitoring/prometheus-deployment.yaml
kubectl apply -f k8s/monitoring/prometheus-service.yaml

# Deploy Grafana
kubectl apply -f k8s/monitoring/grafana-secrets.yaml
kubectl apply -f k8s/monitoring/grafana-datasources.yaml
kubectl apply -f k8s/monitoring/grafana-dashboards.yaml
kubectl apply -f k8s/monitoring/grafana-deployment.yaml
kubectl apply -f k8s/monitoring/grafana-service.yaml
```

### Access Monitoring

```bash
# Prometheus
kubectl port-forward -n mern-app svc/prometheus-service 9090:9090
# Access at: http://localhost:9090

# Grafana
kubectl port-forward -n mern-app svc/grafana-service 3000:3000
# Access at: http://localhost:3000
# Default credentials: admin / admin123
```

### Add Metrics to Backend

Install `prom-client`:

```bash
cd backend
npm install prom-client
```

Add metrics endpoint to `server.js`:

```javascript
const promClient = require('prom-client');
const register = new promClient.Registry();

promClient.collectDefaultMetrics({ register });

app.get('/api/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

See `k8s/monitoring/README.md` for detailed instructions.

---

## 🔄 GitOps with ArgoCD

### Install ArgoCD

```bash
# Create namespace
kubectl create namespace argocd

# Install ArgoCD
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Get admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d
```

### Access ArgoCD UI

```bash
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

Access at: https://localhost:8080
- Username: `admin`
- Password: (from above command)

### Deploy Application

1. Update `k8s/argocd-application.yaml` with your repository URL
2. Apply the ArgoCD application:

```bash
kubectl apply -f k8s/argocd-application.yaml
```

3. ArgoCD will automatically sync and deploy your application

### Sync Policies

- **Automated**: Automatically syncs when changes are detected
- **Self-Heal**: Automatically corrects drift
- **Prune**: Removes resources no longer in Git

---

## 🚀 Cloud Deployment (Bonus)

### Azure Kubernetes Service (AKS)

```bash
# Create resource group
az group create --name mern-rg --location eastus

# Create AKS cluster
az aks create --resource-group mern-rg --name mern-cluster --node-count 2

# Get credentials
az aks get-credentials --resource-group mern-rg --name mern-cluster

# Deploy
helm install mern-app ./helm -n mern-app --create-namespace
```

### Amazon EKS

```bash
# Create EKS cluster
eksctl create cluster --name mern-cluster --region us-east-1 --node-type t3.medium --nodes 2

# Deploy
helm install mern-app ./helm -n mern-app --create-namespace
```

### Google GKE

```bash
# Create GKE cluster
gcloud container clusters create mern-cluster --zone us-central1-a --num-nodes 2

# Get credentials
gcloud container clusters get-credentials mern-cluster --zone us-central1-a

# Deploy
helm install mern-app ./helm -n mern-app --create-namespace
```

---

## 🔧 Troubleshooting

### Docker Issues

**Problem**: Container won't start
```bash
# Check logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild without cache
docker-compose build --no-cache
```

**Problem**: Port already in use
```bash
# Change ports in docker-compose.yml
# Or stop conflicting services
sudo lsof -i :5000
```

### Kubernetes Issues

**Problem**: Pods in CrashLoopBackOff
```bash
# Check pod logs
kubectl logs -n mern-app <pod-name>

# Describe pod
kubectl describe pod -n mern-app <pod-name>

# Check events
kubectl get events -n mern-app --sort-by='.lastTimestamp'
```

**Problem**: Image pull errors
```bash
# Check image pull secrets
kubectl get secrets -n mern-app

# Verify image exists
docker pull your-image:tag
```

**Problem**: Services not accessible
```bash
# Check service endpoints
kubectl get endpoints -n mern-app

# Verify service selector matches pod labels
kubectl get pods -n mern-app --show-labels
kubectl get svc -n mern-app -o yaml
```

### Monitoring Issues

**Problem**: Prometheus not scraping
```bash
# Check Prometheus targets
# Access: http://localhost:9090/targets

# Verify service discovery
kubectl get pods -n mern-app -o wide
```

**Problem**: Grafana cannot connect to Prometheus
```bash
# Check Grafana datasource
kubectl get configmap -n mern-app grafana-datasources -o yaml

# Verify Prometheus service
kubectl get svc -n mern-app prometheus-service
```

---

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Prometheus Documentation](https://prometheus.io/docs/)
- [Grafana Documentation](https://grafana.com/docs/)
- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)

---

## 📝 Notes

- **Security**: Change all default passwords and secrets before production deployment
- **Storage**: Adjust persistent volume sizes based on your needs
- **Resources**: Modify resource requests/limits based on your cluster capacity
- **Images**: Update Docker Hub image names in all manifests
- **Domains**: Update ingress hostnames for your domain

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

**Happy Deploying! 🚀**
