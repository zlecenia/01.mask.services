# MaskService Tests Page

Standalone test management module for MaskService applications, migrated from `TestMenuTemplate.js` with enhanced Docker support and FastAPI backend.

## 📁 Structure

```
page/tests/
├── js/0.1.0/           # Frontend Vue.js application
│   ├── index.html      # Main HTML file
│   ├── tests.js        # Vue.js application logic
│   ├── tests.css       # Styling
│   └── package.json    # Frontend dependencies & scripts
├── py/0.1.0/           # Backend FastAPI application
│   ├── main.py         # FastAPI server
│   └── requirements.txt # Python dependencies
└── docker/0.1.0/       # Docker configuration
    ├── docker-compose.yml    # Multi-container setup
    ├── Dockerfile.frontend   # Frontend container
    ├── Dockerfile.backend    # Backend container
    ├── nginx.conf           # Nginx configuration
    └── test-docker.sh       # Test script
```

## 🚀 Quick Start

### Development Mode

```bash
# Navigate to frontend directory
cd page/tests/js/0.1.0/

# Install dependencies
npm install

# Start development servers (frontend + backend)
npm run dev
```

Access the application:
- **Frontend**: http://localhost:8083
- **Backend API**: http://localhost:8003
- **API Documentation**: http://localhost:8003/docs

### Docker Mode (Recommended for Testing)

```bash
# Navigate to Docker directory
cd page/tests/docker/0.1.0/

# Build and run containers
chmod +x test-docker.sh
./test-docker.sh
```

Access the application:
- **Frontend**: http://localhost:8083 (nginx-served)
- **Backend API**: http://localhost:8003 (via nginx proxy at /api/)

## 🧪 Features

### Test Management
- **Test Wizard**: Guided test creation with device selection, test type configuration, and parameter setup
- **Test Scenarios**: Predefined testing scenarios with customizable parameters
- **Test History**: Complete execution history with results, duration, and filtering
- **Test Templates**: Reusable test configurations for standard protocols

### User Interface
- **Modern Vue.js 3**: Reactive interface with composition API
- **Responsive Design**: Mobile-friendly layout with CSS Grid and Flexbox
- **Interactive Elements**: Modal dialogs, step wizards, and dynamic forms
- **Real-time Updates**: Live test status and progress tracking

### Export & Reporting
- **Multiple Formats**: Export test data in JSON, CSV, and XML formats
- **Filtered Exports**: Export specific test results or date ranges
- **Test Reports**: Comprehensive reporting with statistics and analysis

## 🔧 API Endpoints

### Test Management
- `POST /api/test/start` - Start a new test session
- `POST /api/test/configure` - Configure test from wizard data
- `DELETE /api/test/{test_id}` - Delete test from history

### Data Retrieval
- `GET /api/scenarios` - Get all test scenarios
- `POST /api/scenarios` - Create new test scenario
- `GET /api/templates` - Get all test templates
- `GET /api/history?filter=all|passed|failed` - Get test history
- `GET /api/stats` - Get test statistics
- `GET /api/export?format=json|csv|xml` - Export test data

### Example Usage

```javascript
// Start a new test
const response = await fetch('/api/test/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        option: 'wizard',
        user: 'test_user',
        role: 'engineer'
    })
});

// Get test statistics
const stats = await fetch('/api/stats').then(r => r.json());
console.log(`Total tests: ${stats.total_tests}`);
```

## 🐳 Docker Configuration

### Services
- **tests-backend**: FastAPI server on port 8003
- **tests-frontend**: Nginx server on port 8083

### Docker Commands

```bash
# Build containers
docker-compose build

# Start services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up
docker-compose down --volumes --remove-orphans
```

### Environment Variables

```yaml
# Backend environment
ENV=development

# For production, consider:
# JWT_SECRET=your-secret-key
# DATABASE_URL=your-database-url
# CORS_ORIGINS=https://yourdomain.com
```

## 🔧 Development

### Frontend Development

```bash
# Navigate to frontend
cd js/0.1.0/

# Start development server
python -m http.server 8083

# Or use npm script
npm run serve
```

### Backend Development

```bash
# Navigate to backend
cd py/0.1.0/

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
python main.py

# Or with auto-reload
uvicorn main:app --host 0.0.0.0 --port 8003 --reload
```

### Testing

```bash
# Frontend testing (placeholder)
npm test

# Backend testing
cd py/0.1.0/
python -m pytest  # when tests are added

# Integration testing
npm run test:integration

# Docker testing
npm run docker:test
```

## 🛠 Technical Stack

### Frontend
- **Vue.js 3**: Progressive JavaScript framework via CDN
- **CSS3**: Modern styling with Grid, Flexbox, and animations
- **Vanilla JavaScript**: No build tools required

### Backend
- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation and parsing
- **Uvicorn**: ASGI server
- **JWT**: Authentication tokens (when needed)

### Infrastructure
- **Docker**: Containerized deployment
- **Nginx**: Reverse proxy and static file serving
- **Docker Compose**: Multi-container orchestration

## 📊 Usage Examples

### Creating a New Test

1. **Select Test Option**: Choose "Test Wizard" from the main menu
2. **Device Selection**: Select device type (FFP2, FFP3, Filter, etc.)
3. **Test Configuration**: Choose test type (Pressure, Efficiency, Endurance)
4. **Parameter Setup**: Configure test parameters and duration
5. **Execution**: Start test and monitor progress
6. **Results**: View results and save to history

### Managing Test Templates

1. **Access Templates**: Click "Test Templates" from the main menu
2. **Create Template**: Use an existing test configuration as a template
3. **Apply Template**: Select template for quick test setup
4. **Edit Template**: Modify template parameters as needed

### Viewing Test History

1. **Access History**: Click "Test History" from the main menu
2. **Filter Results**: Filter by status (All, Passed, Failed)
3. **View Details**: Click on any test for detailed information
4. **Export Data**: Export filtered results in various formats

## 🚨 Troubleshooting

### Common Issues

**Port Conflicts**
```bash
# Check if ports are in use
netstat -an | grep :8003
netstat -an | grep :8083

# Kill existing processes
sudo lsof -ti:8003 | xargs kill -9
sudo lsof -ti:8083 | xargs kill -9
```

**Docker Issues**
```bash
# Rebuild containers
docker-compose build --no-cache

# Check container logs
docker-compose logs tests-backend
docker-compose logs tests-frontend

# Reset Docker environment
docker-compose down --volumes
docker system prune -f
```

**Backend Connection Issues**
```bash
# Check FastAPI server status
curl http://localhost:8003/

# Check API endpoints
curl http://localhost:8003/api/stats

# Verify CORS configuration
curl -H "Origin: http://localhost:8083" http://localhost:8003/api/stats
```

### Development Tips

- **Hot Reload**: Backend supports auto-reload with `--reload` flag
- **API Testing**: Use `/docs` endpoint for interactive API testing
- **CORS**: All origins allowed in development mode
- **Logging**: Check Docker logs for detailed error information

## 🔒 Security Notes

- JWT secrets are hardcoded for development
- CORS is open for all origins in dev mode
- For production deployment:
  - Use environment variables for secrets
  - Configure proper CORS origins
  - Enable HTTPS
  - Add rate limiting
  - Implement proper authentication

## 📝 Version History

- **v0.1.0**: Initial migration from TestMenuTemplate.js
  - Vue.js 3 standalone implementation
  - FastAPI backend with test management
  - Docker containerization
  - Test wizard, scenarios, history, and templates
  - Export functionality in multiple formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with Docker setup
5. Submit a pull request

For questions or issues, please open an issue in the repository.
