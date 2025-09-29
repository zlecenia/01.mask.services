# 🔐 Login Page - MaskService C20

Standalone authentication page for the MaskService C20 system.

## 📁 Structure

```
page/login/
├── js/0.1.0/           # Frontend (Vue.js)
│   ├── index.html      # Main HTML page
│   ├── login.js        # Vue.js application
│   ├── login.css       # Styles
│   └── package.json    # Frontend dependencies
├── py/0.1.0/           # Backend (FastAPI)
│   ├── main.py         # FastAPI application
│   └── requirements.txt # Python dependencies
├── docker/0.1.0/       # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── nginx.conf
└── README.md          # This file
```

## 🚀 Quick Start

### Development Mode

1. **Start Backend:**
   ```bash
   cd page/login/js/0.1.0
   npm run dev:backend
   ```

2. **Start Frontend:**
   ```bash
   cd page/login/js/0.1.0
   npm run dev
   ```

3. **Or start both together:**
   ```bash
   cd page/login/js/0.1.0
   npm run dev:full
   ```

### Docker Mode (Recommended for Testing)

```bash
cd page/login/docker/0.1.0

# Build and start containers
docker-compose up --build

# Access the application
# Frontend: http://localhost:3001
# Backend API: http://localhost:8001
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server (port 3001) |
| `npm run dev:backend` | Start FastAPI backend (port 8001) |
| `npm run dev:full` | Start both frontend and backend |
| `npm run docker:build` | Build Docker containers |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |
| `npm run docker:logs` | View container logs |

## 🧪 Testing in Browser

1. **Using Docker (Recommended):**
   ```bash
   cd /home/tom/github/zlecenia/01.mask.services/page/login/docker/0.1.0
   docker-compose up -d
   ```
   
   Open browser: http://localhost:3001

2. **Using Development Server:**
   ```bash
   cd /home/tom/github/zlecenia/01.mask.services/page/login/js/0.1.0
   npm run dev:full
   ```
   
   Open browser: http://localhost:3001

## 👤 Available User Roles

| Role | Default Password | Description |
|------|------------------|-------------|
| OPERATOR | `default` or `operator` | Basic testing operations |
| ADMIN | `default` or `admin` | System administration |
| SUPERUSER | `default` or `superuser` | Full system access |
| SERVICEUSER | `default` or `service` | Service and maintenance |

## 🔄 API Endpoints

- **POST** `/api/login` - Authenticate user
- **GET** `/api/verify` - Verify JWT token
- **GET** `/api/roles` - Get available roles
- **GET** `/` - Health check

## 🏗️ Architecture

- **Frontend:** Vue.js 3 (CDN) + vanilla CSS
- **Backend:** FastAPI + JWT authentication
- **Deployment:** Docker + nginx proxy
- **Ports:** Frontend (3001), Backend (8001)

## 📝 Migration Notes

Migrated from `c201001.mask.services/js/components/LoginScreen.js`:

- ✅ Vue.js component converted to standalone page
- ✅ Authentication logic maintained
- ✅ Role-based login system
- ✅ FastAPI backend integration
- ✅ Docker containerization
- ✅ Development workflow setup

## 🔗 Integration

After successful login, user is redirected to:
```
/page/dashboard/js/0.1.0/
```

Authentication data stored in `localStorage`:
- `token` - JWT authentication token
- `user` - Username
- `role` - User role

## 🐛 Troubleshooting

### Backend Connection Issues
- Ensure backend is running on port 8001
- Check CORS settings in `main.py`
- Verify Docker network connectivity

### Frontend Issues
- Check browser console for errors
- Verify Vue.js CDN is loading
- Check nginx configuration in Docker mode

### Docker Issues
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```
