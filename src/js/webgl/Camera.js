/**
 * Camera
 * Manages Three.js camera
 */

import * as THREE from 'three';
import { CONFIG } from '../utils/config';

class Camera {
  constructor(canvas) {
    this.canvas = canvas;
    this.instance = null;
    this.init();
  }

  /**
   * Initialize camera
   */
  init() {
    this.instance = new THREE.PerspectiveCamera(
      CONFIG.webgl.fov,
      window.innerWidth / window.innerHeight,
      CONFIG.webgl.near,
      CONFIG.webgl.far
    );

    this.instance.position.z = CONFIG.webgl.cameraZ;
  }

  /**
   * Update camera based on mouse position
   */
  update(mouse) {
    // Subtle camera movement based on mouse
    this.instance.position.x += (mouse.x * 0.5 - this.instance.position.x) * 0.05;
    this.instance.position.y += (mouse.y * 0.5 - this.instance.position.y) * 0.05;
    this.instance.lookAt(0, 0, 0);
  }

  /**
   * Handle resize
   */
  handleResize(width, height) {
    this.instance.aspect = width / height;
    this.instance.updateProjectionMatrix();
  }
}

export default Camera;