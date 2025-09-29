# 📊 Dashboard Page - MaskService C20

Main dashboard and navigation hub for the MaskService C20 system.

## 📁 Structure

```
page/dashboard/
├── js/0.1.0/           # Frontend (Vue.js)
│   ├── index.html      # Main HTML page
│   ├── dashboard.js    # Vue.js application
│   ├── dashboard.css   # Styles
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
   cd page/dashboard/js/0.1.0
   npm run dev:backend
   ```

2. **Start Frontend:**
   ```bash
   cd page/dashboard/js/0.1.0
   npm run dev
   ```

3. **Or start both together:**
   ```bash
   cd page/dashboard/js/0.1.0
   npm run dev:full
   ```

### Docker Mode (Recommended for Testing)

```bash
cd page/dashboard/docker/0.1.0

# Build and start containers
docker-compose up --build

# Access the application
# Frontend: http://localhost:3002
# Backend API: http://localhost:8002
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server (port 3002) |
| `npm run dev:backend` | Start FastAPI backend (port 8002) |
| `npm run dev:full` | Start both frontend and backend |
| `npm run docker:build` | Build Docker containers |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |
| `npm run docker:logs` | View container logs |

## 🧪 Testing in Browser

1. **Using Docker (Recommended):**
   ```bash
   cd /home/tom/github/zlecenia/01.mask.services/page/dashboard/docker/0.1.0
   docker-compose up -d
   ```
   
   Open browser: http://localhost:3002

2. **Using Development Server:**
   ```bash
   cd /home/tom/github/zlecenia/01.mask.services/page/dashboard/js/0.1.0
   npm run dev:full
   ```
   
   Open browser: http://localhost:3002

## 👤 Role-based Menu System

The dashboard displays different menu items based on user role:

### OPERATOR
- Test Menu, Device Selection, User Data
- Device Data, Test Reports, Real-time Sensors
- Device History

### ADMIN
- All OPERATOR features plus:
- Users Management, Reports View, Batch Reports
- Reports Schedule, Workshop, System Settings

### SUPERUSER
- All ADMIN features plus:
- Integrations, Standards, Scenarios
- Service Menu, Advanced Diagnostics

### SERVICEUSER
- Service-specific features:
- Workshop Parts, Maintenance, Tools, Inventory
- Advanced Diagnostics, Service Menu

## 🔄 API Endpoints

- **GET** `/api/menu?role=ROLE` - Get role-based menu items
- **GET** `/api/user/stats?token=TOKEN` - Get user session stats  
- **GET** `/api/menu/search?query=QUERY&role=ROLE` - Search menu items
- **POST** `/api/menu/track` - Track menu selection for analytics
- **GET** `/` - Health check

## 🏗️ Architecture

- **Frontend:** Vue.js 3 (CDN) + responsive CSS Grid
- **Backend:** FastAPI + role-based menu system
- **Authentication:** JWT token verification (optional)
- **Deployment:** Docker + nginx proxy
- **Ports:** Frontend (3002), Backend (8002)

## 📝 Migration Notes

Migrated from `c201001.mask.services/js/components/UserMenuScreen.js`:

- ✅ Vue.js component converted to standalone page
- ✅ Role-based menu system maintained
- ✅ Navigation to other pages implemented
- ✅ FastAPI backend for menu management
- ✅ Docker containerization
- ✅ Development workflow setup

## 🔗 Integration

**Entry Point:** User redirected here after successful login from `/page/login/js/0.1.0/`

**Navigation:** Dashboard navigates to:
- `/page/tests/js/0.1.0/` - Testing interface
- `/page/devices/js/0.1.0/` - Device management
- `/page/reports/js/0.1.0/` - Reports and analytics
- `/page/workshop/js/0.1.0/` - Workshop management
- `/page/system/js/0.1.0/` - System settings
- `/page/service/js/0.1.0/` - Service tools
- `/page/settings/js/0.1.0/` - User settings

**Authentication:** Checks for localStorage data:
- `token` - JWT authentication token
- `user` - Username
- `role` - User role

## 🐛 Troubleshooting

### Authentication Issues
- Dashboard redirects to login if no authentication found
- Check localStorage for `user`, `role`, and `token` data
- Ensure login page sets authentication data correctly

### Backend Connection Issues
- Ensure backend is running on port 8002
- Check CORS settings in `main.py`
- Verify Docker network connectivity

### Navigation Issues
- Check that target pages exist in directory structure
- Verify menu item paths in backend configuration
- Check browser console for navigation errors

### Docker Issues
```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Check logs
docker-compose logs -f dashboard-backend
docker-compose logs -f dashboard-frontend
```
