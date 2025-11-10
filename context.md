# 📋 PlayHive Project Context

This document provides comprehensive context about the PlayHive project for AI assistance and future development. It details the project's history, architecture decisions, implementation details, and customization guidelines.

---

## 🎯 Project Overview

**PlayHive** is a microservices-based gaming platform that demonstrates modern cloud-native architecture principles. It hosts multiple browser-based games as independent microservices, each containerized and orchestrated through Kubernetes.

### **Primary Goals**
1. Showcase microservices architecture patterns
2. Demonstrate Kubernetes orchestration capabilities
3. Implement CI/CD pipelines with GitOps
4. Create responsive, mobile-friendly gaming experiences
5. Practice cloud deployment on Azure

---

## 📐 Architecture Evolution

### **Phase 1: Monolithic Application**
- **Location**: `gamehub/`
- **Structure**: Single React application with all games as components
- **Files**:
  - `App.jsx` - Main hub
  - `SnakeGame.jsx` - Snake game component
  - `TwentyFortyEight.jsx` - 2048 game component
- **Deployment**: Single Docker container, single Kubernetes deployment
- **Pros**: Simple to develop and deploy initially
- **Cons**: Tight coupling, no independent scaling, single point of failure

### **Phase 2: Microservices Architecture** (Current)
- **Location**: `microservice-arch/gamehub-microarch/`
- **Structure**: Three independent React applications
  1. **app/** - Landing page hub
  2. **SnakeGame/** - Standalone Snake game
  3. **TwentyFortyEight/** - Standalone 2048 game
- **Key Changes**:
  - Each game is a separate Vite + React project
  - Independent `package.json` and dependencies
  - Individual Docker images
  - Separate Kubernetes deployments
  - Path-based routing via Nginx Ingress

---

## 🏗️ Technical Architecture

### **Frontend Stack**
```
Technology         Version    Purpose
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
React              19.0.0     UI framework
Vite               6.3.1      Build tool & dev server
Bootstrap          5.3.8      Responsive design (2048 only)
Bootstrap Icons    1.13.1     Icon library (main app)
ESLint             9.22.0     Code linting
```

### **Backend/Infrastructure**
```
Technology              Purpose
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Docker                  Containerization
Kubernetes (K8s)        Orchestration
Minikube               Local K8s cluster
Azure AKS              Production K8s cluster
Nginx Ingress          Reverse proxy & routing
Metrics Server         Resource monitoring
HPA                    Auto-scaling
Flux CD                GitOps deployment
GitHub Actions         CI/CD automation
```

### **Directory Structure Logic**
```
microservice-arch/
├── gamehub-microarch/        # All microservices
│   ├── app/                  # Main hub (gamehub-service)
│   ├── SnakeGame/            # Snake microservice (snake-service)
│   └── TwentyFortyEight/     # 2048 microservice (game2048-service)
└── yml/                      # Kubernetes manifests
    ├── app.yml               # Hub deployment + service
    ├── snake.yml             # Snake deployment + service + HPA
    ├── 2048.yml              # 2048 deployment + service
    ├── ingress.yml           # Path-based routing
    └── flux-system/          # GitOps configs
```

---

## 🎮 Game Implementation Details

### **Snake Game**
**File**: `microservice-arch/gamehub-microarch/SnakeGame/src/App.jsx`

**Key Features**:
- Grid-based movement system
- Food spawning algorithm
- Collision detection (walls & self)
- Score tracking
- Game restart functionality

**Controls**:
- Desktop: Arrow keys, WASD
- Mobile: On-screen directional buttons

**Game Logic**:
```javascript
// Core game loop runs every 100ms
useEffect(() => {
  const interval = setInterval(moveSnake, 100);
  return () => clearInterval(interval);
}, [snake, direction, food, gameOver]);
```

**State Management**:
- `snake`: Array of {x, y} coordinates
- `direction`: Current movement direction
- `food`: {x, y} position of food
- `gameOver`: Boolean flag
- `score`: Current score

---

### **2048 Game**
**File**: `microservice-arch/gamehub-microarch/TwentyFortyEight/src/App.jsx`

**Recent Customizations** (Nov 10, 2025):

#### ✅ **1. Bootstrap Integration**
- **Installed**: `npm install bootstrap`
- **Import**: `import 'bootstrap/dist/css/bootstrap.min.css'`
- **Usage**: Bootstrap classes for responsive layout
  - `container-fluid` - Full-width container
  - `d-flex`, `justify-content-center` - Flexbox utilities
  - `badge`, `btn` - Component styling

#### ✅ **2. Mobile Touch Controls**
**Implementation**:
```javascript
const touchStartRef = useRef({ x: 0, y: 0 });

const handleTouchStart = (e) => {
  const touch = e.touches[0];
  touchStartRef.current = { x: touch.clientX, y: touch.clientY };
};

const handleTouchEnd = (e) => {
  const touch = e.changedTouches[0];
  const deltaX = touch.clientX - touchStartRef.current.x;
  const deltaY = touch.clientY - touchStartRef.current.y;
  const minSwipeDistance = 50;

  // Determine swipe direction based on delta
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (Math.abs(deltaX) > minSwipeDistance) {
      deltaX > 0 ? move('right') : move('left');
    }
  } else {
    // Vertical swipe
    if (Math.abs(deltaY) > minSwipeDistance) {
      deltaY > 0 ? move('down') : move('up');
    }
  }
};
```

**Properties Applied**:
- `touchAction: 'none'` - Prevents default browser touch actions
- `userSelect: 'none'` - Prevents text selection during swipe
- `onTouchStart` - Captures initial touch position
- `onTouchEnd` - Calculates swipe direction

#### ✅ **3. Dark Mode Implementation**
**Files Modified**:
- `index.html` - Added `data-bs-theme="dark"`
- `index.css` - Global dark styles
- `App.jsx` - Component dark colors
- `App.css` - Custom dark mode styles

**Color Scheme**:
```css
Background: #121212 (dark gray)
Text: rgba(255, 255, 255, 0.87) (light white)
Game Board: #3a3a3c (medium dark gray)
Empty Tiles: #1c1c1e (darker gray)
Tile Colors: Original 2048 colors preserved
```

**Key Changes**:
```css
/* index.css - Global enforcement */
:root {
  color-scheme: dark;
  background-color: #121212;
}

