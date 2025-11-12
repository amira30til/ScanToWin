# Quick Start Guide

This guide will help you quickly get started with the MERN Stack DevOps setup.

## 🚀 Quick Start Options

### Option 1: Docker Compose (Fastest - Local Development)

```bash
# 1. Create .env file (copy from .env.example)
cp .env.example .env

# 2. Update .env with your values
nano .env

# 3. Start all services
docker-compose up -d --build

# 4. Access services
# Frontend: http://localhost:5173
# Backend: http://localhost:5000/api
```

### Option 2: Kubernetes (Minikube)

```bash
# 1. Start Minikube
minikube start --memory=4096 --cpus=2

# 2. Set your Docker Hub username
export DOCKER_HUB_USERNAME=your-username

# 3. Deploy using script
cd k8s
./deploy.sh

# 4. Port forward to access
kubectl port-forward -n mern-app svc/frontend-service 8080:80
kubectl port-forward -n mern-app svc/backend-service 5000:5000
```

### Option 3: Helm Chart

```bash
# 1. Update helm/values.yaml with your image repositories

# 2. Install chart
helm install mern-app ./helm \
  --namespace mern-app \
  --create-namespace \
  --set backend.image.repository=your-username/mern-backend \
  --set frontend.image.repository=your-username/mern-frontend

# 3. Check status
helm status mern-app -n mern-app
```

## 📋 Prerequisites Checklist

- [ ] Docker & Docker Compose installed
- [ ] kubectl installed (for Kubernetes)
- [ ] Minikube/Kind installed (for local K8s)
- [ ] Helm installed (for Helm charts)
- [ ] Docker Hub account (for CI/CD)

## 🔧 Common Commands

### Docker Compose
```bash
docker-compose up -d          # Start services
docker-compose down           # Stop services
docker-compose logs -f        # View logs
docker-compose ps             # Check status
```

### Kubernetes
```bash
kubectl get pods -n mern-app           # List pods
kubectl get svc -n mern-app            # List services
kubectl logs -f deployment/backend -n mern-app  # View logs
kubectl describe pod <pod-name> -n mern-app      # Describe pod
```

### Helm
```bash
helm install mern-app ./helm -n mern-app --create-namespace
helm upgrade mern-app ./helm -n mern-app
helm uninstall mern-app -n mern-app
helm list -n mern-app
```

## 🐛 Troubleshooting

### Docker Compose
- **Port already in use**: Change ports in `docker-compose.yml`
- **Container won't start**: Check logs with `docker-compose logs`

### Kubernetes
- **Pods not starting**: Check logs with `kubectl logs`
- **Image pull errors**: Verify image exists and credentials are correct
- **Services not accessible**: Check service endpoints with `kubectl get endpoints`

## 📚 Next Steps

1. Read the full [README-DEVOPS.md](./README-DEVOPS.md) for detailed documentation
2. Set up CI/CD pipeline with Jenkins (see `Jenkinsfile`)
3. Configure monitoring with Prometheus and Grafana (see `k8s/monitoring/`)
4. Set up GitOps with ArgoCD (see `k8s/argocd-application.yaml`)

## 🆘 Need Help?

- Check the [Troubleshooting](./README-DEVOPS.md#troubleshooting) section
- Review logs: `docker-compose logs` or `kubectl logs`
- Verify configuration files are correct

---

**Happy Deploying! 🚀**
