# 🚀 Jenkins Setup & CI/CD Pipeline Guide

## ✅ Jenkins is Running!

**Jenkins URL:** http://localhost:8080  
**Admin Password:** `bf7a662703014d0297d3e94831d819e0`

---

## 📋 Step-by-Step Jenkins Configuration

### **Step 1: Access Jenkins**

1. Open your browser
2. Go to: **http://localhost:8080**
3. You'll see the "Unlock Jenkins" page
4. Enter the password: `bf7a662703014d0297d3e94831d819e0`
5. Click **"Continue"**

---

### **Step 2: Install Plugins**

1. On the "Customize Jenkins" page, click **"Install suggested plugins"**
2. Wait for plugins to install (2-5 minutes)
3. After installation, click **"Continue"**

**Required Plugins (will be installed automatically):**
- ✅ Docker Pipeline
- ✅ Docker
- ✅ Credentials Binding
- ✅ Git

---

### **Step 3: Create Admin User**

1. Fill in the form:
   - **Username:** `admin` (or your choice)
   - **Password:** Create a strong password
   - **Confirm Password:** Same password
   - **Full Name:** Your name
   - **Email:** Your email
2. Click **"Save and Continue"**
3. Click **"Save and Finish"**
4. Click **"Start using Jenkins"**

---

### **Step 4: Configure Docker Hub Credentials**

1. In Jenkins, go to: **Manage Jenkins → Credentials → System → Global credentials**
2. Click **"Add Credentials"**
3. Configure first credential:
   - **Kind:** Secret text
   - **Secret:** Your Docker Hub password (or access token)
   - **ID:** `docker-hub-credentials`
   - **Description:** Docker Hub Password
   - Click **"Create"**
4. Click **"Add Credentials"** again
5. Configure second credential:
   - **Kind:** Secret text
   - **Secret:** Your Docker Hub username
   - **ID:** `docker-hub-username`
   - **Description:** Docker Hub Username
   - Click **"Create"**

**How to get Docker Hub Access Token (recommended):**
1. Go to https://hub.docker.com
2. Sign in
3. Click your profile → **Account Settings → Security**
4. Click **"New Access Token"**
5. Give it a name (e.g., "Jenkins")
6. Copy the token (use this as password)

---

### **Step 5: Update Jenkinsfile**

Before creating the pipeline, update the Jenkinsfile with your Docker Hub username:

```bash
cd /home/amira/Desktop/MERN

# Edit Jenkinsfile
nano Jenkinsfile

# Find line 9 and update:
DOCKER_HUB_REPO = 'your-actual-dockerhub-username'
# Replace 'your-actual-dockerhub-username' with your real Docker Hub username

# Save and exit (Ctrl+X, then Y, then Enter)
```

---

### **Step 6: Push Code to Git**

**If you haven't pushed yet:**

```bash
cd /home/amira/Desktop/MERN

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Complete DevOps setup with CI/CD pipeline"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git

# Push
git push -u origin main
```

**If you already have a Git repository:**

```bash
git add .
git commit -m "Add Jenkins CI/CD pipeline"
git push origin main
```

---

### **Step 7: Create Pipeline Job**

1. In Jenkins, click **"New Item"**
2. Enter item name: `mern-app-pipeline`
3. Select **"Pipeline"**
4. Click **"OK"**
5. Scroll down to **"Pipeline"** section
6. Under **"Definition"**, select **"Pipeline script from SCM"**
7. Under **"SCM"**, select **"Git"**
8. Configure:
   - **Repository URL:** Your Git repository URL (e.g., `https://github.com/your-username/your-repo.git`)
   - **Credentials:** (Leave empty if public repo, or add credentials if private)
   - **Branches to build:** `*/main` (or `*/master` if using master branch)
   - **Script Path:** `Jenkinsfile`
9. Click **"Save"**

---

### **Step 8: Run the Pipeline**

1. On the pipeline page, click **"Build Now"**
2. You'll see a build appear in the build history
3. Click on the build number to see progress
4. Click **"Console Output"** to see detailed logs

**Expected Pipeline Stages:**
1. ✅ **Build Backend** - Building Docker image
2. ✅ **Build Frontend** - Building Docker image (parallel)
3. ✅ **Scan Backend** - Trivy security scan
4. ✅ **Scan Frontend** - Trivy security scan (parallel)
5. ✅ **Push to Docker Hub** - Pushing images

**The pipeline should complete in 5-10 minutes.**

---

## 🧪 Testing the Pipeline

### **Check Pipeline Status**

```bash
# View Jenkins logs
docker logs jenkins -f

# Or check in Jenkins UI:
# Go to your pipeline → Click build number → Console Output
```

### **Verify Images Were Pushed**

```bash
# Check Docker Hub (in browser)
# Go to: https://hub.docker.com
# Check your repositories:
# - your-username/mern-backend
# - your-username/mern-frontend

# Or test pulling the image:
docker pull your-username/mern-backend:latest
docker pull your-username/mern-frontend:latest
```

---

## 🐛 Troubleshooting

### **Issue: Pipeline fails at "Build" stage**

**Possible causes:**
- Docker not available in Jenkins container
- Dockerfile has errors
- Build context issues

**Solution:**
```bash
# Check if Docker is available in Jenkins
docker exec jenkins docker --version

# If not, you need to mount Docker socket:
docker stop jenkins
docker rm jenkins
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts
```

### **Issue: Pipeline fails at "Push" stage**

**Possible causes:**
- Wrong Docker Hub credentials
- Docker Hub username doesn't match Jenkinsfile

**Solution:**
1. Verify credentials in Jenkins
2. Check Jenkinsfile has correct Docker Hub username
3. Test Docker Hub login manually:
   ```bash
   docker login
   # Enter your Docker Hub username and password
   ```

### **Issue: "Cannot connect to Git repository"**

**Solution:**
1. Verify repository URL is correct
2. If private repo, add Git credentials in Jenkins
3. Test repository access:
   ```bash
   git ls-remote https://github.com/your-username/your-repo.git
   ```

### **Issue: Trivy scan fails**

**Solution:**
- This is usually OK - Trivy may find vulnerabilities but the pipeline continues
- Check the scan results in console output
- The pipeline uses `--exit-code 0` so it won't fail on vulnerabilities

---

## ✅ Success Criteria

Your CI/CD pipeline is working if:

- ✅ Pipeline runs without errors
- ✅ Both images build successfully
- ✅ Security scans complete
- ✅ Images are pushed to Docker Hub
- ✅ You can see images in Docker Hub web interface

---

## 📝 Quick Reference Commands

```bash
# Start Jenkins
docker start jenkins

# Stop Jenkins
docker stop jenkins

# View Jenkins logs
docker logs jenkins -f

# Get admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Access Jenkins
# Browser: http://localhost:8080

# Restart Jenkins
docker restart jenkins
```

---

## 🎯 Next Steps After Pipeline Works

1. ✅ **Test Kubernetes Deployment** - Use the images from Docker Hub
2. ✅ **Set up Monitoring** - Deploy Prometheus & Grafana
3. ✅ **Configure ArgoCD** - Set up GitOps workflow

---

## 📚 Additional Resources

- **Jenkins Documentation:** https://www.jenkins.io/doc/
- **Docker Hub:** https://hub.docker.com
- **Trivy Documentation:** https://aquasecurity.github.io/trivy/

---

**🎉 Once your pipeline runs successfully, your CI/CD is complete!**