html {
  overflow: hidden;  /* Prevent scrolling */
  height: 100%;
}

body {
  background-color: #121212 !important;
  overflow: hidden;
  position: fixed;
  width: 100%;
  max-height: 100vh;
}
```

#### ✅ **4. Non-Scrollable Viewport**
**Problem**: Page was scrollable on mobile, causing poor UX

**Solution**:
```css
/* Prevent all scrolling */
html, body {
  overflow: hidden;
  height: 100%;
}

body {
  position: fixed;
  width: 100%;
  max-height: 100vh;
}

#root {
  overflow: hidden;
  height: 100vh;
}
```

**Game Board Responsive Sizing**:
```javascript
gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(60px, 80px))`
maxWidth: '360px'

// Media queries in App.css
@media (max-width: 576px) {
  .game-board {
    max-width: 300px !important;
  }
}
```

#### ✅ **5. Responsive Design**
**Tile Sizing**:
```javascript
// Using aspect ratio for perfect squares
style={{
  width: '100%',
  aspectRatio: '1',
  fontSize: 'clamp(18px, 4vw, 24px)'  // Responsive font
}}
```

**Breakpoints**:
- Mobile (< 576px): 300px game board
- Tablet (577-768px): 340px game board
- Desktop (> 768px): 360px game board

---

## 🔧 Game Logic Implementation

### **2048 Core Algorithms**

**Grid Initialization**:
```javascript
const getEmptyGrid = () => 
  Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(0));
```

