# Dashboard Page

## Overview
MaskService dashboard page component migrated from c201001.mask.services.

## Structure
```
page/dashboard/
├── js/0.1.0/           # Frontend files
│   ├── dashboard.js
│   ├── dashboard.css
│   ├── index.html
│   └── package.json
├── py/0.1.0/           # Backend files
│   ├── main.py
│   └── requirements.txt
├── docker/0.1.0/       # Docker configuration
│   ├── docker-compose.yml
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
└── Makefile            # Build automation
```

## Usage

### Development
```bash
cd /home/tom/github/zlecenia/01.mask.services/page/dashboard
make install    # Install dependencies
make build      # Build component
make test       # Run tests
make dev        # Start development server
```

### Docker Testing
```bash
cd /home/tom/github/zlecenia/01.mask.services/page/dashboard/docker/0.1.0
docker-compose up
```

Access at: http://127.0.0.1:8209


## Migration Notes
- Migrated from: `js/features/dashboard/`
- Target structure: `page/dashboard/`
- Version: 0.1.0
