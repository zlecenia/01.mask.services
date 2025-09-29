# Header Module

## Overview
MaskService header module component migrated from c201001.mask.services.

## Structure
```
module/header/
├── js/0.1.0/           # Frontend files
│   ├── header.js
│   ├── header.css
│   ├── index.html
│   └── package.json
└── Makefile            # Build automation
```

## Usage

### Development
```bash
cd /home/tom/github/zlecenia/01.mask.services/module/header
make install    # Install dependencies
make build      # Build component
make test       # Run tests
```

## Migration Notes
- Migrated from: `js/features/header/`
- Target structure: `module/header/`
- Version: 0.1.0
