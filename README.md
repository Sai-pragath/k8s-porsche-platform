# 🏎️ K8s Porsche Platform

A full-stack, scalable e-commerce platform clone of Porsche.com. This project is built from scratch to demonstrate a modern cloud-native architecture, utilizing **Spring Boot (Java 21)** for the backend, **React (Vite)** for the frontend, and a fully automated **Jenkins CI/CD** pipeline deploying to a **Kubernetes** cluster on **AWS EC2**.

---

## 🏗️ Architecture Overview

* **Frontend**: A React application offering a premium, dark-themed digital showroom inspired by Porsche. Containerized using NGINX.
* **Backend**: A Java 21 Spring Boot REST API providing vehicle data. Connects to a MySQL database using Spring Data JPA.
* **Database**: MySQL 8.0 running inside Kubernetes with persistent storage (mocked via emptyDir for learning purposes) and secured via Kubernetes Secrets.
* **CI/CD Pipeline**: A Jenkins pipeline (`Jenkinsfile`) that automatically builds the Maven and NPM projects, packages them into Docker images, pushes them to Docker Hub, and applies Kubernetes manifests to rollout updates.
* **Infrastructure**: Three AWS EC2 instances (Ubuntu 22.04) split into a Jenkins Server, a Kubernetes Master Node, and a Kubernetes Worker Node.

---

## 🛠️ Step-by-Step Manual Deployment Guide

This guide walks through deploying the platform entirely manually. You will create your own AWS instances and execute the commands step-by-step to learn exactly how the infrastructure is configured.

### 🌩️ Phase 1: Create EC2 Instances Manually

Log into your AWS Management Console and navigate to **EC2**.

1. **Launch 3 Instances**:
   * **OS**: Ubuntu 22.04 LTS
   * **Instance Type**: `t3.medium` (or `t2.medium`)
   * **Key Pair**: Create a new one (e.g., `porsche-key`) and download the `.pem` file.
   * **Names**: Tag them as `Jenkins-Server`, `K8s-Master`, and `K8s-Worker`.

2. **Configure Security Group**:
   Create a Security Group attached to these instances with the following **Inbound Rules**:
   * **SSH (TCP 22)**: From Anywhere (0.0.0.0/0)
   * **HTTP (TCP 80) & HTTPS (TCP 443)**: From Anywhere
   * **Jenkins (TCP 8080)**: From Anywhere
   * **Kubernetes API (TCP 6443)**: From Anywhere
   * **Kubernetes NodePorts (TCP 30000-32767)**: From Anywhere

---

### ⚙️ Phase 2: Setting Up Jenkins (Manually)

1. **SSH into the Jenkins Server**:
   ```bash
   ssh -i /path/to/your/porsche-key.pem ubuntu@<JENKINS_SERVER_IP>
   ```

2. **Install Java 21, Jenkins, and Docker**:
   Run these commands one by one to understand what they do:
   
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Java 21
   sudo apt install -y openjdk-21-jdk

   # Ensure dependencies are present
   sudo apt-get install -y curl ca-certificates fontconfig

   # Add Jenkins Repository and Key
   sudo curl -fsSL https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key -o /usr/share/keyrings/jenkins-keyring.asc
   echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian-stable binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null
   
   # Update package list and install Jenkins
   sudo apt-get update
   sudo apt-get install -y jenkins

   # Start Jenkins
   sudo systemctl enable jenkins
   sudo systemctl start jenkins

   # Install Docker
   sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
   curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
   echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
   sudo apt update
   sudo apt install -y docker-ce docker-ce-cli containerd.io

   # Grant Jenkins permissions to run Docker
   sudo usermod -aG docker jenkins
   sudo systemctl restart jenkins

   # Install Kubectl (Required for Jenkins pipeline to deploy to K8s)
   sudo apt-get update
   sudo apt-get install -y apt-transport-https ca-certificates curl gpg
   curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
   echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
   sudo apt-get update
   sudo apt-get install -y kubectl
   ```

3. **Get Initial Jenkins Password**:
   ```bash
   sudo cat /var/lib/jenkins/secrets/initialAdminPassword
   ```
   *Go to `http://<JENKINS_SERVER_IP>:8080`, enter this password, and install suggested plugins.*

