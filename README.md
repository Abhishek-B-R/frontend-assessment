# NodeSense: Visual Node-Based Workflow Builder

NodeSense is an interactive node-based workflow editor built with React, React Flow, and FastAPI. It allows users to create, connect, and configure nodes visually, validate their workflow as a Directed Acyclic Graph (DAG), and process backend logic seamlessly.

---

## Features

### **Frontend**

* **Node Abstraction System**: Create modular node types with reusable UI and logic.
* **Custom Node Types**:

  * Text Node (auto-resizes and detects `{{variables}}` to add dynamic handles)
  * Input Node
  * API Call Node
  * Math/Operation Nodes
  * Output Node
* **Dynamic Handle Generation** for variables inside text nodes.
* **Graph Validation**: Check if the workflow is a valid DAG in real time.
* **UI/UX Enhancements**:

  * Modern canvas background and color scheme
  * Node color coding per type
  * Interactive pan and zoom
  * Clean navbar design
* **State Management**: Real-time updates to nodes and edges.
* **Future-Ready Architecture** for easy addition of more node types.

### **Backend**

* **FastAPI** server with:

  * `/pipelines/parse` endpoint to process workflow data
  * Returns node count, edge count, and DAG validity
* **Python Virtual Environment Setup Script** (`start.sh`):

  * Auto-creates venv if not found
  * Installs dependencies
  * Runs the app
* **PM2 Integration** to run FastAPI persistently in production.

### **Deployment**

* **Azure Server Deployment**
* **Nginx Reverse Proxy** with SSL via Let's Encrypt
  * Added `api.nodesense.abhi.wtf` for NodeSense backend

---

## Tech Stack

**Frontend**

* React 18
* React Flow
* Tailwind CSS
* Shadcn/UI
* Zustand
* Vite

**Backend**

* Python 3.12+
* FastAPI
* Uvicorn
* PM2 (for process management)

**Deployment**

* Azure VM
* Nginx
* Let's Encrypt (SSL)

---

## Getting Started

### **Frontend**

```bash
cd frontend
npm install
npm run dev
```

### **Backend**

```bash
cd backend
chmod +x start.sh
./start.sh
```

The script will:

1. Check for `venv` (create if missing)
2. Install dependencies
3. Freeze requirements
4. Start the FastAPI app

To run in production with PM2:

```bash
pm2 start "uvicorn main:app --host 0.0.0.0 --port 8000" \
  --name fastapi-app \
  --interpreter ./venv/bin/python
```

### **Nginx Setup**

Example block for `api.nodesense.abhi.wtf`:

```nginx
server {
    listen 443 ssl;
    server_name api.nodesense.abhi.wtf;

    ssl_certificate /etc/letsencrypt/live/api.nodesense.abhi.wtf/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.nodesense.abhi.wtf/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    location / {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name api.nodesense.abhi.wtf;
    return 301 https://$host$request_uri;
}
```

---

## Screenshots

* Landing Page - `nodesense.abhishekbr.dev`
![alt text](https://nodesense.abhishekbr.dev/Landing.png)

* Workflow setup example - `nodesense.abhishekbr.dev`
![alt text](https://nodesense.abhishekbr.dev/Example.png)

---

## Future Work

* Adding TypeScript
* Improving mobile/touch support
* Adding onboarding/help
* Implementing undo/redo
* Adding accessibility features
* Optimizing for large graphs

---

## License

MIT License
