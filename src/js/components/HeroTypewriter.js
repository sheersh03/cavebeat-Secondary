/**
 * HeroTypewriter animates the hero tagline with a typewriter effect.
 */
class HeroTypewriter {
  constructor(selector = '.hero-tag') {
    this.element = document.querySelector(selector);

    if (!this.element) {
      return;
    }

    this.text = this.element.dataset.typeText || this.element.textContent.trim();
    this.currentIndex = 0;
    this.typingDelay = 80; // milliseconds per character
    this.shouldRespectReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    if (this.shouldRespectReducedMotion) {
      this.element.textContent = this.text;
      this.element.classList.add('typewriter-complete');
      return;
    }

    this.element.textContent = '';
    this.typeNextCharacter();
  }

  typeNextCharacter() {
    if (this.currentIndex > this.text.length) {
      this.element.classList.add('typewriter-complete');
      return;
    }

    this.element.textContent = this.text.slice(0, this.currentIndex);
    this.currentIndex += 1;

    window.setTimeout(() => this.typeNextCharacter(), this.typingDelay);
  }
}

export default HeroTypewriter;
