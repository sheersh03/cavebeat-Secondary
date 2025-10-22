/**
 * Application Configuration
 */

export const CONFIG = {
  // Environment - will be replaced by webpack
  isDevelopment: true,
  isProduction: false,

  // Colors
  colors: {
    cyan: '#49c5b6',
    coral: '#FF9398',
    purple: '#8B5CF6',
    dark: '#0a0a0a',
    darker: '#050505',
    white: '#ffffff'
  },

  // Cursor
  cursor: {
    size: 8,
    followerSize: 40,
    easing: 0.1,
    hoverScale: 3
  },

  // Navigation
  navigation: {
    offset: 80,
    scrollThreshold: 100,
    transitionDuration: 400
  },

  // Menu
  menu: {
    animationDelay: 100,
    transitionDuration: 600
  },

  // WebGL Scene
  webgl: {
    particleCount: 1000,
    particleSize: 0.05,
    particleOpacity: 0.8,
    rotationSpeed: 0.05,
    mouseInfluence: 0.5,
    scrollInfluence: 0.0005,
    fov: 75,
    near: 0.1,
    far: 1000,
    cameraZ: 5,
    antialias: true,
    alpha: true,
    pixelRatio: Math.min(window.devicePixelRatio, 2)
  },

  // Scroll Animations
  scroll: {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px',
    parallaxMultiplier: 0.5
  },

  // Performance
  performance: {
    reducedParticlesOnMobile: true,
    mobileParticleCount: 500,
    pauseOnHidden: true,
    targetFPS: 60
  },

  // Breakpoints
  breakpoints: {
    mobile: 480,
    tablet: 768,
    desktop: 1024,
    wide: 1440
  },

  // Timing functions
  easings: {
    default: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    smooth: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  },

  // API endpoints
  api: {
    baseUrl: 'https://api.cavebeat.com',
    timeout: 10000
  }
};

Object.freeze(CONFIG);

export default CONFIG;
