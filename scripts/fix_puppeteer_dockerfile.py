#!/usr/bin/env python3

"""
Fix Puppeteer Dockerfile to use Debian-based image with proper Chromium support
"""

import os
import sys
from pathlib import Path

PAGE_NAMES = ['login', 'dashboard', 'tests', 'system', 'devices', 'reports', 'service', 'settings', 'workshop']

def create_working_puppeteer_dockerfile(page_name):
    """Create Puppeteer Dockerfile with proper Chromium support (Debian-based)"""
    docker_dir = Path(f"/home/tom/github/zlecenia/01.mask.services/page/{page_name}/docker/0.1.0")
    dockerfile_path = docker_dir / "Dockerfile.puppeteer"
    
    dockerfile_content = f"""# Advanced Puppeteer Testing Container for {page_name}
# Using Debian-based Node.js for better Chromium compatibility
FROM node:18-bullseye-slim

# Install Chromium and dependencies
RUN apt-get update && apt-get install -y \\
    chromium \\
    chromium-sandbox \\
    fonts-liberation \\
    libasound2 \\
    libatk-bridge2.0-0 \\
    libatk1.0-0 \\
    libatspi2.0-0 \\
    libcups2 \\
    libdbus-1-3 \\
    libdrm2 \\
    libgbm1 \\
    libgtk-3-0 \\
    libnspr4 \\
    libnss3 \\
    libwayland-client0 \\
    libxcomposite1 \\
    libxdamage1 \\
    libxfixes3 \\
    libxkbcommon0 \\
    libxrandr2 \\
    xdg-utils \\
    curl \\
    ca-certificates \\
    --no-install-recommends && \\
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package.json and install dependencies
COPY puppeteer-package.json package.json
RUN npm install

# Copy test script
COPY puppeteer-test.js .

# Set Puppeteer to use installed Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV CHROME_BIN=/usr/bin/chromium
ENV CHROME_PATH=/usr/bin/chromium

# Expose port for debugging
EXPOSE 9222

# Default command
CMD ["node", "puppeteer-test.js"]
"""
    
    dockerfile_path.write_text(dockerfile_content)
    print(f"  ✅ Fixed Puppeteer Dockerfile for {page_name}")
    return True

def main():
    """Fix all Puppeteer Dockerfiles to use Debian-based image"""
    print("🚀 Fixing Puppeteer Dockerfiles for Chromium Compatibility")
    print("=" * 60)
    print("Using: node:18-bullseye-slim (Debian) instead of Alpine")
    print("=" * 60)
    
    success_count = 0
    for page_name in PAGE_NAMES:
        print(f"\\n🔧 Fixing {page_name}...")
        
        try:
            create_working_puppeteer_dockerfile(page_name)
            success_count += 1
        except Exception as e:
            print(f"  ❌ Error: {e}")
    
    print(f"\\n📊 Fixed Puppeteer Dockerfiles: {success_count}/{len(PAGE_NAMES)}")
    
    print("\\n🎯 Changes:")
    print("• Using node:18-bullseye-slim (Debian-based)")
    print("• Full Chromium dependencies installed")
    print("• Proper font and library support")
    print("• Fixed sandbox permissions")
    
    print("\\n✅ Ready to test with: make dev")
    
    return 0 if success_count == len(PAGE_NAMES) else 1

if __name__ == "__main__":
    sys.exit(main())
