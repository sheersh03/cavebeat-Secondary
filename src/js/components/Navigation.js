/**
 * Navigation Component
 * Handles navbar scroll effects and interactions
 */

import { CONFIG } from '../utils/config';

class Navigation {
  constructor() {
    this.navbar = null;
    this.lastScroll = 0;
    this.isScrolled = false;
    this.init();
  }

  init() {
    this.navbar = document.getElementById('navbar');
    if (!this.navbar) {
      console.warn('Navigation element not found');
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
  }

  handleScroll() {
    const currentScroll = window.pageYOffset;

    if (currentScroll > CONFIG.navigation.scrollThreshold && !this.isScrolled) {
      this.navbar.classList.add('scrolled');
      this.isScrolled = true;
    } else if (currentScroll <= CONFIG.navigation.scrollThreshold && this.isScrolled) {
      this.navbar.classList.remove('scrolled');
      this.isScrolled = false;
    }

    this.lastScroll = currentScroll;
  }

  handleResize() {
    this.handleScroll();
  }

  destroy() {
    window.removeEventListener('scroll', this.handleScroll);
  }
}

export default Navigation;
