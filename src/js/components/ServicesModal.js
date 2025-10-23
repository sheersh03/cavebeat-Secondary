import ModalBase from './ModalBase';

/**
 * ServicesModal powers the animated services stack with infinite looping,
 * gesture support, and detached USP overlay.
 */
class ServicesModal extends ModalBase {
  constructor({
    modalId = 'servicesModal',
    triggerSelector = '[data-modal-open="services"]',
    namespace = 'services'
  } = {}) {
    super({
      modalId,
      triggerSelector,
      focusFirstSelector: '.services-stack__item'
    });

    if (!this.modal) {
      return;
    }

    this.namespace = namespace;
    this.selectors = {
      stackRoot: `[data-stack-root="${this.namespace}"]`,
      detail: `[data-stack-detail="${this.namespace}"]`,
      detailClose: `[data-stack-detail-close="${this.namespace}"]`
    };

    this.stackInitialized = false;
    this.detailOpen = false;

    this.boundTransitionEnd = this.onTransitionEnd.bind(this);
    this.boundPointerDown = this.handlePointerDown.bind(this);
    this.boundPointerMove = this.handlePointerMove.bind(this);
    this.boundPointerUp = this.handlePointerUp.bind(this);
    this.boundWheel = this.handleWheel.bind(this);
    this.boundResize = this.updateMetrics.bind(this);
    this.boundStackKeydown = this.handleStackKeydown.bind(this);
    this.boundDetailClick = this.handleDetailClick.bind(this);
    this.boundDetailKeydown = this.handleDetailKeydown.bind(this);
  }

  afterOpen() {
    if (this.dialog) {
      this.dialog.classList.add('is-animating-in');
    }

    if (!this.stackInitialized) {
      this.initStack();
    }

    if (this.stackInitialized) {
      this.syncState({ immediate: true });
      this.focusCurrentItem();
    }

    this.modal.addEventListener('keydown', this.boundStackKeydown);
    if (this.detail) {
      this.detail.addEventListener('click', this.boundDetailClick);
      this.detail.addEventListener('keydown', this.boundDetailKeydown);
    }
  }

  afterClose() {
    if (this.dialog) {
      this.dialog.classList.remove('is-animating-in');
    }

    this.hideDetail(true);

    this.modal.removeEventListener('keydown', this.boundStackKeydown);
    if (this.detail) {
      this.detail.removeEventListener('click', this.boundDetailClick);
      this.detail.removeEventListener('keydown', this.boundDetailKeydown);
    }
  }

  initStack() {
    this.stackRoot = this.modal.querySelector(this.selectors.stackRoot);
    if (!this.stackRoot) {
      return;
    }

    this.viewport = this.stackRoot.querySelector('.services-stack__viewport');
    this.track = this.stackRoot.querySelector('.services-stack__track');
    this.scrollThumb = this.stackRoot.querySelector('.services-stack__scroll-thumb');

    this.detail = this.modal.querySelector(this.selectors.detail) || document.querySelector(this.selectors.detail);
    if (!this.track || !this.viewport || !this.detail) {
      return;
    }

    this.viewport.style.touchAction = 'none';
    this.track.style.willChange = 'transform';

    this.detailIcon = this.detail.querySelector('.services-detail__icon');
    this.detailTitle = this.detail.querySelector('.services-detail__title');
    this.detailList = this.detail.querySelector('.services-detail__usps');
    this.detailClose = this.detail.querySelector(this.selectors.detailClose);

    const initialItems = Array.from(this.track.querySelectorAll('.services-stack__item'));
    this.servicesData = initialItems.map((item, index) => ({
      index,
      label: item.querySelector('.services-stack__label')?.textContent.trim() || `Service ${index + 1}`,
      icon: item.dataset.icon || item.querySelector('.services-stack__glyph')?.textContent.trim() || '',
      usps: (item.dataset.usps || '')
        .split('|')
        .map(usp => usp.trim())
        .filter(Boolean)
    }));

    this.baseCount = this.servicesData.length;
    this.cycles = 3;
    this.cycleOffset = this.baseCount;

    this.track.innerHTML = '';
    this.buildTrack();

    this.items = Array.from(this.track.querySelectorAll('.services-stack__item'));
    this.totalVirtual = this.items.length;
    this.currentVirtualIndex = this.cycleOffset;
    this.activeOriginalIndex = 0;

    this.track.addEventListener('transitionend', this.boundTransitionEnd);
    this.viewport.addEventListener('pointerdown', this.boundPointerDown);
    this.viewport.addEventListener('wheel', this.boundWheel, { passive: false });
    window.addEventListener('resize', this.boundResize);

    if (this.detailClose) {
      this.detailClose.addEventListener('click', () => this.hideDetail());
    }

    this.stackInitialized = true;
    this.updateMetrics();
  }

