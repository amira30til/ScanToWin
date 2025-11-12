# MERN App Helm Chart

This Helm chart deploys a complete MERN stack application (MongoDB, Express, React, Node.js) on Kubernetes.

## Prerequisites

- Kubernetes 1.19+
- Helm 3.0+
- Ingress controller (nginx-ingress recommended)

## Installation

### Install the chart

```bash
# Add your custom values
helm install mern-app ./helm \
  --namespace mern-app \
  --create-namespace \
  --set backend.image.repository=your-dockerhub-username/mern-backend \
  --set frontend.image.repository=your-dockerhub-username/mern-frontend
```

### Upgrade the chart

```bash
helm upgrade mern-app ./helm \
  --namespace mern-app \
  --set backend.image.tag=v1.1.0 \
  --set frontend.image.tag=v1.1.0
```

### Uninstall the chart

```bash
helm uninstall mern-app --namespace mern-app
```

## Configuration

See `values.yaml` for all configurable parameters.

### Key Parameters

- `backend.image.repository`: Backend Docker image repository
- `backend.image.tag`: Backend Docker image tag
- `frontend.image.repository`: Frontend Docker image repository
- `frontend.image.tag`: Frontend Docker image tag
- `mongodb.persistence.size`: MongoDB persistent volume size
- `ingress.enabled`: Enable/disable ingress
- `ingress.hosts`: Ingress host configuration

## ArgoCD Integration

To deploy via ArgoCD (GitOps):

1. Create an ArgoCD Application manifest:

```yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: mern-app
  namespace: argocd
spec:
  project: default
  source:
    repoURL: https://github.com/your-org/mern-app
    targetRevision: main
    path: helm
  destination:
    server: https://kubernetes.default.svc
    namespace: mern-app
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
```

2. Apply the ArgoCD application:

```bash
kubectl apply -f argocd-application.yaml
```

3. ArgoCD will automatically sync and deploy the application.