**Tile Movement (Left)**:
```javascript
const moveRowLeft = (row) => {
  const filtered = row.filter(n => n !== 0);  // Remove zeros
  const merged = [];
  
  // Merge adjacent equal numbers
  for (let i = 0; i < filtered.length; i++) {
    if (filtered[i] === filtered[i + 1]) {
      merged.push(filtered[i] * 2);
      i++;  // Skip next element
    } else {
      merged.push(filtered[i]);
    }
  }
  
  // Fill remaining with zeros
  return [...merged, ...Array(row.length - merged.length).fill(0)];
};
```

**Grid Rotation**:
```javascript
// Rotate to convert up/down/right moves to left moves
const rotateGrid = (grid, clockwise = true) => {
  const newGrid = getEmptyGrid();
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (clockwise) {
        newGrid[j][GRID_SIZE - 1 - i] = grid[i][j];
      } else {
        newGrid[GRID_SIZE - 1 - j][i] = grid[i][j];
      }
    }
  }
  return newGrid;
};
```

**Game Over Detection**:
```javascript
const checkGameOver = (grid) => {
  // Check for empty cells
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === 0) return false;
      
      // Check for possible merges
      if (i < GRID_SIZE - 1 && grid[i][j] === grid[i + 1][j]) return false;
      if (j < GRID_SIZE - 1 && grid[i][j] === grid[i][j + 1]) return false;
    }
  }
  return true;
};
```

---

## 🚀 Deployment Configuration

### **Kubernetes Manifests Structure**

#### **app.yml** (GameHub Landing Page)
```yaml
Deployment:
  - Name: gamehub-deployment
  - Replicas: 2
  - Image: tejubagalad/gamehub-app:latest
  - Port: 80

Service:
  - Name: gamehub-service
  - Type: ClusterIP
  - Port: 80
  - Selector: app: gamehub
```

#### **snake.yml** (Snake Game)
```yaml
Deployment:
  - Name: snake-deployment
  - Replicas: 1
  - Image: tejubagalad/snake-game:latest
  - Port: 80

Service:
  - Name: snake-service
  - Type: ClusterIP
  - Port: 80

HPA (Horizontal Pod Autoscaler):
  - Min Replicas: 1
  - Max Replicas: 5
  - Target CPU: 1%
```

#### **2048.yml** (2048 Game)
```yaml
Deployment:
  - Name: game2048-deployment
  - Replicas: 1
  - Image: tejubagalad/2048-game:latest
  - Port: 80

Service:
  - Name: game2048-service
  - Type: ClusterIP
  - Port: 80
```

#### **ingress.yml** (Routing)
```yaml
Ingress:
  - Host: playhive.southindia.cloudapp.azure.com
  - Paths:
    - / → gamehub-service
    - /snake → snake-service
    - /2048 → game2048-service
  - Annotations:
    - nginx.ingress.kubernetes.io/rewrite-target: /$2
    - nginx.ingress.kubernetes.io/use-regex: "true"
```

### **Path Rewriting Logic**
```
User Request: /snake/
Ingress Path: /snake(/|$)(.*)
Rewrite Target: /$2
Result: / (root of snake service)

User Request: /snake/assets/logo.png
Rewrite Target: /assets/logo.png
```

---

## 🔄 CI/CD Pipeline

### **GitHub Actions Workflow**
**File**: `gamehub/automation.yml`

**Trigger**: Push to `main` branch

**Steps**:
1. Checkout code
2. Set up Docker Buildx
3. Login to Docker Hub
4. Build and push Docker image
5. Deploy to Azure Kubernetes Service
6. Update deployment

**Key Commands**:
```bash
docker build -t tejubagalad/gamehub-combined-app:latest .
docker push tejubagalad/gamehub-combined-app:latest
kubectl set image deployment/gamehub-combined gamehub-combined=...
kubectl rollout status deployment/gamehub-combined
```

---

## 📊 Monitoring & Scaling

### **Metrics Server**
```bash
# Enable metrics server (Minikube)
minikube addons enable metrics-server

# Check metrics
kubectl top nodes
kubectl top pods
```

### **Horizontal Pod Autoscaler (HPA)**
```bash
# Create HPA
kubectl autoscale deployment snake \
  --cpu-percent=1 \
  --min=1 \
  --max=5

# Watch HPA
kubectl get hpa -w

# Load test
hey -z 60s -c 100 http://snake.gamehub.local
```

