import ModalBase from './ModalBase';

/**
 * ServicesModal drives the vertical services stack with gesture support and detail popups.
 */
class ServicesModal extends ModalBase {
  constructor() {
    super({
      modalId: 'servicesModal',
      triggerSelector: '[data-modal-open="services"]',
      focusFirstSelector: '.services-stack__item'
    });

    if (!this.modal) {
      return;
    }

    this.stackInitialized = false;
    this.currentIndex = 0;
    this.isDragging = false;
    this.startY = 0;
    this.currentY = 0;
    this.velocity = 0;
    this.lastTime = 0;
  }

  afterOpen() {
    if (this.dialog) {
      this.dialog.classList.add('is-animating-in');
    }

    if (!this.stackInitialized) {
      this.initStack();
    }

    if (this.stackInitialized) {
      this.showService(this.currentIndex, { immediate: true });
    }
  }

  afterClose() {
    if (this.dialog) {
      this.dialog.classList.remove('is-animating-in');
    }

    if (this.detail) {
      this.hideDetail(true);
    }

    // Cleanup listeners
    if (this.boundEscapeKey) {
      document.removeEventListener('keydown', this.boundEscapeKey);
    }
  }

  initStack() {
    this.stackRoot = this.modal.querySelector('[data-services-stack]');
    if (!this.stackRoot) {
      return;
    }

    this.track = this.stackRoot.querySelector('.services-stack__track');
    this.items = Array.from(this.stackRoot.querySelectorAll('.services-stack__item'));
    this.scrollThumb = this.stackRoot.querySelector('.services-stack__scroll-thumb');
    // Find detail portal at body level
    this.detail = document.querySelector('[data-service-detail]');

    if (!this.track || this.items.length === 0 || !this.detail) {
      return;
    }

    this.detailIcon = this.detail.querySelector('.services-detail__icon');
    this.detailTitle = this.detail.querySelector('.services-detail__title');
    this.detailList = this.detail.querySelector('.services-detail__usps');
    this.detailClose = this.detail.querySelector('[data-service-detail-close]');

    this.servicesData = this.items.map((item, index) => ({
      index,
      label: item.querySelector('.services-stack__label')?.textContent.trim() || `Service ${index + 1}`,
      icon: item.dataset.icon || item.querySelector('.services-stack__glyph')?.textContent.trim() || '',
      usps: (item.dataset.usps || '')
        .split('|')
        .map(usp => usp.trim())
        .filter(Boolean)
    }));

    this.items.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.showService(index);
        this.showDetail();
      });
      item.addEventListener('keydown', (event) => this.handleItemKeydown(event, index));
    });

    this.boundPointerDown = this.handlePointerDown.bind(this);
    this.boundPointerMove = this.handlePointerMove.bind(this);
    this.boundPointerUp = this.handlePointerUp.bind(this);
    this.boundWheel = this.handleWheel.bind(this);
    this.boundResize = this.updateMetrics.bind(this);

    this.track.addEventListener('pointerdown', this.boundPointerDown);
    this.track.addEventListener('wheel', this.boundWheel, { passive: false });
    window.addEventListener('resize', this.boundResize);

    if (this.detailClose) {
      this.detailClose.addEventListener('click', () => this.hideDetail());
    }

    // Close on backdrop click
    this.detail.addEventListener('click', (e) => {
      if (e.target === this.detail) {
        this.hideDetail();
      }
    });

    // Close on Escape key
    this.boundEscapeKey = (e) => {
      if (e.key === 'Escape' && this.detail.classList.contains('is-visible')) {
        e.preventDefault();
        this.hideDetail();
      }
    };
    document.addEventListener('keydown', this.boundEscapeKey);

    // Prevent event bubbling on detail card
    const detailCard = this.detail.querySelector('.services-detail__card');
    if (detailCard) {
      detailCard.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }

    this.stackInitialized = true;
    this.updateMetrics();
  }

  updateMetrics() {
    if (!this.stackInitialized) {
      return;
    }

    if (this.items.length > 1) {
      const firstRect = this.items[0].getBoundingClientRect();
      const secondRect = this.items[1].getBoundingClientRect();
      this.itemSpacing = secondRect.top - firstRect.top;
    } else {
      this.itemSpacing = this.items[0].getBoundingClientRect().height + 12;
    }

    this.visibleHeight = this.track.clientHeight;
    this.totalHeight = this.itemSpacing * this.items.length;

    this.applyTransform({ immediate: true });
  }

  showService(index, { immediate = false } = {}) {
    if (!this.stackInitialized) {
      return;
    }

    const clamped = Math.max(0, Math.min(index, this.items.length - 1));
    this.currentIndex = clamped;

    this.items.forEach((item, idx) => {
      const isActive = idx === clamped;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', String(isActive));
    });

    this.applyTransform({ immediate });
    this.renderDetail(this.servicesData[clamped]);
  }

  applyTransform({ immediate = false } = {}) {
    if (!this.stackInitialized) {
      return;
    }

    const targetOffset = -(this.itemSpacing * this.currentIndex);

    if (immediate) {
      this.track.style.transition = 'none';
    }

    this.track.style.transform = `translateY(${targetOffset}px)`;

    if (immediate) {
      void this.track.offsetHeight;
      this.track.style.transition = '';
    }

    this.updateScrollThumb();
  }

  updateScrollThumb() {
    if (!this.scrollThumb) {
      return;
    }

    if (this.totalHeight <= this.visibleHeight || this.items.length <= 1) {
      this.scrollThumb.style.opacity = '0';
      return;
    }

    this.scrollThumb.style.opacity = '1';
    const thumbRatio = Math.max(this.visibleHeight / this.totalHeight, 0.12);
    const heightPercent = thumbRatio * 100;
    const maxTravel = 100 - heightPercent;
    const progress = this.currentIndex / (this.items.length - 1 || 1);

    this.scrollThumb.style.height = `${heightPercent}%`;
    this.scrollThumb.style.transform = `translateY(${maxTravel * progress}%)`;
  }

  renderDetail(service) {
    if (!service) {
      return;
    }

    if (this.detailIcon) {
      this.detailIcon.textContent = service.icon;
    }

    if (this.detailTitle) {
      this.detailTitle.textContent = service.label;
    }

    if (this.detailList) {
      this.detailList.innerHTML = '';
      service.usps.forEach((usp, idx) => {
        const li = document.createElement('li');
        li.className = 'services-detail__usp';
        li.textContent = usp;
        li.style.transitionDelay = `${idx * 70}ms`;
        this.detailList.appendChild(li);
        requestAnimationFrame(() => {
          li.classList.add('is-visible');
        });
      });
    }
  }

  showDetail() {
    if (!this.detail) {
      return;
    }

    this.detail.classList.add('is-visible');
    this.detail.setAttribute('aria-hidden', 'false');

    // Focus trap
    setTimeout(() => {
      const closeBtn = this.detail.querySelector('.services-detail__close');
      if (closeBtn) {
        closeBtn.focus();
      }
    }, 100);
  }

  hideDetail(force = false) {
    if (!this.detail) {
      return;
    }

    if (force) {
      this.detail.classList.remove('is-visible');
      this.detail.setAttribute('aria-hidden', 'true');
      return;
    }

    this.detail.classList.remove('is-visible');
    this.detail.setAttribute('aria-hidden', 'true');
    const activeItem = this.items?.[this.currentIndex];
    if (activeItem) {
      activeItem.focus();
    }
  }

  handleItemKeydown(event, index) {
    switch (event.key) {
    case 'ArrowDown':
    case 'ArrowRight':
      event.preventDefault();
      this.focusItem(index + 1);
      break;
    case 'ArrowUp':
    case 'ArrowLeft':
      event.preventDefault();
      this.focusItem(index - 1);
      break;
    case 'Home':
      event.preventDefault();
      this.focusItem(0);
      break;
    case 'End':
      event.preventDefault();
      this.focusItem(this.items.length - 1);
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      this.showService(index);
      this.showDetail();
      break;
    case 'Escape':
      event.preventDefault();
      if (this.detail.classList.contains('is-visible')) {
        this.hideDetail();
      }
      break;
    default:
      break;
    }
  }

  focusItem(index) {
    const clamped = Math.max(0, Math.min(index, this.items.length - 1));
    const item = this.items[clamped];
    if (item) {
      item.focus();
      this.showService(clamped);
    }
  }

  handlePointerDown(event) {
    // Ignore if clicking on an item
    if (event.target.closest('.services-stack__item')) {
      return;
    }

    this.isDragging = true;
    this.startY = event.clientY;
    this.currentY = event.clientY;
    this.velocity = 0;
    this.lastTime = Date.now();
    this.track.setPointerCapture(event.pointerId);
    this.track.addEventListener('pointermove', this.boundPointerMove);
    this.track.addEventListener('pointerup', this.boundPointerUp, { once: true });
    this.track.addEventListener('pointercancel', this.boundPointerUp, { once: true });
  }

  handlePointerMove(event) {
    if (!this.isDragging) {
      return;
    }

    // Hide detail during swipe for smoother interaction
    if (this.detail.classList.contains('is-visible')) {
      this.hideDetail();
    }

    const now = Date.now();
    const dt = now - this.lastTime;
    const delta = event.clientY - this.startY;

    // Calculate velocity
    if (dt > 0) {
      this.velocity = (event.clientY - this.currentY) / dt;
    }

    this.currentY = event.clientY;
    this.lastTime = now;

    this.track.style.transition = 'none';
    const dampingFactor = 0.5;
    const offset = -(this.itemSpacing * this.currentIndex) + delta * dampingFactor;
    this.track.style.transform = `translateY(${offset}px)`;
  }

  handlePointerUp(event) {
    if (!this.isDragging) {
      return;
    }

    this.isDragging = false;
    this.track.releasePointerCapture(event.pointerId);
    this.track.removeEventListener('pointermove', this.boundPointerMove);

    // Ultra-smooth water-fluid transition with zero lag
    this.track.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)';

    const delta = event.clientY - this.startY;
    const threshold = 25;

    // Use velocity for inertia
    const velocityThreshold = 0.5;
    let targetIndex = this.currentIndex;

    if (Math.abs(this.velocity) > velocityThreshold) {
      targetIndex = this.velocity < 0 ? this.currentIndex + 1 : this.currentIndex - 1;
    } else if (Math.abs(delta) > threshold) {
      targetIndex = delta < 0 ? this.currentIndex + 1 : this.currentIndex - 1;
    } else {
      this.applyTransform();
      return;
    }

    this.showService(targetIndex);
  }

  handleWheel(event) {
    event.preventDefault();
    if (this.wheelLocked) {
      return;
    }

    this.wheelLocked = true;

    // Ultra-smooth wheel interaction
    this.track.style.transition = 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)';

    if (event.deltaY > 0) {
      this.showService(this.currentIndex + 1);
    } else if (event.deltaY < 0) {
      this.showService(this.currentIndex - 1);
    }

    window.setTimeout(() => {
      this.wheelLocked = false;
    }, 180);
  }

  destroy() {
    if (this.boundEscapeKey) {
      document.removeEventListener('keydown', this.boundEscapeKey);
    }
  }
}

export default ServicesModal;
