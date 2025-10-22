# 🎨 CaveBeat - Creative Digital Experiences

A high-performance, WebGL-powered website inspired by Active Theory's award-winning design. Built with modern web technologies and optimized for immersive user experiences.


## ✨ Features

- 🎯 **Custom Cursor** - Interactive cursor with smooth follower effect
- 🌌 **WebGL Particles** - 1000+ animated particles with Three.js
- 📱 **Fully Responsive** - Optimized for all devices and screen sizes
- ⚡ **High Performance** - 60fps animations with optimized rendering
- 🎨 **Modern Design** - Clean, minimalist UI with gradient accents
- 🔄 **Smooth Animations** - Scroll-based parallax and transitions
- 🎭 **Fullscreen Menu** - Immersive navigation experience
- 🌐 **WebGL Effects** - Real-time 3D graphics and particle systems

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash

# Navigate to project directory
cd cavebeat

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:8080`

## 📦 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create production build |
| `npm run preview` | Preview production build locally |
| `npm test` | Run tests |
| `npm run lint` | Lint JavaScript files |
| `npm run lint:fix` | Fix linting issues automatically |
| `npm run format` | Format code with Prettier |
| `npm run clean` | Remove dist folder |

## 🏗️ Project Structure

```
cavebeat/
├── src/
│   ├── assets/          # Images, fonts, videos
│   ├── js/
│   │   ├── components/  # UI components
│   │   ├── webgl/       # Three.js modules
│   │   ├── utils/       # Helper functions
│   │   └── main.js      # Entry point
│   ├── styles/
│   │   ├── base/        # Reset, variables, typography
│   │   ├── components/  # Component styles
│   │   ├── layout/      # Grid system
│   │   └── main.css     # Main stylesheet
│   └── index.html       # HTML template
├── dist/                # Build output
├── public/              # Static files
├── webpack.config.js    # Webpack configuration
└── package.json         # Dependencies
```

## 🛠️ Tech Stack

- **Three.js** - WebGL 3D graphics library
- **Webpack** - Module bundler with code splitting
- **Babel** - JavaScript transpiler
- **PostCSS** - CSS processing and optimization
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🎨 Design System

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Cyan | `#49c5b6` | Primary accent |
| Coral | `#FF9398` | Secondary accent |
| Purple | `#8B5CF6` | Tertiary accent |
| Dark | `#0a0a0a` | Background |
| Darker | `#050505` | Deeper background |

### Typography

- **Font Family**: Inter
- **Weights**: 300, 400, 500, 600, 700, 900
- **Base Size**: 16px

### Breakpoints

| Device | Width |
|--------|-------|
| Mobile | < 480px |
| Tablet | 480px - 768px |
| Desktop | 768px - 1024px |
| Wide | > 1024px |

## 🔧 Configuration

All configuration is centralized in `src/js/utils/config.js`:

```javascript
export const CONFIG = {
  colors: { ... },
  cursor: { ... },
  webgl: { ... },
  performance: { ... }
};
```

## 📊 Performance

- **Lighthouse Score**: 95+
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **WebGL FPS**: 60fps (optimized)
- **Bundle Size**: < 500KB (gzipped)

## 🌐 Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## 📝 Development Guidelines

### Code Style

- Use ES6+ features
- Follow ESLint configuration
- Format code with Prettier
- Write meaningful comments

### Component Structure

```javascript
class Component {
  constructor() {
    this.init();
  }

  init() {
    // Setup code
  }

  destroy() {
    // Cleanup code
  }
}
```

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [Active Theory](https://activetheory.net)
- Three.js community
- WebGL community

## 📧 Contact

- **Website**: [https://cavebeat.com](https://cavebeat.com)
- **Email**: hello@cavebeat.com
- **Twitter**: [@cavebeat](https://twitter.com/cavebeat)

---

Made with ❤️ by the CaveBeat Team