**HPA Behavior**:
- Monitors CPU usage of pods
- Scales up when CPU > 1%
- Scales down when CPU usage decreases
- Min replicas: 1, Max replicas: 5

---

## 🛠️ Common Development Tasks

### **Adding a New Game**

1. **Create new React app**:
   ```bash
   cd microservice-arch/gamehub-microarch
   npm create vite@latest NewGame -- --template react
   cd NewGame
   npm install
   ```

2. **Create Dockerfile**:
   ```dockerfile
   FROM node:18-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Create K8s manifest** (`yml/newgame.yml`):
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: newgame-deployment
   spec:
     replicas: 1
     selector:
       matchLabels:
         app: newgame
     template:
       metadata:
         labels:
           app: newgame
       spec:
         containers:
         - name: newgame
           image: tejubagalad/newgame:latest
           ports:
           - containerPort: 80
   ---
   apiVersion: v1
   kind: Service
   metadata:
     name: newgame-service
   spec:
     selector:
       app: newgame
     ports:
     - port: 80
       targetPort: 80
   ```

4. **Update Ingress** (`yml/ingress.yml`):
   ```yaml
   - path: /newgame(/|$)(.*)
     pathType: ImplementationSpecific
     backend:
       service:
         name: newgame-service
         port:
           number: 80
   ```

5. **Update main app** (`app/src/App.jsx`):
   ```jsx
   <div className="col-md-4">
     <div className="card bg-dark text-white">
       <div className="card-body">
         <h5 className="card-title">
           <i className="bi bi-controller"></i> New Game
         </h5>
         <p className="card-text">Description of new game</p>
         <a href="/newgame" className="btn btn-primary">
           Play Now
         </a>
       </div>
     </div>
   </div>
   ```

6. **Build and deploy**:
   ```bash
   docker build -t tejubagalad/newgame:latest .
   docker push tejubagalad/newgame:latest
   kubectl apply -f yml/newgame.yml
   kubectl apply -f yml/ingress.yml
   ```

---

## 🎨 Styling Guidelines

### **Dark Mode Colors**
```css
Primary Background: #121212
Secondary Background: #1c1c1e
Tertiary Background: #3a3a3c
Text Primary: rgba(255, 255, 255, 0.87)
Text Secondary: rgba(255, 255, 255, 0.60)
Accent Blue: #646cff
Accent Light Blue: #61dafb
```

### **Responsive Breakpoints**
```css
Mobile: < 576px
Tablet: 577px - 768px
Desktop: > 768px
```

### **Bootstrap Theme**
- Dark theme enabled via `data-bs-theme="dark"` on `<html>` tag
- Custom dark mode overrides in component styles
- Bootstrap classes used: `container-fluid`, `d-flex`, `btn`, `badge`, `card`

---

## 🐛 Debugging Tips

### **Common Issues & Solutions**

**Issue**: Game not loading in production
```bash
# Check pod status
kubectl get pods
kubectl describe pod <pod-name>
kubectl logs <pod-name>

# Check ingress
kubectl get ingress
kubectl describe ingress playhive-ingress
```

**Issue**: Vite dev server not accessible on network
```bash
# Ensure --host 0.0.0.0 is in package.json
"scripts": {
  "dev": "vite --host 0.0.0.0"
}
```

**Issue**: Touch controls not working on mobile
```bash
# Ensure these CSS properties are set
touchAction: 'none'
userSelect: 'none'
-webkit-touch-callout: 'none'
```

**Issue**: Page scrolling on mobile
```css
/* Apply to html, body, and #root */
overflow: hidden;
position: fixed;
height: 100vh;
```

**Issue**: Dark mode not applying
```html
<!-- In index.html -->
<html lang="en" data-bs-theme="dark">

<!-- In index.css -->
:root {
  color-scheme: dark;
  background-color: #121212;
}

body {
  background-color: #121212 !important;
}
```

---

## 📝 Development Workflow

