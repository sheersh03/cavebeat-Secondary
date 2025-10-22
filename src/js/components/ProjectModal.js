import ModalBase from './ModalBase';

/**
 * ProjectModal handles the project request form modal.
 * Provides accessible interactions, validation, and focus management.
 */
class ProjectModal extends ModalBase {
  constructor() {
    super({
      modalId: 'projectModal',
      triggerSelector: '[data-modal-open="project"]',
      focusFirstSelector: 'input, select, textarea'
    });

    if (!this.modal) {
      return;
    }

    this.form = this.modal.querySelector('#projectRequestForm');
    this.statusEl = this.modal.querySelector('.form-status');

    if (this.form) {
      this.form.addEventListener('submit', (event) => this.handleSubmit(event));
    }
  }

  afterClose() {
    this.clearStatus();
  }

  handleSubmit(event) {
    event.preventDefault();
    if (!this.form) {
      return;
    }

    if (!this.form.checkValidity()) {
      this.form.reportValidity();
      this.setStatus('Please complete all required fields.', true);
      return;
    }

    this.setStatus('Sending request...', false);

    setTimeout(() => {
      this.setStatus('Project request sent! We will reach out shortly.', false, true);
      this.form.reset();
      this.close();
    }, 600);
  }

  setStatus(message, isError = false, isSuccess = false) {
    if (!this.statusEl) {
      return;
    }

    this.statusEl.textContent = message;
    this.statusEl.classList.toggle('form-status--error', isError);
    this.statusEl.classList.toggle('form-status--success', isSuccess);
  }

  clearStatus() {
    this.setStatus('');
  }
}

export default ProjectModal;
