# ⚡ Quick Guide: Show Helm Charts & ArgoCD

## 🚀 **Fastest Way to Demonstrate**

### **Option 1: Run Automated Script**

```bash
cd /home/amira/Desktop/MERN
./show-helm-argocd.sh
```

This shows everything automatically!

---

## 🎯 **Option 2: Manual Demonstration**

### **Show Helm Charts (2 minutes):**

```bash
cd /home/amira/Desktop/MERN/helm

# 1. Show structure
ls -la

# 2. Show Chart.yaml
cat Chart.yaml

# 3. Show values.yaml
head -50 values.yaml

# 4. Show templates
ls templates/
cat templates/backend/deployment.yaml | head -30

# 5. Validate (if helm installed)
helm lint .
```

**Say:** "J'ai créé un chart Helm complet avec Chart.yaml, values.yaml, et tous les templates Kubernetes."

---

### **Show ArgoCD (1 minute):**

```bash
cd /home/amira/Desktop/MERN/k8s

# Show ArgoCD manifest
cat argocd-application.yaml
```

**Say:** "J'ai configuré ArgoCD pour GitOps avec synchronisation automatique depuis Git vers Kubernetes."

---

## 📋 **What to Show**

### **Helm Charts:**
1. ✅ `Chart.yaml` - Metadata
2. ✅ `values.yaml` - Configurable values
3. ✅ `templates/` - All Kubernetes templates
4. ✅ Validation (helm lint)

### **ArgoCD:**
1. ✅ `argocd-application.yaml` - GitOps config
2. ✅ Source: Git repository
3. ✅ Destination: Kubernetes cluster
4. ✅ Auto-sync: Enabled

---

## 🎬 **Quick Demo Commands**

```bash
# All in one
cd /home/amira/Desktop/MERN && \
echo "=== HELM ===" && \
cd helm && ls -la && cat Chart.yaml && \
echo "" && echo "=== ARGOCD ===" && \
cd ../k8s && cat argocd-application.yaml
```

---

## ✅ **Checklist**

- [ ] Helm Chart.yaml shown
- [ ] Helm values.yaml shown
- [ ] Helm templates shown
- [ ] Helm validation (if possible)
- [ ] ArgoCD manifest shown
- [ ] GitOps workflow explained

---

**That's it!** 🎉