  buildTrack() {
    const fragment = document.createDocumentFragment();
    let virtualIndex = 0;

    for (let cycle = 0; cycle < this.cycles; cycle += 1) {
      this.servicesData.forEach((service) => {
        const item = this.createItem(service);
        item.dataset.virtualIndex = String(virtualIndex);
        item.dataset.originalIndex = String(service.index);
        item.tabIndex = -1;

        item.addEventListener('click', () => {
          this.activateVirtualIndex(Number(item.dataset.virtualIndex), { openDetail: true });
        });

        item.addEventListener('keydown', (event) => {
          this.handleItemKeydown(event, Number(item.dataset.virtualIndex));
        });

        fragment.appendChild(item);
        virtualIndex += 1;
      });
    }

    this.track.appendChild(fragment);
  }

  createItem(service) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'services-stack__item';
    button.setAttribute('role', 'option');
    button.setAttribute('aria-selected', 'false');
    button.dataset.icon = service.icon;
    button.dataset.usps = service.usps.join('|');
    button.innerHTML = `
      <span class="services-stack__glyph" aria-hidden="true">${service.icon}</span>
      <span class="services-stack__label">${service.label}</span>
    `;
    return button;
  }

  updateMetrics() {
    if (!this.stackInitialized || !this.items.length) {
      return;
    }

    const firstRect = this.items[0].getBoundingClientRect();
    const secondRect = this.items[1]?.getBoundingClientRect();
    this.itemSpacing = secondRect ? secondRect.top - firstRect.top : firstRect.height + 12;
    this.visibleHeight = this.viewport.clientHeight;
    this.totalHeight = this.itemSpacing * this.totalVirtual;

    this.syncState({ immediate: true });
  }

  syncState({ immediate = false } = {}) {
    this.updateActiveClasses();
    this.applyTransform({ immediate });
    this.renderDetail(this.servicesData[this.activeOriginalIndex]);
    this.updateScrollThumb();
  }

  updateActiveClasses() {
    if (!this.items) {
      return;
    }

    this.items.forEach((item) => {
      const isActive = Number(item.dataset.virtualIndex) === this.currentVirtualIndex;
      item.classList.toggle('is-active', isActive);
      item.setAttribute('aria-selected', isActive ? 'true' : 'false');
      item.tabIndex = isActive ? 0 : -1;
    });
  }

  applyTransform({ immediate = false } = {}) {
    if (!this.track) {
      return;
    }

    if (immediate) {
      this.track.style.transition = 'none';
    }

    const translateY = -(this.itemSpacing * this.currentVirtualIndex);
    this.track.style.transform = `translateY(${translateY}px)`;

    if (immediate) {
      void this.track.offsetHeight;
      this.track.style.transition = '';
    }
  }

  onTransitionEnd(event) {
    if (event.propertyName !== 'transform') {
      return;
    }
    this.normalizeVirtualIndex();
  }

  normalizeVirtualIndex() {
    const minIndex = this.cycleOffset;
    const maxIndex = this.cycleOffset + this.baseCount - 1;
    const hadFocus = this.isFocusWithinStack();

    if (this.currentVirtualIndex > maxIndex) {
      this.currentVirtualIndex -= this.baseCount;
      this.applyTransform({ immediate: true });
      this.updateActiveClasses();
    } else if (this.currentVirtualIndex < minIndex) {
      this.currentVirtualIndex += this.baseCount;
      this.applyTransform({ immediate: true });
      this.updateActiveClasses();
    }

    if (hadFocus) {
      this.focusCurrentItem();
    }
  }

  getOriginalIndex(virtualIndex) {
    const index = virtualIndex % this.baseCount;
    return (index + this.baseCount) % this.baseCount;
  }

  step(delta) {
    this.currentVirtualIndex += delta;
    this.activeOriginalIndex = this.getOriginalIndex(this.currentVirtualIndex);
    this.syncState();
  }

  activateVirtualIndex(virtualIndex, { openDetail = false, immediate = false } = {}) {
    this.currentVirtualIndex = virtualIndex;
    this.activeOriginalIndex = this.getOriginalIndex(this.currentVirtualIndex);
    this.syncState({ immediate });

    if (openDetail) {
      this.showDetail();
    } else if (this.detailOpen) {
      this.renderDetail(this.servicesData[this.activeOriginalIndex]);
    }
  }

  handleItemKeydown(event, virtualIndex) {
    switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      this.step(1);
      this.focusCurrentItem();
      break;
    case 'ArrowUp':
      event.preventDefault();
      this.step(-1);
      this.focusCurrentItem();
      break;
    case 'Enter':
    case ' ':
      event.preventDefault();
      this.activateVirtualIndex(virtualIndex, { openDetail: true });
      break;
    case 'Escape':
      this.hideDetail();
      break;
    default:
      break;
    }
  }

  handleStackKeydown(event) {
    if (event.key === 'Escape' && this.detailOpen) {
      event.stopPropagation();
      this.hideDetail();
      return;
    }

    if (event.target !== this.modal) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.step(1);
      this.focusCurrentItem();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.step(-1);
      this.focusCurrentItem();
    }
  }

  focusCurrentItem() {
    const active = this.items?.find(item => Number(item.dataset.virtualIndex) === this.currentVirtualIndex);
    if (active) {
      active.focus({ preventScroll: true });
    }
  }

  isFocusWithinStack() {
    const activeElement = document.activeElement;
    return !!activeElement && activeElement.classList?.contains('services-stack__item');
  }

  updateScrollThumb() {
    if (!this.scrollThumb || this.baseCount <= 1) {
      return;
    }

    const ratio = this.visibleHeight / (this.itemSpacing * this.baseCount);
    const thumbSize = Math.max(ratio * 100, 18);
    const maxTravel = 100 - thumbSize;
    const progress = this.activeOriginalIndex / (this.baseCount - 1 || 1);

    this.scrollThumb.style.height = `${thumbSize}%`;
    this.scrollThumb.style.transform = `translateY(${progress * maxTravel}%)`;
  }

  handleWheel(event) {
    event.preventDefault();
    event.stopPropagation();
    const raw = event.deltaY / this.itemSpacing;
    const steps = raw > 0 ? Math.max(1, Math.min(3, Math.round(raw))) : Math.min(-1, Math.max(-3, Math.round(raw)));
    this.step(steps);
  }

  handlePointerDown(event) {
    if (event.pointerType === 'mouse' && event.button !== 0) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.isSwiping = true;
    this.swipeStartY = event.clientY;
    this.startVirtualIndex = this.currentVirtualIndex;
    this.viewport.setPointerCapture(event.pointerId);
    this.viewport.addEventListener('pointermove', this.boundPointerMove);
    this.viewport.addEventListener('pointerup', this.boundPointerUp, { once: true });
    this.viewport.addEventListener('pointercancel', this.boundPointerUp, { once: true });
    this.track.style.transition = 'none';
  }

  handlePointerMove(event) {
    if (!this.isSwiping) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const deltaY = event.clientY - this.swipeStartY;
    const previewIndex = this.startVirtualIndex + (-deltaY / this.itemSpacing);
    const translate = -(previewIndex * this.itemSpacing);
    this.track.style.transform = `translateY(${translate}px)`;
  }

  handlePointerUp(event) {
    if (!this.isSwiping) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.isSwiping = false;
    this.viewport.releasePointerCapture(event.pointerId);
    this.viewport.removeEventListener('pointermove', this.boundPointerMove);
    this.track.style.transition = '';

    const deltaY = event.clientY - this.swipeStartY;
    const steps = Math.round(-deltaY / this.itemSpacing);

    if (steps !== 0) {
      this.step(steps);
    } else {
      this.applyTransform();
    }
  }

  handleDetailClick(event) {
    if (event.target === this.detail) {
      this.hideDetail();
    }
  }

  handleDetailKeydown(event) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      this.hideDetail();
    }
  }

  renderDetail(service) {
    if (!service || !this.detail) {
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
        li.style.transitionDelay = `${idx * 80}ms`;
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
    this.detailOpen = true;
    if (this.detailClose) {
      this.detailClose.focus({ preventScroll: true });
    }
  }

  hideDetail(force = false) {
    if (!this.detail) {
      return;
    }

    if (force) {
      this.detail.classList.remove('is-visible');
      this.detail.setAttribute('aria-hidden', 'true');
      this.detailOpen = false;
      return;
    }

    if (!this.detailOpen) {
      return;
    }

    this.detail.classList.remove('is-visible');
    this.detail.setAttribute('aria-hidden', 'true');
    this.detailOpen = false;
    this.focusCurrentItem();
  }
}

export default ServicesModal;
