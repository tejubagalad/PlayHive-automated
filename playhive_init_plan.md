# 🧩 /init.md — PlayHive Deployment Tracker

## 🌟 Project Overview

**PlayHive** is a microservices-based React + Vite gaming hub consisting of:

| Service | Description | Path | Service Name | Example URL |
|----------|--------------|------|---------------|--------------|
| GameHub | Main hub listing games | `/` | `gamehub-service` | `http://playhive.southindia.cloudapp.azure.com/` |
| SnakeGame | Snake microfrontend | `/snake/` | `snake-service` | `http://playhive.southindia.cloudapp.azure.com/snake/` |
| TwentyFortyEight | 2048 microfrontend | `/2048/` | `game2048-service` | `http://playhive.southindia.cloudapp.azure.com/2048/` |

Deployed on **Azure AKS** using **FluxCD GitOps + CI/CD (GitHub Actions)**.

---

## 🧭 Problem Timeline

| # | Issue | Root Cause | Status |
|---|--------|-------------|--------|
| 1 | Ingress not reachable (Timeout 80) | Public IP not linked to DNS label | ✅ Fixed → Set DNS label `playhive.southindia.cloudapp.azure.com` |
| 2 | Pods not serving via NGINX | Missing ingress annotation & rewrite-target | ✅ Fixed |
| 3 | React apps returned 404 on `/snake/` & `/2048/` | Missing Vite `base` path for subroutes | ✅ Fixed in vite.config.js |
| 4 | GameHub redirecting to `http://2048.gamehub.local` | Hardcoded URLs in `App.jsx` + old Docker image cache | ⚠️ **Still persists** → Rebuild image + redeploy |
| 5 | CSS/JS 404 after clicking Snake or 2048 | Old build used wrong base → stale assets in container | ⚠️ **Pending:** Ensure new Docker image rebuilds from clean source |
| 6 | Flux reconciles but doesn’t reload pods | Image tag not updated / cached build reused | ⚠️ To fix: Use unique image tags or force rollout restart |

---

## 🧪 Current Verified State

| Component | Working | Comments |
|------------|----------|-----------|
| AKS Cluster | ✅ | Running 1.32.7, South India |
| Ingress Controller | ✅ | NGINX LoadBalancer → 74.225.32.123 |
| DNS Label | ✅ | playhive.southindia.cloudapp.azure.com |
| GameHub (root) | 🔹 | Loads, but redirect still goes to `.local` |
| Snake | ❌ | Assets 404 due to stale Docker image |
| 2048 | ❌ | Same as Snake |
| FluxCD | ✅ | Reconciling correctly |
| GitHub Actions CI/CD | ✅ | Builds images but cache likely stale |

---

## 🧩 Files Fixed / Updated

| Path | Purpose | Status |
|------|----------|--------|
| `app/src/App.jsx` | Removed hardcoded local URLs | ✅ |
| `app/vite.config.js` | Set base `/` | ✅ |
| `SnakeGame/vite.config.js` | Set base `/snake/` | ✅ |
| `TwentyFortyEight/vite.config.js` | Set base `/2048/` | ✅ |
| `Dockerfile` (all) | Added Vite build + Nginx static serve | ✅ |
| `Ingress/playhive-ingress.yaml` | Regex + rewrite target | ✅ |

---

## ⚙️ What’s Left to Fix

### 1️⃣ GameHub redirect still using `gamehub.local`
**Cause:** Old Docker image still cached in Flux/AKS.

**Fix:**
```bash
docker build -t <dockerhub-username>/playhive-auto-gamehub:latest ./microservice-arch/gamehub-microarch/app
docker push <dockerhub-username>/playhive-auto-gamehub:latest
kubectl set image deployment/gamehub gamehub=<dockerhub-username>/playhive-auto-gamehub:latest -n default
kubectl rollout restart deployment/gamehub -n default
```

**Verify:**
```bash
kubectl exec -it deploy/gamehub -n default -- cat /usr/share/nginx/html/src/App.jsx | grep gamehub.local
```

---

### 2️⃣ Snake & 2048 asset 404s
**Cause:** Images built before Vite base fix.

**Fix:**
```bash
docker build --no-cache -t <dockerhub-username>/playhive-auto-snake:latest ./microservice-arch/gamehub-microarch/SnakeGame
docker build --no-cache -t <dockerhub-username>/playhive-auto-2048:latest ./microservice-arch/gamehub-microarch/TwentyFortyEight
docker push <dockerhub-username>/playhive-auto-snake:latest
docker push <dockerhub-username>/playhive-auto-2048:latest
kubectl set image deployment/snake snake=<dockerhub-username>/playhive-auto-snake:latest -n default
kubectl set image deployment/game2048 game2048=<dockerhub-username>/playhive-auto-2048:latest -n default
kubectl rollout restart deployment/snake -n default
kubectl rollout restart deployment/game2048 -n default
```

**Verify:**
```bash
kubectl exec -it deployment/snake -n default -- cat /usr/share/nginx/html/index.html | grep base
```

---

### 3️⃣ Force clean rebuilds in CI/CD
Add to `.github/workflows/automation.yml`:

```yaml
- name: Build and push Snake image
  uses: docker/build-push-action@v4
  with:
    context: ./microservice-arch/gamehub-microarch/SnakeGame
    file: ./microservice-arch/gamehub-microarch/SnakeGame/Dockerfile
    push: true
    no-cache: true
    tags: |
      ${{ secrets.DOCKER_USERNAME }}/playhive-auto-snake:latest
```
Repeat for all microservices.

---

## 🧩 Verification Checklist

| Step | Command | Expected |
|------|----------|-----------|
| 1 | `flux reconcile source git flux-system` | ✅ main@sha1 updated |
| 2 | `kubectl get pods -n default` | All pods Running |
| 3 | `curl -H "Host: playhive.southindia.cloudapp.azure.com" http://74.225.32.123/snake/` | Returns valid HTML |
| 4 | Visit `/snake/` and `/2048/` | Page renders with assets |
| 5 | Click from GameHub → Snake/2048 | Stays in same domain |
| 6 | Browser console | No 404s |

---

## 🤏 Debug Commands

| Purpose | Command |
|----------|----------|
| Check ingress routing | `kubectl describe ingress playhive-ingress -n default` |
| NGINX logs | `kubectl logs -n ingress-basic -l app.kubernetes.io/component=controller --tail=50` |
| Test internal routing | `kubectl run -it curltest --rm --image=radial/busyboxplus:curl --restart=Never -- curl -v -H "Host: playhive.southindia.cloudapp.azure.com" http://74.225.32.123/snake/` |
| Inspect HTML in pod | `kubectl exec -it deploy/snake -n default -- cat /usr/share/nginx/html/index.html | grep "/snake/"` |
| Force redeploy | `kubectl rollout restart deploy/<app-name> -n default` |
| Sync Flux | `flux reconcile kustomization flux-system` |

---

## ✅ Final Expected Behavior

- `http://playhive.southindia.cloudapp.azure.com/` → GameHub loads
- Clicking **Snake** → `/snake/` loads
- Clicking **2048** → `/2048/` loads
- All assets served under correct paths
- Flux updates automatically on new commits

