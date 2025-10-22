/**
 * Custom Cursor Component
 */

import { CONFIG } from '../utils/config';

class Cursor {
  constructor() {
    this.cursor = null;
    this.follower = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.followerX = 0;
    this.followerY = 0;
    this.isHovering = false;
    this.rafId = null;

    this.init();
  }

  init() {
    this.createElements();
    this.setupEventListeners();
    this.animate();
  }

  createElements() {
    this.cursor = document.createElement('div');
    this.cursor.className = 'cursor';
    
    this.follower = document.createElement('div');
    this.follower.className = 'cursor-follower';

    document.body.appendChild(this.cursor);
    document.body.appendChild(this.follower);
    document.body.style.cursor = 'none';
  }

  setupEventListeners() {
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));

    const interactiveElements = document.querySelectorAll(
      'a, button, .menu-toggle, .project-card, [role="button"]'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => this.setHoverState(true));
      el.addEventListener('mouseleave', () => this.setHoverState(false));
    });

    document.addEventListener('mouseleave', () => this.hide());
    document.addEventListener('mouseenter', () => this.show());
  }

  handleMouseMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;

    this.cursor.style.left = `${this.mouseX}px`;
    this.cursor.style.top = `${this.mouseY}px`;
  }

  animate() {
    this.followerX += (this.mouseX - this.followerX) * CONFIG.cursor.easing;
    this.followerY += (this.mouseY - this.followerY) * CONFIG.cursor.easing;

    this.follower.style.left = `${this.followerX}px`;
    this.follower.style.top = `${this.followerY}px`;

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  setHoverState(isHovering) {
    this.isHovering = isHovering;

    if (isHovering) {
      this.cursor.classList.add('hover');
      this.follower.classList.add('hover');
    } else {
      this.cursor.classList.remove('hover');
      this.follower.classList.remove('hover');
    }
  }

  hide() {
    this.cursor.style.opacity = '0';
    this.follower.style.opacity = '0';
  }

  show() {
    this.cursor.style.opacity = '1';
    this.follower.style.opacity = '1';
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor);
    }
    if (this.follower && this.follower.parentNode) {
      this.follower.parentNode.removeChild(this.follower);
    }

    document.body.style.cursor = '';
  }
}

export default Cursor;
