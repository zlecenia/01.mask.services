# Workshop Page

## Overview
MaskService workshop page component migrated from c201001.mask.services.

## Structure
```
page/workshop/
├── js/0.1.0/           # Frontend files
│   ├── workshop.js
│   ├── workshop.css
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
cd /home/tom/github/zlecenia/01.mask.services/page/workshop
make install    # Install dependencies
make build      # Build component
make test       # Run tests
make dev        # Start development server
```

### Docker Testing
```bash
cd /home/tom/github/zlecenia/01.mask.services/page/workshop/docker/0.1.0
docker-compose up
```

Access at: http://127.0.0.1:8208


## Migration Notes
- Migrated from: `js/features/workshop/`
- Target structure: `page/workshop/`
- Version: 0.1.0