### **Local Development**
1. Make changes in respective microservice directory
2. Test locally: `npm run dev`
3. Build Docker image: `docker build -t <name> .`
4. Test in Minikube: `kubectl apply -f yml/<service>.yml`
5. Commit and push to GitHub
6. CI/CD pipeline auto-deploys to Azure

### **Git Workflow**
```bash
git status
git add .
git commit -m "feat: describe changes"
git push origin main
```

### **Deployment Verification**
```bash
# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress

# Check application logs
kubectl logs -f <pod-name>

# Test endpoints
curl http://playhive.southindia.cloudapp.azure.com/
curl http://playhive.southindia.cloudapp.azure.com/snake
curl http://playhive.southindia.cloudapp.azure.com/2048
```

---

## 🔐 Environment Variables & Secrets

Currently, the application doesn't use environment variables or secrets. All configuration is in Kubernetes manifests.

**For future enhancements** (e.g., database, API keys):
```yaml
# ConfigMap for non-sensitive data
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  API_URL: "https://api.example.com"

# Secret for sensitive data
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  API_KEY: <base64-encoded-key>
```

---

## 📚 Learning Resources

### **Technologies Used**
- [React Documentation](https://react.dev/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [Nginx Ingress Controller](https://kubernetes.github.io/ingress-nginx/)

### **Useful Commands Reference**
See `commands.txt` for a collection of frequently used kubectl commands.

---

## 🎯 Future Enhancements

### **Planned Features**
- [ ] Add more games (Tetris, Pac-Man, Memory Game)
- [ ] Implement user authentication (OAuth)
- [ ] Add leaderboard with database (MongoDB/PostgreSQL)
- [ ] Create game statistics dashboard
- [ ] Add multiplayer support (WebSockets)
- [ ] Implement PWA features (offline play, install prompt)
- [ ] Add sound effects and background music
- [ ] Create admin panel for game management
- [ ] Implement A/B testing for UI variations
- [ ] Add analytics (Google Analytics, Mixpanel)

### **Technical Improvements**
- [ ] Set up Prometheus + Grafana for monitoring
- [ ] Implement distributed tracing (Jaeger)
- [ ] Add end-to-end tests (Cypress, Playwright)
- [ ] Set up staging environment
- [ ] Implement blue-green deployments
- [ ] Add rate limiting
- [ ] Implement caching (Redis)
- [ ] Set up CDN for static assets

---

## 🤖 AI Assistant Guidelines

When helping with this project, consider:

1. **Preserve Architecture**: Maintain microservices separation
2. **Consistent Styling**: Follow dark mode color scheme
3. **Mobile-First**: Always test mobile responsiveness
4. **K8s Best Practices**: Use proper labels, selectors, and resource limits
5. **Git Hygiene**: Clear commit messages, feature branches
6. **Documentation**: Update this file when making significant changes

### **Common Customization Requests**

**"Add a feature to 2048"**
- Edit: `microservice-arch/gamehub-microarch/TwentyFortyEight/src/App.jsx`
- Test: `npm run dev` in TwentyFortyEight directory
- Deploy: Rebuild Docker image and update K8s deployment

**"Change the theme/colors"**
- Edit: `index.css` (global), `App.css` (component)
- Update: Color scheme in inline styles if needed
- Test: Verify across different screen sizes

**"Fix mobile controls"**
- Check: `onTouchStart`, `onTouchEnd` handlers
- Verify: `touchAction`, `userSelect` CSS properties
- Test: Use browser dev tools mobile emulation

**"Update Kubernetes config"**
- Edit: Respective `yml` file in `microservice-arch/yml/`
- Apply: `kubectl apply -f <file>.yml`
- Verify: `kubectl get pods`, `kubectl get services`

---

## 📞 Support & Contact

For questions or issues:
- GitHub Issues: [PlayHive-automated/issues](https://github.com/tejubagalad/PlayHive-automated/issues)
- Author: Teju Bagalad
- Repository: https://github.com/tejubagalad/PlayHive-automated

---

**Last Updated**: November 10, 2025
**Version**: 2.0 (Microservices Architecture)
**Status**: Production Ready ✅
