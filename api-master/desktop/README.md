# API Master Desktop Application

Desktop application built with Electron for Windows, macOS, and Linux.

## Development

```bash
# Install dependencies
npm install

# Start development
npm start

# Build for current platform
npm run build

# Build for specific platforms
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```

## Building

### Requirements
- Node.js 18+
- For macOS builds: macOS system
- For Windows builds: Windows system or wine on Linux

### Distribution
Built applications will be in the `dist/` directory.

## Features
- Native system integration
- Secure credential storage
- Auto-updates
- Offline mode
- System tray support