---

### 🕸️ Phase 3: Setting Up Kubernetes (Manually)

#### On BOTH the Master and Worker Node:
SSH into the nodes and run these pre-requisite commands on **both** machines:

```bash
# Disable Swap (required for Kubernetes)
sudo swapoff -a
sudo sed -i '/ swap / s/^\(.*\)$/#\1/g' /etc/fstab

# Load kernel modules
cat <<EOF | sudo tee /etc/modules-load.d/k8s.conf
overlay
br_netfilter
EOF
sudo modprobe overlay
sudo modprobe br_netfilter

# Setup sysctl parameters
cat <<EOF | sudo tee /etc/sysctl.d/k8s.conf
net.bridge.bridge-nf-call-iptables  = 1
net.bridge.bridge-nf-call-ip6tables = 1
net.ipv4.ip_forward                 = 1
EOF
sudo sysctl --system

# Install containerd (container runtime)
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y containerd.io

# Configure containerd to use systemd
sudo mkdir -p /etc/containerd
containerd config default | sudo tee /etc/containerd/config.toml >/dev/null
sudo sed -i 's/SystemdCgroup \= false/SystemdCgroup \= true/g' /etc/containerd/config.toml
sudo systemctl restart containerd
sudo systemctl enable containerd

# Install Kubeadm, Kubelet, and Kubectl
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl gpg
curl -fsSL https://pkgs.k8s.io/core:/stable:/v1.29/deb/Release.key | sudo gpg --dearmor -o /etc/apt/keyrings/kubernetes-apt-keyring.gpg
echo 'deb [signed-by=/etc/apt/keyrings/kubernetes-apt-keyring.gpg] https://pkgs.k8s.io/core:/stable:/v1.29/deb/ /' | sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl
```

#### On the Master Node ONLY:
```bash
# Initialize the cluster
sudo kubeadm init --pod-network-cidr=192.168.0.0/16

# Configure kubeconfig for the ubuntu user
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# Install the Calico Network Plugin
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/tigera-operator.yaml
kubectl create -f https://raw.githubusercontent.com/projectcalico/calico/v3.27.0/manifests/custom-resources.yaml
```

**Save the Join Command:** After `kubeadm init` finishes, it will print a command like `kubeadm join <MASTER_IP>:6443 --token ...`. Copy this.

#### On the Worker Node ONLY:
Run the join command you copied from the Master Node, using `sudo`:
```bash
sudo kubeadm join <MASTER_IP>:6443 --token <your_token> --discovery-token-ca-cert-hash sha256:<hash>
```

---

### 🔗 Phase 4: Connecting Jenkins to Kubernetes

Jenkins needs permission to run `kubectl apply` against your new cluster.

1. **On your K8s Master Node**, print out the config file:
   ```bash
   cat ~/.kube/config
   ```
   *Copy all the output to your clipboard.*

2. **On your Jenkins Server**:
   ```bash
   sudo su - jenkins
   mkdir -p ~/.kube
   nano ~/.kube/config
   ```
   *Paste the copied config, save, and exit (Ctrl+O, Enter, Ctrl+X).*

---

### 🏗️ Phase 5: Running the CI/CD Pipeline

1. Log into Jenkins.
2. Go to **Manage Jenkins** -> **Credentials** -> **System** -> **Global credentials** -> **Add Credentials**.
   * Kind: Username with password
   * ID: `dockerhub-credentials`
   * Enter your Docker Hub username and password.
3. Go back to Dashboard -> **New Item** -> Name it `Porsche-Clone` -> **Pipeline** -> OK.
4. Scroll to **Pipeline**:
   * Definition: `Pipeline script from SCM`
   * SCM: `Git`
   * Repository URL: `https://github.com/Sai-pragath/k8s-porsche-platform.git`
   * Branch Specifier: `*/main`
5. Click **Save** and **Build Now**.

---

### 🎉 Phase 6: Accessing Your Application

Once the pipeline successfully finishes:
1. Find the Public IP of your **K8s Worker Node** in AWS.
2. Open your browser:
   * **Frontend Application**: `http://<K8S_WORKER_IP>:30081`
   * **Backend API**: `http://<K8S_WORKER_IP>:30080/api/vehicles`
