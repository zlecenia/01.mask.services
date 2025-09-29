# Tests Page

## Overview
MaskService tests page component migrated from c201001.mask.services.

## Structure
```
page/tests/
├── js/0.1.0/           # Frontend files
│   ├── tests.js
│   ├── tests.css
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
cd /home/tom/github/zlecenia/01.mask.services/page/tests
make install    # Install dependencies
make build      # Build component
make test       # Run tests
make dev        # Start development server
```

### Docker Testing
```bash
cd /home/tom/github/zlecenia/01.mask.services/page/tests/docker/0.1.0
docker-compose up
```

Access at: http://127.0.0.1:8205


## Migration Notes
- Migrated from: `js/features/tests/`
- Target structure: `page/tests/`
- Version: 0.1.0
