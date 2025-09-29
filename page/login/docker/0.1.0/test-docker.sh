#!/bin/bash
# Simplified Docker test script for login page

echo "🐳 Starting MaskService Login Page Docker Test"

# Build and run backend
echo "📦 Building backend container..."
docker build -t maskservice-login-backend -f - ../../py/0.1.0 << 'EOF'
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8001
CMD ["python", "main.py"]
EOF

# Build and run frontend
echo "📦 Building frontend container..."
docker build -t maskservice-login-frontend -f - ../../js/0.1.0 << 'EOF'
FROM nginx:alpine
COPY . /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
EOF

# Start containers
echo "🚀 Starting containers..."
docker run -d --name login-backend -p 8001:8001 maskservice-login-backend
docker run -d --name login-frontend -p 3001:80 maskservice-login-frontend

echo "✅ Login page is running:"
echo "   Frontend: http://localhost:3001"
echo "   Backend API: http://localhost:8001"
echo ""
echo "🛑 To stop: docker stop login-backend login-frontend && docker rm login-backend login-frontend"
