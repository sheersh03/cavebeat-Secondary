/**
 * CaveBeat - Main Application Entry Point
 * Initializes all components and manages application lifecycle
 */

import '../styles/main.css';
import Cursor from './components/Cursor';
import Navigation from './components/Navigation';
import Menu from './components/Menu';
import ScrollAnimations from './components/ScrollAnimations';
import ProjectModal from './components/ProjectModal';
import ServicesModal from './components/ServicesModal';
import HeroTypewriter from './components/HeroTypewriter';
import Scene from './webgl/Scene';
import { CONFIG } from './utils/config';

class App {
  constructor() {
    this.components = {};
    this.isInitialized = false;
    this.init();
  }

  /**
   * Initialize application
   */
  init() {
    // Check WebGL support
    if (!this.checkWebGLSupport()) {
      this.showFallback();
      return;
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  /**
   * Setup all components
   */
  setup() {
    try {
      // Initialize custom cursor (only on non-touch devices)
      if (!this.isTouchDevice()) {
        this.components.cursor = new Cursor();
      }

      // Initialize navigation
      this.components.navigation = new Navigation();

      // Initialize fullscreen menu
      this.components.menu = new Menu();

      // Initialize scroll animations
      this.components.scrollAnimations = new ScrollAnimations();

      // Initialize project request modal
      this.components.projectModal = new ProjectModal();

      // Initialize services modal (desktop only navigation trigger)
      this.components.servicesModal = new ServicesModal();

      // Initialize hero typewriter
      this.components.heroTypewriter = new HeroTypewriter();

      // Initialize WebGL scene
      this.components.scene = new Scene();

      // Setup event listeners
      this.setupEventListeners();

      // Mark as initialized
      this.isInitialized = true;

      // Log success in development
      if (CONFIG.isDevelopment) {
        console.log('✅ CaveBeat initialized successfully');
        console.log('Components:', Object.keys(this.components));
      }

      // Trigger custom event
      document.dispatchEvent(new CustomEvent('app:initialized'));
    } catch (error) {
      console.error('❌ Error initializing application:', error);
      this.showFallback();
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));

    // Handle visibility change (pause animations when tab is hidden)
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // Smooth scroll for anchor links
    this.setupSmoothScroll();

    // Handle orientation change on mobile
    window.addEventListener('orientationchange', () => {
      setTimeout(() => this.handleResize(), 200);
    });
  }

  /**
   * Handle window resize
   */
  handleResize() {
    Object.values(this.components).forEach(component => {
      if (component && typeof component.handleResize === 'function') {
        component.handleResize();
      }
    });
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange() {
    const isHidden = document.hidden;

    Object.values(this.components).forEach(component => {
      if (component && typeof component.handleVisibilityChange === 'function') {
        component.handleVisibilityChange(isHidden);
      }
    });

    if (CONFIG.isDevelopment) {
      console.log(`Tab is now ${isHidden ? 'hidden' : 'visible'}`);
    }
  }

  /**
   * Setup smooth scroll for anchor links
   */
  setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
          const offsetTop = target.offsetTop - CONFIG.navigation.offset;
          window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Check WebGL support
   */
  checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      return !!gl;
    } catch (e) {
      return false;
    }
  }

  /**
   * Check if device is touch-enabled
   */
  isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  /**
   * Show fallback for unsupported browsers
   */
  showFallback() {
    const fallbackMessage = document.createElement('div');
    fallbackMessage.className = 'fallback-message';
    fallbackMessage.innerHTML = `
      <div class="fallback-content">
        <h2>Browser Not Supported</h2>
        <p>Please use a modern browser with WebGL support to view this website.</p>
        <p>We recommend:</p>
        <ul>
          <li>Google Chrome (latest version)</li>
          <li>Mozilla Firefox (latest version)</li>
          <li>Safari (latest version)</li>
          <li>Microsoft Edge (latest version)</li>
        </ul>
      </div>
    `;
    document.body.appendChild(fallbackMessage);
  }

  /**
   * Destroy application and cleanup
   */
  destroy() {
    // Cleanup all components
    Object.values(this.components).forEach(component => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });

    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);

    this.components = {};
    this.isInitialized = false;

    if (CONFIG.isDevelopment) {
      console.log('🗑️ Application destroyed');
    }
  }
}

// Initialize application
const app = new App();

// Make app available globally for debugging in development
if (CONFIG.isDevelopment) {
  window.app = app;
}

// Handle hot module replacement in development
if (module.hot) {
  module.hot.accept();
}

export default App;
