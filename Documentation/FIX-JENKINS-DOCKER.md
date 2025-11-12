# 🔧 Fix Jenkins Docker Access - COMPLETE SOLUTION

## ❌ Problem

Your Jenkins pipeline is failing with:
```
exec: "com.docker.cli": executable file not found in $PATH
```

This means Docker is not available inside the Jenkins container.

---

## ✅ Solution: Recreate Jenkins with Docker Access

### **Step 1: Stop and Remove Current Jenkins**

```bash
docker stop jenkins
docker rm jenkins
```

### **Step 2: Create Jenkins with Docker Socket Access**

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/bin/docker:/usr/bin/docker \
  --group-add 999 \
  jenkins/jenkins:lts
```

**What this does:**
- `-v /var/run/docker.sock:/var/run/docker.sock` - Gives Jenkins access to Docker daemon
- `-v /usr/bin/docker:/usr/bin/docker` - Mounts Docker binary
- `--group-add 999` - Adds Jenkins to Docker group

### **Step 3: Wait for Jenkins to Initialize**

```bash
# Wait 30 seconds
sleep 30

# Get admin password
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### **Step 4: Verify Docker Works**

```bash
# Test Docker in Jenkins
docker exec jenkins docker --version

# Should show: Docker version ...
```

---

## 🔄 Alternative: Use Docker-in-Docker (DinD)

If the above doesn't work, use Docker-in-Docker:

```bash
docker stop jenkins
docker rm jenkins

docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  --privileged \
  jenkins/jenkins:lts

# Then install Docker inside Jenkins container
docker exec jenkins bash -c "apt-get update && apt-get install -y docker.io"
```

---

## ✅ Updated Jenkinsfile

I've already updated your Jenkinsfile to use `/usr/bin/docker` instead of just `docker`. 

**Changes made:**
- All `docker` commands changed to `/usr/bin/docker`
- This ensures Jenkins finds Docker binary

**You need to:**
1. Commit and push the updated Jenkinsfile:
```bash
cd /home/amira/Desktop/MERN
git add Jenkinsfile
git commit -m "Fix Docker path in Jenkinsfile"
git push origin main
```

2. Run the pipeline again in Jenkins

---

## 🧪 Test After Fix

### **1. Verify Docker Access**

```bash
docker exec jenkins docker --version
docker exec jenkins docker ps
```

### **2. Test Building an Image**

```bash
docker exec jenkins docker build -t test-image /tmp
```

### **3. Run Pipeline Again**

1. Go to Jenkins: http://localhost:8080
2. Open your pipeline: `mern-app-pipeline`
3. Click **"Build Now"**
4. Check console output

---

## 🐛 Troubleshooting

### **Issue: Still can't find Docker**

**Solution 1:** Check Docker socket permissions
```bash
ls -la /var/run/docker.sock
# Should show: srw-rw---- 1 root docker

# If permissions wrong:
sudo chmod 666 /var/run/docker.sock
```

**Solution 2:** Use full path to Docker
```bash
# Find Docker location
which docker
# Usually: /usr/bin/docker

# Update Jenkinsfile to use full path (already done)
```

### **Issue: Permission denied**

**Solution:** Add Jenkins user to Docker group
```bash
docker exec jenkins usermod -aG docker jenkins
docker restart jenkins
```

---

## ✅ Success Criteria

After fixing, your pipeline should:
- ✅ Find Docker command
- ✅ Build backend image
- ✅ Build frontend image
- ✅ Run security scans
- ✅ Push images to Docker Hub

---

## 📝 Quick Fix Commands

```bash
# Stop and remove Jenkins
docker stop jenkins && docker rm jenkins

# Recreate with Docker access
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/bin/docker:/usr/bin/docker \
  --group-add 999 \
  jenkins/jenkins:lts

# Wait and get password
sleep 30
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword

# Verify Docker works
docker exec jenkins docker --version

# Push updated Jenkinsfile
cd /home/amira/Desktop/MERN
git add Jenkinsfile
git commit -m "Fix Docker path"
git push origin main
```

---

**🎯 After these steps, your pipeline should work!**
