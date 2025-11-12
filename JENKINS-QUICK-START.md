# 🚀 Jenkins Quick Start - Complete Setup

## ✅ Current Status

**Jenkins is running but needs Docker access to build images.**

---

## 🔧 Fix Docker Access (IMPORTANT!)

Run this command to recreate Jenkins with Docker access:

```bash
cd /home/amira/Desktop/MERN
./fix-jenkins-docker.sh
```

**OR manually:**

```bash
# Stop and remove existing Jenkins
docker stop jenkins
docker rm jenkins

# Create Jenkins with Docker socket access
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

# Wait 30 seconds, then get password
sleep 30
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

---

## 📋 Complete Setup Steps

### **1. Access Jenkins**

- **URL:** http://localhost:8080
- **Password:** (Get it with the command above)

### **2. Install Plugins**

- Click **"Install suggested plugins"**
- Wait for installation

### **3. Create Admin User**

- Fill in the form
- Save

### **4. Add Docker Hub Credentials**

Go to: **Manage Jenkins → Credentials → System → Global credentials**

**Add Credential 1:**
- Kind: Secret text
- Secret: Your Docker Hub password/token
- ID: `docker-hub-credentials`
- Create

**Add Credential 2:**
- Kind: Secret text
- Secret: Your Docker Hub username
- ID: `docker-hub-username`
- Create

### **5. Update Jenkinsfile**

```bash
cd /home/amira/Desktop/MERN
nano Jenkinsfile

# Update line 9:
DOCKER_HUB_REPO = 'your-actual-dockerhub-username'
```

### **6. Push to Git**

```bash
git add .
git commit -m "Add CI/CD pipeline"
git push origin main
```

### **7. Create Pipeline**

1. **New Item** → **Pipeline**
2. Name: `mern-app-pipeline`
3. **Pipeline script from SCM**
4. **Git** → Your repo URL
5. **Script Path:** `Jenkinsfile`
6. **Save**

### **8. Run Pipeline**

1. Click **"Build Now"**
2. Watch it build!

---

## ✅ Success Checklist

- [ ] Jenkins accessible at http://localhost:8080
- [ ] Plugins installed
- [ ] Docker Hub credentials added
- [ ] Jenkinsfile updated with your Docker Hub username
- [ ] Code pushed to Git
- [ ] Pipeline job created
- [ ] Pipeline runs successfully
- [ ] Images pushed to Docker Hub

---

## 🆘 Troubleshooting

**If pipeline fails:**
1. Check console output in Jenkins
2. Verify Docker Hub credentials
3. Check Jenkinsfile has correct username
4. Make sure code is pushed to Git

**See `JENKINS-SETUP-GUIDE.md` for detailed troubleshooting.**

---

**🎯 Follow these steps and your CI/CD pipeline will work!**
