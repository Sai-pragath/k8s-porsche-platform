pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // You must create this in Jenkins!
        DOCKERHUB_USERNAME = "saipragath" // Replace with your actual username
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/porsche-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/porsche-frontend"
        IMAGE_TAG = "latest"
    }

    tools {
        jdk 'jdk21' // Make sure Jenkins has JDK 21 configured in Global Tool Configuration
        maven 'maven3' // Ensure Maven 3 is configured
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Backend (Spring Boot Java 21)') {
            steps {
                dir('backend') {
                    sh 'mvn clean package -DskipTests'
                }
            }
        }

        stage('Test Backend') {
            steps {
                dir('backend') {
                    sh 'mvn test'
                }
            }
        }

        stage('Build Frontend (React)') {
            steps {
                dir('frontend') {
                    // Assuming Docker multi-stage build will handle the NPM install/build, 
                    // or we can run it here if Node is installed. 
                    // We'll let Docker handle it in the next stage for simplicity.
                    echo 'Frontend will be built inside Docker build stage.'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ./backend"
                sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ./frontend"
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh "echo \$DOCKERHUB_CREDENTIALS_PSW | docker login -u \$DOCKERHUB_CREDENTIALS_USR --password-stdin"
                sh "docker push ${BACKEND_IMAGE}:${IMAGE_TAG}"
                sh "docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                // Ensure Jenkins server has kubeconfig configured
                sh "kubectl apply -f k8s/mysql-secret.yaml"
                sh "kubectl apply -f k8s/mysql-deployment.yaml"
                sh "kubectl apply -f k8s/mysql-service.yaml"
                sh "kubectl apply -f k8s/backend-deployment.yaml"
                sh "kubectl apply -f k8s/backend-service.yaml"
                sh "kubectl apply -f k8s/frontend-deployment.yaml"
                sh "kubectl apply -f k8s/frontend-service.yaml"
                
                // Trigger a rolling restart for the new images
                sh "kubectl rollout restart deployment/backend"
                sh "kubectl rollout restart deployment/frontend"
            }
        }
    }
}
