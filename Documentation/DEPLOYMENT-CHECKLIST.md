# Deployment Checklist

Use this checklist to ensure a successful deployment of the MERN stack application.

## 📋 Pre-Deployment Checklist

### Environment Setup
- [ ] Docker and Docker Compose installed
- [ ] kubectl installed and configured
- [ ] Kubernetes cluster accessible (Minikube/Kind/Cloud)
- [ ] Helm installed (for Helm deployment)
- [ ] Docker Hub account created
- [ ] Jenkins installed and configured (for CI/CD)

### Configuration Updates
- [ ] Updated Docker Hub username in `Jenkinsfile`
- [ ] Updated Docker Hub username in `k8s/backend/deployment.yaml`
- [ ] Updated Docker Hub username in `k8s/frontend/deployment.yaml`
- [ ] Updated Docker Hub username in `helm/values.yaml`
- [ ] Changed default passwords in `k8s/configmap.yaml`
- [ ] Changed Grafana admin password in `k8s/monitoring/grafana-secrets.yaml`
- [ ] Updated JWT_SECRET in secrets
- [ ] Updated domain/hostname in `k8s/ingress.yaml` (if using ingress)
- [ ] Updated domain/hostname in `helm/values.yaml` (if using Helm)
- [ ] Updated repository URL in `k8s/argocd-application.yaml` (if using ArgoCD)

### Security
- [ ] All default passwords changed
- [ ] Secrets properly configured
- [ ] JWT secret is strong and unique
- [ ] Docker Hub credentials secured in Jenkins
- [ ] Kubernetes secrets created (not using default values)

## 🐳 Docker Compose Deployment

### Local Development
- [ ] Created `.env` file from `.env.example`
- [ ] Updated all environment variables in `.env`
- [ ] Built images: `docker-compose build`
- [ ] Started services: `docker-compose up -d`
- [ ] Verified backend health: `curl http://localhost:5000/api/health`
- [ ] Verified frontend: `curl http://localhost:5173/health`
- [ ] Checked logs: `docker-compose logs -f`
- [ ] Tested application functionality

## ☸️ Kubernetes Deployment

### Prerequisites
- [ ] Kubernetes cluster running
- [ ] kubectl configured to access cluster
- [ ] Namespace created or will be created

### Direct Manifest Deployment
- [ ] Applied namespace: `kubectl apply -f k8s/namespace.yaml`
- [ ] Applied ConfigMap: `kubectl apply -f k8s/configmap.yaml`
- [ ] Deployed MongoDB: `kubectl apply -f k8s/mongodb/`
- [ ] Verified MongoDB is ready: `kubectl get pods -n mern-app`
- [ ] Deployed backend: `kubectl apply -f k8s/backend/`
- [ ] Deployed frontend: `kubectl apply -f k8s/frontend/`
- [ ] Applied ingress (optional): `kubectl apply -f k8s/ingress.yaml`
- [ ] Verified all pods are running: `kubectl get pods -n mern-app`
- [ ] Verified services: `kubectl get svc -n mern-app`
- [ ] Tested port-forwarding for access

### Helm Deployment
- [ ] Updated `helm/values.yaml` with your values
- [ ] Installed chart: `helm install mern-app ./helm -n mern-app --create-namespace`
- [ ] Verified installation: `helm list -n mern-app`
- [ ] Checked pod status: `kubectl get pods -n mern-app`
- [ ] Tested application access

## 🔄 CI/CD Pipeline

### Jenkins Setup
- [ ] Jenkins installed and running
- [ ] Docker Pipeline plugin installed
- [ ] Docker credentials configured in Jenkins
- [ ] Docker Hub username credential added
- [ ] Docker Hub password/token credential added
- [ ] Pipeline job created from `Jenkinsfile`
- [ ] Repository URL configured in pipeline
- [ ] Pipeline executed successfully
- [ ] Images built and pushed to Docker Hub
- [ ] Security scan completed without critical issues

### GitLab CI (Alternative)
- [ ] `.gitlab-ci.yml` created (if using GitLab)
- [ ] CI/CD variables configured
- [ ] Pipeline runs successfully
- [ ] Images pushed to registry

## 📊 Monitoring Setup

