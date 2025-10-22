/**
 * ModalBase provides shared behaviour for overlay modals:
 * open/close triggers, focus management, accessibility helpers, and overlay dismissal.
 */
class ModalBase {
  constructor({
    modalId,
    triggerSelector,
    focusFirstSelector = null,
    closeSelector = '[data-modal-close]'
  }) {
    this.modal = document.getElementById(modalId);
    if (!this.modal) {
      return;
    }

    this.dialog = this.modal.querySelector('.modal-dialog');
    this.focusFirstSelector = focusFirstSelector;
    this.openButtons = triggerSelector ? document.querySelectorAll(triggerSelector) : [];
    this.closeButtons = this.modal.querySelectorAll(closeSelector);
    this.focusableSelector = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    this.previouslyFocusedElement = null;
    this.keydownHandler = this.handleKeydown.bind(this);

    this.bindEvents();
  }

  bindEvents() {
    this.openButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        this.open();
      });
    });

    this.closeButtons.forEach(button => {
      button.addEventListener('click', () => this.close());
    });

    ['mousedown', 'click'].forEach(eventName => {
      this.modal.addEventListener(eventName, (event) => {
        if (event.target === this.modal) {
          this.close();
        }
      });
    });

    this.bindAdditionalEvents();
  }

  bindAdditionalEvents() {
    // Hook for subclasses
  }

  open() {
    if (this.modal.classList.contains('is-visible')) {
      return;
    }

    this.previouslyFocusedElement = document.activeElement;
    this.modal.classList.add('is-visible');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    this.updateFocusableElements();
    document.addEventListener('keydown', this.keydownHandler);

    const focusTarget = this.focusFirstSelector
      ? this.modal.querySelector(this.focusFirstSelector)
      : null;

    if (focusTarget) {
      focusTarget.focus();
    } else if (this.dialog) {
      if (!this.dialog.hasAttribute('tabindex')) {
        this.dialog.setAttribute('tabindex', '-1');
      }
      this.dialog.focus();
    }

    this.afterOpen();
  }

  afterOpen() {
    // Hook for subclasses
  }

  close() {
    if (!this.modal.classList.contains('is-visible')) {
      return;
    }

    this.modal.classList.remove('is-visible');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.keydownHandler);

    if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
      this.previouslyFocusedElement.focus();
    }

    this.afterClose();
  }

  afterClose() {
    // Hook for subclasses
  }

  updateFocusableElements() {
    this.focusableElements = Array.from(this.modal.querySelectorAll(this.focusableSelector))
      .filter(el => el.offsetParent !== null && !el.hasAttribute('disabled'));
  }

  handleKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      return;
    }

    if (event.key === 'Tab') {
      this.trapFocus(event);
    }
  }

  trapFocus(event) {
    if (!this.focusableElements || this.focusableElements.length === 0) {
      return;
    }

    const { activeElement } = document;
    const first = this.focusableElements[0];
    const last = this.focusableElements[this.focusableElements.length - 1];

    if (event.shiftKey && activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

export default ModalBase;
