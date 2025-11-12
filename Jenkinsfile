pipeline {
    agent any
    
    // Environment variables - configure these in Jenkins credentials
    environment {
        // Docker Hub credentials (use Jenkins credentials store)
        DOCKER_HUB_CREDENTIALS = credentials('docker-hub-credentials')
        DOCKER_HUB_USERNAME = credentials('docker-hub-username')
        DOCKER_HUB_REPO = 'amira30til' // Change this to your Docker Hub username
        
        // Image tags
        BACKEND_IMAGE = "${DOCKER_HUB_REPO}/mern-backend"
        FRONTEND_IMAGE = "${DOCKER_HUB_REPO}/mern-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}-${env.GIT_COMMIT.take(7)}"
        
        // Registry URLs
        REGISTRY_URL = 'docker.io'
    }
    
    stages {
        // Stage 1: Build Docker images
        stage('Build') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            echo "🔨 Building backend Docker image..."
                            dir('backend') {
                                sh """
                                    docker build \
                                        --target production \
                                        -t ${BACKEND_IMAGE}:${IMAGE_TAG} \
                                        -t ${BACKEND_IMAGE}:latest \
                                        .
                                """
                            }
                        }
                    }
                }
                
                stage('Build Frontend') {
                    steps {
                        script {
                            echo "🔨 Building frontend Docker image..."
                            dir('frontend') {
                                sh """
                                    docker build \
                                        --target production \
                                        --build-arg VITE_API_BASE_URL=http://backend:5000/api \
                                        --build-arg VITE_FRONTEND_URL=http://localhost:5173 \
                                        -t ${FRONTEND_IMAGE}:${IMAGE_TAG} \
                                        -t ${FRONTEND_IMAGE}:latest \
                                        .
                                """
                            }
                        }
                    }
                }
            }
        }
        
        // Stage 2: Security scanning with Trivy
        stage('Security Scan') {
            parallel {
                stage('Scan Backend') {
                    steps {
                        script {
                            echo "🔍 Scanning backend image for vulnerabilities..."
                            sh """
                                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy image \
                                    --exit-code 0 \
                                    --severity HIGH,CRITICAL \
                                    --format table \
                                    ${BACKEND_IMAGE}:${IMAGE_TAG} || true
                            """
                            echo "✅ Backend security scan completed"
                        }
                    }
                }
                
                stage('Scan Frontend') {
                    steps {
                        script {
                            echo "🔍 Scanning frontend image for vulnerabilities..."
                            sh """
                                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \
                                    aquasec/trivy image \
                                    --exit-code 0 \
                                    --severity HIGH,CRITICAL \
                                    --format table \
                                    ${FRONTEND_IMAGE}:${IMAGE_TAG} || true
                            """
                            echo "✅ Frontend security scan completed"
                        }
                    }
                }
            }
        }
        
        // Stage 3: Push images to Docker Hub
        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "📤 Logging in to Docker Hub..."
                    sh """
                        echo ${DOCKER_HUB_CREDENTIALS} | docker login ${REGISTRY_URL} \
                            -u ${DOCKER_HUB_USERNAME} --password-stdin
                    """
                    
                    echo "📤 Pushing backend image..."
                    sh """
                        docker push ${BACKEND_IMAGE}:${IMAGE_TAG}
                        docker push ${BACKEND_IMAGE}:latest
                    """
                    
                    echo "📤 Pushing frontend image..."
                    sh """
                        docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}
                        docker push ${FRONTEND_IMAGE}:latest
                    """
                    
                    echo "✅ Images pushed successfully to Docker Hub"
                }
            }
        }
        
        // Stage 4: Deploy to Kubernetes (optional - uncomment if needed)
        // stage('Deploy to Kubernetes') {
        //     steps {
        //         script {
        //             echo "🚀 Deploying to Kubernetes..."
        //             sh """
        //                 kubectl set image deployment/backend backend=${BACKEND_IMAGE}:${IMAGE_TAG} -n mern-app
        //                 kubectl set image deployment/frontend frontend=${FRONTEND_IMAGE}:${IMAGE_TAG} -n mern-app
        //                 kubectl rollout status deployment/backend -n mern-app
        //                 kubectl rollout status deployment/frontend -n mern-app
        //             """
        //         }
        //     }
        // }
    }
    
    post {
        // Cleanup after build
        always {
            script {
                echo "🧹 Cleaning up..."
                sh """
                    docker logout ${REGISTRY_URL} || true
                """
            }
        }
        
        // Success notification
        success {
            echo "✅ Pipeline completed successfully!"
            echo "📦 Images available at:"
            echo "   - ${BACKEND_IMAGE}:${IMAGE_TAG}"
            echo "   - ${FRONTEND_IMAGE}:${IMAGE_TAG}"
        }
        
        // Failure notification
        failure {
            echo "❌ Pipeline failed. Check logs for details."
        }
    }
}