### Prometheus
- [ ] Prometheus ConfigMap applied: `kubectl apply -f k8s/monitoring/prometheus-configmap.yaml`
- [ ] Prometheus deployed: `kubectl apply -f k8s/monitoring/prometheus-deployment.yaml`
- [ ] Prometheus service created: `kubectl apply -f k8s/monitoring/prometheus-service.yaml`
- [ ] Prometheus accessible: `kubectl port-forward -n mern-app svc/prometheus-service 9090:9090`
- [ ] Verified targets are being scraped: http://localhost:9090/targets
- [ ] Backend metrics endpoint configured (if applicable)

### Grafana
- [ ] Grafana secrets created: `kubectl apply -f k8s/monitoring/grafana-secrets.yaml`
- [ ] Grafana datasources configured: `kubectl apply -f k8s/monitoring/grafana-datasources.yaml`
- [ ] Grafana dashboards configured: `kubectl apply -f k8s/monitoring/grafana-dashboards.yaml`
- [ ] Grafana deployed: `kubectl apply -f k8s/monitoring/grafana-deployment.yaml`
- [ ] Grafana service created: `kubectl apply -f k8s/monitoring/grafana-service.yaml`
- [ ] Grafana accessible: `kubectl port-forward -n mern-app svc/grafana-service 3000:3000`
- [ ] Logged into Grafana (default: admin/admin123)
- [ ] Verified Prometheus datasource connection
- [ ] Created/imported dashboards

## 🔄 GitOps (ArgoCD)

### ArgoCD Setup
- [ ] ArgoCD installed: `kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml`
- [ ] ArgoCD admin password retrieved
- [ ] ArgoCD UI accessible
- [ ] Repository access configured
- [ ] ArgoCD application created: `kubectl apply -f k8s/argocd-application.yaml`
- [ ] Application synced successfully
- [ ] Verified auto-sync is working

## ✅ Post-Deployment Verification

### Application Health
- [ ] Backend health endpoint responding: `/api/health`
- [ ] Frontend accessible and loading
- [ ] Database connection working
- [ ] API endpoints responding correctly
- [ ] Frontend can communicate with backend
- [ ] Authentication flow working (if applicable)

### Performance
- [ ] Response times acceptable
- [ ] No memory leaks detected
- [ ] CPU usage within limits
- [ ] Database queries optimized

### Monitoring
- [ ] Metrics being collected
- [ ] Dashboards showing data
- [ ] Alerts configured (if applicable)
- [ ] Logs accessible and readable

### Security
- [ ] No exposed sensitive data
- [ ] HTTPS configured (production)
- [ ] Secrets properly managed
- [ ] Network policies configured (if applicable)
- [ ] RBAC configured correctly

## 🧹 Cleanup (if needed)

### Docker Compose
- [ ] Stopped services: `docker-compose down`
- [ ] Removed volumes: `docker-compose down -v`

### Kubernetes
- [ ] Removed deployments: `kubectl delete -f k8s/`
- [ ] Removed namespace: `kubectl delete namespace mern-app`
- [ ] Cleaned up persistent volumes

### Helm
- [ ] Uninstalled chart: `helm uninstall mern-app -n mern-app`
- [ ] Removed namespace: `kubectl delete namespace mern-app`

## 📝 Documentation

- [ ] README-DEVOPS.md reviewed
- [ ] QUICKSTART.md reviewed
- [ ] Team members informed of deployment
- [ ] Access credentials documented securely
- [ ] Troubleshooting guide reviewed

## 🎯 Production Readiness

### Before Going to Production
- [ ] All secrets changed from defaults
- [ ] Resource limits configured appropriately
- [ ] Backup strategy in place
- [ ] Disaster recovery plan documented
- [ ] Monitoring and alerting configured
- [ ] Log aggregation set up
- [ ] SSL/TLS certificates configured
- [ ] Domain DNS configured
- [ ] Load balancer configured
- [ ] Auto-scaling configured (if applicable)
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Documentation updated

---

## 🆘 Troubleshooting

If any step fails:
1. Check logs: `kubectl logs -n mern-app <pod-name>` or `docker-compose logs`
2. Verify configuration files
3. Check resource availability
4. Review the Troubleshooting section in `README-DEVOPS.md`
5. Verify network connectivity
6. Check service endpoints: `kubectl get endpoints -n mern-app`

---

**Check off items as you complete them. Good luck with your deployment! 🚀**
