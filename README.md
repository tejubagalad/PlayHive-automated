# 🎮 PlayHive - Microservices Game Hub

[![Azure Deployment](https://img.shields.io/badge/Azure-Deployed-blue)](https://playhive.southindia.cloudapp.azure.com)
[![Kubernetes](https://img.shields.io/badge/Kubernetes-Orchestrated-326CE5)](https://kubernetes.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-19.0.0-61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.1-646CFF)](https://vitejs.dev/)

PlayHive is a **microservices-based game hub** that hosts multiple independent games (Snake and 2048) under one unified platform. Each game runs as an isolated React microservice, containerized using Docker, and orchestrated via Kubernetes (Minikube/AKS).

The architecture ensures **modularity, scalability, and independent deployment**, showcasing a real-world microservices CI/CD pipeline.

---

## 🌟 Features

### **Games**
- 🐍 **Snake Game** - Classic snake game with responsive controls
- 🔢 **2048 Game** - Popular puzzle game with touch and keyboard support
  - ✨ Dark mode UI
  - 📱 Mobile-optimized with touch swipe controls
  - 🎨 Bootstrap responsive design
  - 🚫 Non-scrollable for better mobile experience

### **Architecture**
- 🏗️ **Microservices Architecture** - Each game is an independent service
- 🐳 **Docker Containerization** - All services are containerized
- ☸️ **Kubernetes Orchestration** - Deployed on Kubernetes with auto-scaling
- 🔄 **CI/CD Pipeline** - Automated builds and deployments
- 🌐 **Nginx Ingress** - Path-based routing for services
- 📊 **HPA (Horizontal Pod Autoscaler)** - Auto-scaling based on CPU usage
- ☁️ **Azure Cloud Deployment** - Production-ready cloud infrastructure

---

## 📁 Project Structure

```
PlayHive-automated/
├── gamehub/                          # Monolithic version (legacy)
│   ├── src/
│   │   ├── App.jsx                   # Main hub application
│   │   ├── SnakeGame.jsx             # Snake game component
│   │   └── TwentyFortyEight.jsx      # 2048 game component
│   ├── dockerfile
│   ├── automation.yml                # GitHub Actions workflow
│   └── k8s/
│       ├── k8s.yml                   # Kubernetes manifests
│       └── k8s-na.yml                # Non-Azure K8s config
│
├── microservice-arch/                # Microservices architecture
│   ├── gamehub-microarch/
│   │   ├── app/                      # Main GameHub landing page
│   │   │   ├── src/
│   │   │   │   └── App.jsx           # Hub UI with game cards
│   │   │   ├── dockerfile
│   │   │   └── package.json
│   │   │
│   │   ├── SnakeGame/                # Snake microservice
│   │   │   ├── src/
│   │   │   │   ├── App.jsx           # Snake game logic
│   │   │   │   └── universalControls.js
│   │   │   ├── dockerfile
│   │   │   └── package.json
│   │   │
│   │   └── TwentyFortyEight/         # 2048 microservice
│   │       ├── src/
│   │       │   ├── App.jsx           # 2048 game logic
│   │       │   ├── App.css           # Game styling
│   │       │   ├── index.css         # Global dark mode styles
│   │       │   └── main.jsx
│   │       ├── dockerfile
│   │       ├── package.json
│   │       └── index.html            # Dark mode enabled
│   │
│   └── yml/                          # Kubernetes manifests
│       ├── app.yml                   # GameHub deployment
│       ├── snake.yml                 # Snake deployment
│       ├── 2048.yml                  # 2048 deployment
│       ├── ingress.yml               # Nginx ingress config
│       └── flux-system/              # GitOps Flux CD configs
│           ├── gotk-components.yaml
│           ├── gotk-sync.yaml
│           └── kustomization.yaml
│
├── .github/
│   └── workflows/                    # CI/CD pipelines
├── commands.txt                      # Useful kubectl commands
├── context.md                        # Project context for AI assistance
└── README.md                         # This file
```

---

## 🚀 Live Deployment

### **Production (Azure Cloud)**
- **Main Hub**: https://playhive.southindia.cloudapp.azure.com
- **Snake Game**: https://playhive.southindia.cloudapp.azure.com/snake
- **2048 Game**: https://playhive.southindia.cloudapp.azure.com/2048

### **Local Development (Minikube)**
```bash
minikube start
minikube addons enable ingress
minikube addons enable metrics-server

# Apply Kubernetes manifests
kubectl apply -f microservice-arch/yml/app.yml
kubectl apply -f microservice-arch/yml/snake.yml
kubectl apply -f microservice-arch/yml/2048.yml
kubectl apply -f microservice-arch/yml/ingress.yml

# Get Minikube IP and access
minikube ip
# Add to /etc/hosts: <minikube-ip> gamehub.local snake.gamehub.local 2048.gamehub.local
```

---

## 🛠️ Tech Stack

### **Frontend**
- **React 19.0.0** - UI framework
- **Vite 6.3.1** - Build tool and dev server
- **Bootstrap 5.3.8** - Responsive design (2048 game)
- **Bootstrap Icons** - Icon library
- **CSS3** - Custom styling with dark mode

### **DevOps & Infrastructure**
- **Docker** - Containerization
- **Kubernetes** - Container orchestration
- **Minikube** - Local Kubernetes cluster
- **Azure Kubernetes Service (AKS)** - Production cluster
- **Nginx Ingress Controller** - Traffic routing
- **GitHub Actions** - CI/CD automation
- **Flux CD** - GitOps continuous delivery

### **Monitoring & Scaling**
- **Metrics Server** - Resource monitoring
- **Horizontal Pod Autoscaler (HPA)** - Auto-scaling
  - CPU threshold: 1%
  - Min replicas: 1
  - Max replicas: 5

---

## 📦 Installation & Setup

### **Prerequisites**
- Node.js 18+ and npm
- Docker Desktop
- kubectl CLI
- Minikube (for local development)

### **Local Development**

#### **1. Clone the Repository**
```bash
git clone https://github.com/tejubagalad/PlayHive-automated.git
cd PlayHive-automated
```

#### **2. Run Individual Microservices**

**GameHub (Main Landing Page)**
```bash
cd microservice-arch/gamehub-microarch/app
npm install
npm run dev
# Access: http://localhost:5173
```

**Snake Game**
```bash
cd microservice-arch/gamehub-microarch/SnakeGame
npm install
npm run dev
# Access: http://localhost:5173/snake
```

**2048 Game**
```bash
cd microservice-arch/gamehub-microarch/TwentyFortyEight
npm install
npm run dev
# Access: http://localhost:5173/2048
```

#### **3. Build Docker Images**
```bash
# Build all images
cd microservice-arch/gamehub-microarch/app
docker build -t gamehub-app .

cd ../SnakeGame
docker build -t snake-game .

cd ../TwentyFortyEight
docker build -t 2048-game .
```

#### **4. Deploy to Kubernetes (Minikube)**
```bash
# Start Minikube
minikube start
minikube addons enable ingress
minikube addons enable metrics-server

# Deploy services
kubectl apply -f microservice-arch/yml/app.yml
kubectl apply -f microservice-arch/yml/snake.yml
kubectl apply -f microservice-arch/yml/2048.yml
kubectl apply -f microservice-arch/yml/ingress.yml

# Check status
kubectl get pods
kubectl get services
kubectl get ingress

# Access via Minikube IP
minikube service list
```

---

## 🎮 Game Controls

### **Snake Game**
- **Keyboard**: Arrow keys or WASD
- **Mobile**: On-screen directional buttons

### **2048 Game**
- **Keyboard**: Arrow keys or WASD
- **Mobile**: Swipe gestures (up, down, left, right)
- **Features**: 
  - Non-scrollable viewport
  - Dark mode UI
  - Responsive grid layout
  - Touch-optimized controls

---

## 🔧 Useful Commands

### **Kubernetes Management**
```bash
# View all resources
kubectl get all

# Check pod logs
kubectl logs <pod-name>

# Restart deployment
kubectl rollout restart deployment <deployment-name>

# Scale deployment
kubectl scale deployment <deployment-name> --replicas=3

# Delete and recreate cluster
minikube delete && minikube start && minikube addons enable ingress
```

### **Auto-scaling**
```bash
# Enable HPA
kubectl autoscale deployment snake --cpu-percent=1 --min=1 --max=5

# Watch HPA status
kubectl get hpa -w

# Load testing (requires hey tool)
hey -z 60s -c 100 http://snake.gamehub.local
```

### **Service Access**
```bash
# List all services
minikube service list

# Access specific service
minikube service <service-name>

# Port forward
kubectl port-forward service/<service-name> 8080:80
```

---

## 🏗️ Architecture Details

### **Microservices Design**
Each game is a completely independent microservice:
- **Separate Git repository structure**
- **Independent Docker containers**
- **Individual Kubernetes deployments**
- **Isolated dependencies and configurations**
- **Independent scaling policies**

### **Ingress Routing**
Nginx Ingress Controller routes traffic based on URL paths:
- `/` → GameHub landing page
- `/snake` → Snake game microservice
- `/2048` → 2048 game microservice

### **CI/CD Pipeline**
- **GitHub Actions** for automated builds
- **Docker Hub** for image registry
- **Flux CD** for GitOps-based deployment
- **Automatic rollouts** on code changes

### **Scaling Strategy**
- **HPA** monitors CPU usage
- **Auto-scales** from 1 to 5 replicas
- **Threshold**: 1% CPU usage
- **Load balancing** via Kubernetes services

---

## 🌐 Deployment Environments

### **Local (Minikube)**
- Development and testing
- Local Kubernetes cluster
- No external dependencies

### **Azure Cloud (AKS)**
- Production environment
- Public domain: playhive.southindia.cloudapp.azure.com
- SSL/TLS enabled
- High availability
- Auto-scaling enabled

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 Development Notes

### **Recent Updates (2048 Game)**
- ✅ Added Bootstrap for responsive design
- ✅ Implemented touch swipe controls for mobile
- ✅ Applied dark mode theme globally
- ✅ Fixed scrolling issues on mobile devices
- ✅ Made viewport non-scrollable for better UX
- ✅ Updated tile colors for dark theme
- ✅ Added responsive grid with aspect ratio tiles

### **Known Issues**
- None currently reported

### **Future Enhancements**
- Add more games (Tetris, Pac-Man, etc.)
- Implement leaderboard system
- Add user authentication
- Create game statistics dashboard
- Add multiplayer support
- Implement progressive web app (PWA) features

---

## 📄 License

This project is open-source and available under the MIT License.

---

## 👨‍💻 Author

**Teju Bagalad**
- GitHub: [@tejubagalad](https://github.com/tejubagalad)
- Repository: [PlayHive-automated](https://github.com/tejubagalad/PlayHive-automated)

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite for lightning-fast build tool
- Kubernetes community for excellent documentation
- Bootstrap for responsive design system



