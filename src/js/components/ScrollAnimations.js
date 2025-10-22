/**
 * Scroll Animations Component
 */

import { CONFIG } from '../utils/config';

class ScrollAnimations {
  constructor() {
    this.observer = null;
    this.elements = [];
    this.init();
  }

  init() {
    this.setupObserver();
    this.observeElements();
    // Parallax disabled - was hiding hero content
    // this.setupParallax();
  }

  setupObserver() {
    const options = {
      threshold: CONFIG.scroll.threshold,
      rootMargin: CONFIG.scroll.rootMargin
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);
  }

  observeElements() {
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
      this.elements.push(card);
      this.observer.observe(card);
    });

    const animatedElements = document.querySelectorAll('[data-animate]');
    animatedElements.forEach(el => {
      this.elements.push(el);
      this.observer.observe(el);
    });
  }

  setupParallax() {
    // Disabled - was causing hero content to disappear
    /* 
    const heroContent = document.querySelector('.hero-content');
    if (!heroContent) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      if (scrolled < window.innerHeight) {
        const translateY = scrolled * CONFIG.scroll.parallaxMultiplier;
        const opacity = 1 - (scrolled / window.innerHeight);
        
        heroContent.style.transform = `translateY(${translateY}px)`;
        heroContent.style.opacity = opacity;
      }
    }, { passive: true });
    */
  }

  addElement(element) {
    if (element && !this.elements.includes(element)) {
      this.elements.push(element);
      this.observer.observe(element);
    }
  }

  removeElement(element) {
    if (element) {
      this.observer.unobserve(element);
      const index = this.elements.indexOf(element);
      if (index > -1) {
        this.elements.splice(index, 1);
      }
    }
  }

  handleResize() {
    // Recalculate if needed
  }

  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.elements = [];
  }
}

export default ScrollAnimations;
