# MaskService System Page

System management and monitoring page for the MaskService platform. This module provides comprehensive system oversight, performance monitoring, and administrative controls.

## Overview

The System page is a Vue.js 3 frontend application with a FastAPI backend that provides:

- **System Monitoring**: Real-time system health and performance metrics
- **Module Management**: Control and monitoring of all MaskService modules
- **Log Management**: System logs viewing and filtering
- **Administrative Controls**: System restart, shutdown, and maintenance operations
- **Performance Analytics**: CPU, memory, disk, and network monitoring

## Architecture

```
page/system/
├── js/0.1.0/                 # Frontend (Vue.js 3)
│   ├── index.html            # Main HTML file
│   ├── system.js             # Vue.js application
│   ├── system.css            # Styling
│   └── package.json          # Frontend dependencies
├── py/0.1.0/                 # Backend (FastAPI)
│   ├── main.py               # FastAPI application
│   └── requirements.txt      # Python dependencies
├── docker/0.1.0/             # Docker configuration
│   ├── docker-compose.yml    # Container orchestration
│   ├── Dockerfile.frontend   # Frontend container
│   ├── Dockerfile.backend    # Backend container
│   ├── nginx.conf           # Nginx configuration
│   └── test-docker.sh       # Docker testing script
├── Makefile                  # Build automation
└── README.md                # This file
```

## Quick Start

### Prerequisites

- Node.js 14+ and npm 6+
- Python 3.8+
- Docker and Docker Compose (optional)

### Development Setup

1. **Start Frontend Development Server**:
   ```bash
   cd js/0.1.0/
   npm run dev
   ```
   Access at: http://localhost:8084

2. **Start Backend Development Server**:
   ```bash
   cd py/0.1.0/
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python main.py
   ```
   API available at: http://localhost:8004

### Using Docker

1. **Build and Start Services**:
   ```bash
   cd docker/0.1.0/
   docker-compose up --build
   ```

2. **Test Docker Setup**:
   ```bash
   cd docker/0.1.0/
   ./test-docker.sh
   ```

### Using Makefile

The system page includes a comprehensive Makefile for easy development:

```bash
# Install dependencies
make install

# Build all components
make build

# Start development environment
make dev

# Run tests
make test

# Docker operations
make docker-up      # Start containers
make docker-down    # Stop containers
make docker-test    # Test Docker setup

# Cleanup
make clean

# Show status
make status
```

## API Endpoints

The FastAPI backend provides the following endpoints:

### System Information
- `GET /api/system/health` - System health check
- `GET /api/system/info` - System information
- `GET /api/system/status` - Detailed system status
- `GET /api/system/performance` - Performance metrics

### Module Management
- `GET /api/system/modules` - List all system modules
- `POST /api/system/modules/{module_id}/restart` - Restart specific module
- `POST /api/system/modules/{module_id}/stop` - Stop specific module
- `POST /api/system/modules/{module_id}/start` - Start specific module

### System Control
- `POST /api/system/restart` - Restart entire system
- `POST /api/system/shutdown` - Shutdown system
- `GET /api/system/logs` - Retrieve system logs
- `GET /api/system/logs/{level}` - Filter logs by level

### Authentication
- All endpoints require valid JWT token
- Token validation through `Authorization: Bearer <token>` header

## Features

### System Dashboard
- Real-time system status display
- Performance metrics visualization
- Module status overview
- Recent activity logs

### Performance Monitoring
- CPU usage tracking
- Memory utilization
- Disk space monitoring
- Network activity
- Historical performance charts

### Module Management
- Start/stop/restart individual modules
- Module health status
- Module configuration overview
- Dependency tracking

### Log Management
- Real-time log streaming
- Log level filtering (ERROR, WARN, INFO, DEBUG)
- Log search and filtering
- Export log data

### System Controls
- Safe system restart
- Graceful shutdown
- Maintenance mode toggle
- System backup triggers

## Configuration

### Frontend Configuration
Environment variables can be set in the frontend:
- `API_BASE_URL`: Backend API URL (default: http://localhost:8004)
- `REFRESH_INTERVAL`: Status refresh interval in ms (default: 5000)

### Backend Configuration
Environment variables for the backend:
- `HOST`: Server host (default: 0.0.0.0)
- `PORT`: Server port (default: 8004)
- `JWT_SECRET_KEY`: JWT signing key
- `LOG_LEVEL`: Logging level (default: INFO)

### Docker Configuration
- Frontend Port: 8084
- Backend Port: 8004
- Network: `system-network`

## Development

### Frontend Development
The frontend uses Vue.js 3 via CDN with no build process required:
- Reactive system state management
- Component-based architecture
- Real-time updates via API polling
- Responsive design for desktop and mobile

### Backend Development
FastAPI backend with the following features:
- Async/await support
- Automatic API documentation
- JWT authentication
- Pydantic data validation
- System monitoring integration

### Testing

```bash
# Frontend tests
npm test

# Backend tests
cd py/0.1.0/
python -m pytest

# Integration tests
make test-integration

# Docker tests
make docker-test
```

## Port Allocation

- **Frontend**: 8084 (HTTP)
- **Backend**: 8004 (HTTP)
- **API Docs**: http://localhost:8004/docs

## Security

- JWT-based authentication
- CORS configuration for local development
- Input validation and sanitization
- Secure system operation controls
- Role-based access control

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Check what's using the port
   lsof -i :8084  # or :8004
   
   # Kill the process or change port in configuration
   ```

2. **Docker Build Fails**:
   ```bash
   # Clean Docker cache
   docker system prune -f
   
   # Rebuild with no cache
   docker-compose build --no-cache
   ```

3. **Backend Connection Failed**:
   - Verify backend is running on port 8004
   - Check CORS configuration
   - Validate JWT token if authentication is enabled

4. **System Operations Fail**:
   - Ensure proper system permissions
   - Verify user role has admin privileges
   - Check system resources availability

### Logs

- **Frontend**: Browser developer console
- **Backend**: Application logs in `py/0.1.0/logs/`
- **Docker**: `docker-compose logs -f`

### Health Checks

```bash
# Check frontend
curl http://localhost:8084

# Check backend
curl http://localhost:8004/api/system/health

# Check full system
curl http://localhost:8004/api/system/status
```

## Contributing

1. Follow the established code structure
2. Maintain consistency with other MaskService pages
3. Update tests for new features
4. Update documentation for API changes
5. Ensure Docker compatibility

## Version History

### v0.1.0 (Current)
- Initial system page implementation
- Vue.js 3 frontend with system management interface
- FastAPI backend with system monitoring endpoints
- Docker containerization
- Makefile build system
- Comprehensive documentation

## Related Pages

- [Login Page](../login/README.md) - User authentication
- [Dashboard Page](../dashboard/README.md) - Main user interface
- [Tests Page](../tests/README.md) - Testing interface

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check the troubleshooting section above
- Review logs for error details
- Consult the API documentation at `/docs`
- Check the project's main README for general guidance
