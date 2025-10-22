/**
 * Particle System
 * Creates and manages WebGL particle effects
 */

import * as THREE from 'three';
import { CONFIG } from '../utils/config';

class ParticleSystem {
  constructor(scene) {
    this.scene = scene;
    this.particles = null;
    this.geometry = null;
    this.material = null;
    this.particleCount = this.getParticleCount();
    
    this.init();
  }

  /**
   * Get particle count based on device
   */
  getParticleCount() {
    if (CONFIG.performance.reducedParticlesOnMobile && window.innerWidth < CONFIG.breakpoints.tablet) {
      return CONFIG.performance.mobileParticleCount;
    }
    return CONFIG.webgl.particleCount;
  }

  /**
   * Initialize particle system
   */
  init() {
    this.createGeometry();
    this.createMaterial();
    this.createParticles();
  }

  /**
   * Create particle geometry
   */
  createGeometry() {
    this.geometry = new THREE.BufferGeometry();

    const positions = new Float32Array(this.particleCount * 3);
    const colors = new Float32Array(this.particleCount * 3);
    const sizes = new Float32Array(this.particleCount);

    // Color palette
    const color1 = new THREE.Color(CONFIG.colors.cyan);
    const color2 = new THREE.Color(CONFIG.colors.coral);
    const color3 = new THREE.Color(CONFIG.colors.purple);

    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;

      // Position
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = (Math.random() - 0.5) * 20;
      positions[i3 + 2] = (Math.random() - 0.5) * 10;

      // Color
      const mixedColor = Math.random();
      let finalColor;
      
      if (mixedColor < 0.33) {
        finalColor = color1;
      } else if (mixedColor < 0.66) {
        finalColor = color2;
      } else {
        finalColor = color3;
      }

      colors[i3] = finalColor.r;
      colors[i3 + 1] = finalColor.g;
      colors[i3 + 2] = finalColor.b;

      // Size
      sizes[i] = Math.random() * 0.03 + 0.01;
    }

    this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    this.geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  }

  /**
   * Create particle material
   */
  createMaterial() {
    this.material = new THREE.PointsMaterial({
      size: CONFIG.webgl.particleSize,
      vertexColors: true,
      transparent: true,
      opacity: CONFIG.webgl.particleOpacity,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
      depthWrite: false
    });
  }

  /**
   * Create particle mesh
   */
  createParticles() {
    this.particles = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particles);
  }

  /**
   * Update particle system
   */
  update(time, mouse, scrollY) {
    if (!this.particles) return;

    // Rotate particle system
    this.particles.rotation.y = time * CONFIG.webgl.rotationSpeed + mouse.x * CONFIG.webgl.mouseInfluence;
    this.particles.rotation.x = time * (CONFIG.webgl.rotationSpeed * 0.6) + mouse.y * (CONFIG.webgl.mouseInfluence * 0.6);

    // Move particles based on scroll
    this.particles.position.y = scrollY * CONFIG.webgl.scrollInfluence;

    // Animate individual particles
    const positions = this.geometry.attributes.position.array;
    
    for (let i = 0; i < this.particleCount; i++) {
      const i3 = i * 3;
      const x = positions[i3];
      const y = positions[i3 + 1];

      // Wave motion
      positions[i3 + 1] = y + Math.sin(time + x) * 0.001;
      positions[i3] = x + Math.cos(time + y) * 0.001;
    }

    this.geometry.attributes.position.needsUpdate = true;
  }

  /**
   * Destroy particle system
   */
  destroy() {
    if (this.particles) {
      this.scene.remove(this.particles);
    }

    if (this.geometry) {
      this.geometry.dispose();
    }

    if (this.material) {
      this.material.dispose();
    }

    this.particles = null;
    this.geometry = null;
    this.material = null;
  }
}

export default ParticleSystem;