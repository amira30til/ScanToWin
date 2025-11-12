# 🔧 Fix Image Pull Errors

## ❌ **Problem**

Your pods show `ErrImagePull` / `ImagePullBackOff` errors. This means Kubernetes cannot pull images from Docker Hub.

## 🔍 **Common Causes**

1. **Images are private** - Need to make them public on Docker Hub
2. **Images don't exist** - Need to verify they're pushed
3. **Authentication needed** - Need to create image pull secret

---

## ✅ **Solution 1: Make Images Public (Easiest)**

### **Step 1: Go to Docker Hub**

1. Visit: https://hub.docker.com/
2. Login to your account (`amira30til`)
3. Go to your repositories:
   - https://hub.docker.com/r/amira30til/mern-backend
   - https://hub.docker.com/r/amira30til/mern-frontend

### **Step 2: Make Repositories Public**

1. Click on repository (e.g., `mern-backend`)
2. Go to **Settings** tab
3. Scroll to **Visibility** section
4. Change from **Private** to **Public**
5. Click **Save**
6. Repeat for `mern-frontend`

### **Step 3: Restart Pods**

```bash
# Delete pods to force re-pull
kubectl delete pods -n mern-app -l app=backend
kubectl delete pods -n mern-app -l app=frontend

# Or restart deployments
kubectl rollout restart deployment/backend -n mern-app
kubectl rollout restart deployment/frontend -n mern-app

# Check status
kubectl get pods -n mern-app
```

---

## ✅ **Solution 2: Verify Images Exist**

### **Check if images are on Docker Hub:**

```bash
# Check backend image
docker pull amira30til/mern-backend:latest

# Check frontend image
docker pull amira30til/mern-frontend:latest
```

If these fail, the images might not be pushed. Run Jenkins pipeline again to push them.

---

## ✅ **Solution 3: Use Local Images (For Testing)**

If you want to use images from your local Docker:

### **For Minikube:**

```bash
# Load local images into Minikube
minikube image load mern-backend:latest
minikube image load mern-frontend:latest

# Update deployments to use local images
kubectl set image deployment/backend backend=mern-backend:latest -n mern-app
kubectl set image deployment/frontend frontend=mern-frontend:latest -n mern-app
```

### **For Kind:**

```bash
# Load local images into Kind
kind load docker-image mern-backend:latest --name mern-cluster
kind load docker-image mern-frontend:latest --name mern-cluster

# Update deployments
kubectl set image deployment/backend backend=mern-backend:latest -n mern-app
kubectl set image deployment/frontend frontend=mern-frontend:latest -n mern-app
```

---

## ✅ **Solution 4: Create Image Pull Secret (If Private)**

If you want to keep images private:

```bash
# Create secret for Docker Hub
kubectl create secret docker-registry dockerhub-secret \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=amira30til \
  --docker-password=<YOUR_DOCKER_HUB_TOKEN> \
  --docker-email=<YOUR_EMAIL> \
  -n mern-app

# Update deployments to use secret
kubectl patch deployment backend -n mern-app -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"dockerhub-secret"}]}}}}'
kubectl patch deployment frontend -n mern-app -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"dockerhub-secret"}]}}}}'
```

---

## 🎯 **Recommended: Make Images Public**

**Easiest solution:** Make your Docker Hub repositories public.

1. Go to Docker Hub
2. Make `mern-backend` public
3. Make `mern-frontend` public
4. Restart pods:

```bash
kubectl rollout restart deployment/backend -n mern-app
kubectl rollout restart deployment/frontend -n mern-app
kubectl get pods -n mern-app -w
```

---

## 🔍 **Check Current Status**

```bash
# Check pod events for detailed errors
kubectl describe pod -n mern-app -l app=backend | grep -A 20 Events
kubectl describe pod -n mern-app -l app=frontend | grep -A 20 Events

# Check if images exist locally
docker images | grep mern

# Check if images exist on Docker Hub
curl -s https://hub.docker.com/v2/repositories/amira30til/mern-backend/tags/latest
curl -s https://hub.docker.com/v2/repositories/amira30til/mern-frontend/tags/latest
```

---

## ✅ **After Fixing**

Once images are accessible:

```bash
# Check pods are running
kubectl get pods -n mern-app

# Should show:
# NAME                        READY   STATUS    RESTARTS   AGE
# backend-xxx                  1/1     Running   0          ...
# frontend-xxx                 1/1     Running   0          ...
# mongodb-xxx                  1/1     Running   0          ...

# Access services
kubectl port-forward -n mern-app svc/backend-service 5000:5000
kubectl port-forward -n mern-app svc/frontend-service 8080:80
```

---

## 📝 **Summary**

**The issue:** Kubernetes cannot pull images from Docker Hub.

**The fix:** Make repositories public OR use local images OR create image pull secret.

**Recommended:** Make repositories public (easiest).
