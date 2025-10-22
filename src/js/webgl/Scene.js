/**
 * WebGL Scene
 * Main Three.js scene setup and management
 */

import * as THREE from 'three';
import { CONFIG } from '../utils/config';
import ParticleSystem from './ParticleSystem';
import Camera from './Camera';

class Scene {
  constructor() {
    this.canvas = null;
    this.scene = null;
    this.renderer = null;
    this.camera = null;
    this.particleSystem = null;
    this.rafId = null;
    this.clock = new THREE.Clock();
    this.mouse = { x: 0, y: 0 };
    this.scrollY = 0;
    this.isPaused = false;

    this.init();
  }

  /**
   * Initialize scene
   */
  init() {
    this.setupCanvas();
    this.setupRenderer();
    this.setupScene();
    this.setupCamera();
    this.setupParticles();
    this.setupEventListeners();
    this.animate();
  }

  /**
   * Setup canvas
   */
  setupCanvas() {
    this.canvas = document.getElementById('webgl-canvas');
    if (!this.canvas) {
      console.error('WebGL canvas not found');
      return;
    }
  }

  /**
   * Setup renderer
   */
  setupRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: CONFIG.webgl.alpha,
      antialias: CONFIG.webgl.antialias
    });

    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(CONFIG.webgl.pixelRatio);
    this.renderer.setClearColor(0x000000, 0);
  }

  /**
   * Setup scene
   */
  setupScene() {
    this.scene = new THREE.Scene();
  }

  /**
   * Setup camera
   */
  setupCamera() {
    this.camera = new Camera(this.canvas);
  }

  /**
   * Setup particle system
   */
  setupParticles() {
    this.particleSystem = new ParticleSystem(this.scene);
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));

    // Scroll
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
  }

  /**
   * Handle mouse move
   */
  handleMouseMove(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  /**
   * Handle scroll
   */
  handleScroll() {
    this.scrollY = window.pageYOffset;
  }

  /**
   * Animation loop
   */
  animate() {
    if (this.isPaused) return;

    this.rafId = requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Update particle system
    if (this.particleSystem) {
      this.particleSystem.update(elapsedTime, this.mouse, this.scrollY);
    }

    // Update camera
    if (this.camera) {
      this.camera.update(this.mouse);
    }

    // Render scene
    this.renderer.render(this.scene, this.camera.instance);
  }

  /**
   * Handle resize
   */
  handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Update camera
    if (this.camera) {
      this.camera.handleResize(width, height);
    }

    // Update renderer
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Handle visibility change
   */
  handleVisibilityChange(isHidden) {
    this.isPaused = isHidden;

    if (isHidden) {
      // Pause animations
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    } else {
      // Resume animations
      this.animate();
    }
  }

  /**
   * Destroy scene
   */
  destroy() {
    // Cancel animation frame
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    // Dispose particle system
    if (this.particleSystem) {
      this.particleSystem.destroy();
    }

    // Dispose renderer
    if (this.renderer) {
      this.renderer.dispose();
    }

    // Remove event listeners
    document.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('scroll', this.handleScroll);

    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particleSystem = null;
  }
}

export default Scene;