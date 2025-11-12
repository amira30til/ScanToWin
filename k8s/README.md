# Apply all manifests in order
# Usage: kubectl apply -f k8s/

# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Deploy MongoDB
kubectl apply -f k8s/mongodb/

# 3. Deploy Backend
kubectl apply -f k8s/backend/

# 4. Deploy Frontend
kubectl apply -f k8s/frontend/

# 5. Deploy Monitoring (optional)
kubectl apply -f k8s/monitoring/
