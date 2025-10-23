/**
 * Fullscreen Menu Component
 */

import { CONFIG } from '../utils/config';

class Menu {
  constructor() {
    this.menuToggle = null;
    this.menu = null;
    this.isOpen = false;
    this.init();
  }

  init() {
    this.menuToggle = document.getElementById('menuToggle');
    this.menu = document.getElementById('fullscreenMenu');

    if (!this.menuToggle || !this.menu) {
      console.warn('Menu elements not found');
      return;
    }

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.menuToggle.addEventListener('click', () => this.toggle());

    const menuLinks = this.menu.querySelectorAll('.menu-items a');
    menuLinks.forEach(link => {
      link.addEventListener('click', () => this.close());
    });

    const modalButtons = this.menu.querySelectorAll('[data-modal-open]');
    modalButtons.forEach(button => {
      button.addEventListener('click', () => this.close());
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    this.menu.addEventListener('click', (e) => {
      if (e.target === this.menu) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    this.menuToggle.classList.add('active');
    this.menu.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  close() {
    this.isOpen = false;
    this.menuToggle.classList.remove('active');
    this.menu.classList.remove('active');
    document.body.style.overflow = '';
  }

  destroy() {
    if (this.menuToggle) {
      this.menuToggle.removeEventListener('click', this.toggle);
    }
  }
}

export default Menu;
