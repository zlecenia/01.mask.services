# Service Page

## Overview
MaskService service page component migrated from c201001.mask.services.

## Structure
```
page/service/
├── js/0.1.0/           # Frontend files
│   ├── service.js
│   ├── service.css
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
cd /home/tom/github/zlecenia/01.mask.services/page/service
make install    # Install dependencies
make build      # Build component
make test       # Run tests
make dev        # Start development server
```

### Docker Testing
```bash
cd /home/tom/github/zlecenia/01.mask.services/page/service/docker/0.1.0
docker-compose up
```

Access at: http://127.0.0.1:8207


## Migration Notes
- Migrated from: `js/features/service/`
- Target structure: `page/service/`
- Version: 0.1.0
