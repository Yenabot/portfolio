/* ────────────────────────────────────────────────
   feature.js — contact form
   ──────────────────────────────────────────────── */

const form       = document.getElementById('contact-form');
const successBox = document.getElementById('form-success');
const resetBtn   = document.getElementById('form-reset');
const savedNote  = document.getElementById('saved-note');

if (form) {
  const fields = {
    name:    { el: document.getElementById('f-name'),    err: document.getElementById('err-name') },
    email:   { el: document.getElementById('f-email'),   err: document.getElementById('err-email') },
    subject: { el: document.getElementById('f-subject'), err: null },
    message: { el: document.getElementById('f-message'), err: document.getElementById('err-message') }
  };

  // draft restore
  function restoreDraft() {
    const draft = JSON.parse(localStorage.getItem('portfolio-form-draft') || '{}');
    Object.entries(fields).forEach(([key, { el }]) => {
      if (draft[key]) el.value = draft[key];
    });
  }
  restoreDraft();

  // draft save
  let saveTimer;
  function saveDraft() {
    const draft = {};
    Object.entries(fields).forEach(([key, { el }]) => { draft[key] = el.value; });
    localStorage.setItem('portfolio-form-draft', JSON.stringify(draft));
    savedNote.classList.add('visible');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => savedNote.classList.remove('visible'), 2000);
  }

  Object.values(fields).forEach(({ el }) => {
    el.addEventListener('input', saveDraft);
  });

  // validation
  function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  }
  function setError(field, msg) {
    field.el.classList.toggle('invalid', !!msg);
    if (field.err) field.err.textContent = msg || '';
  }
  function clearErrors() {
    Object.values(fields).forEach(f => setError(f, ''));
  }

  // submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    if (!fields.name.el.value.trim()) {
      setError(fields.name, 'Please enter your name.'); valid = false;
    }
    if (!fields.email.el.value.trim()) {
      setError(fields.email, 'Please enter your email.'); valid = false;
    } else if (!validateEmail(fields.email.el.value)) {
      setError(fields.email, 'Please enter a valid email address.'); valid = false;
    }
    if (!fields.message.el.value.trim()) {
      setError(fields.message, 'Please enter a message.'); valid = false;
    } else if (fields.message.el.value.trim().length < 10) {
      setError(fields.message, 'Message must be at least 10 characters.'); valid = false;
    }

    if (!valid) return;

    // send
    form.style.display = 'none';
    successBox.hidden = false;
    localStorage.removeItem('portfolio-form-draft');
  });

  // reset
  resetBtn?.addEventListener('click', () => {
    form.reset();
    form.style.display = 'block';
    successBox.hidden = true;
    clearErrors();
  });
}
