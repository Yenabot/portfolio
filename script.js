/* ────────────────────────────────────────────────
   script.js — My Portfolio
   ──────────────────────────────────────────────── */

/* ══  THEME TOGGLE ══ */
const toggleBtn  = document.getElementById('theme-toggle');
const themeIcon  = toggleBtn.querySelector('.theme-icon');
const htmlEl     = document.documentElement;

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('portfolio-theme', theme);
}

// Load saved theme on page start
const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

toggleBtn.addEventListener('click', () => {
  const current = htmlEl.getAttribute('data-theme');
  applyTheme(current === 'dark' ? 'light' : 'dark');
});


/* ══ SCROLL-TRIGGERED ANIMATIONS ══ */
const animSections = document.querySelectorAll('.animate-section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Trigger skill bars when skills section becomes visible
      if (entry.target.id === 'skills') animateSkillBars();
    }
  });
}, { threshold: 0.1 });

animSections.forEach(s => observer.observe(s));


/* ══ SKILL BAR ANIMATION ══ */
let skillsAnimated = false;

function animateSkillBars() {
  if (skillsAnimated) return;
  skillsAnimated = true;
  document.querySelectorAll('.skill-bar-fill').forEach((bar, i) => {
    const target = bar.dataset.width;
    setTimeout(() => {
      bar.style.width = target + '%';
    }, i * 150);
  });
}


/* ══ ACTIVE NAV LINK ══ */
const navLinks = document.querySelectorAll('.nav-btn');
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
  let current = '';
  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    if (top <= 80) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}
window.addEventListener('scroll', setActiveNav, { passive: true });
setActiveNav();


/* ══  DYNAMIC ROLE  ══ */
const roles = [
  'Cybersecurity Enthusiast',
  'Junior Web Developer',
  'Linux User',
  'Hobbyist Coder',
  'Tech Explorer',
  'Problem Solver',
  'Youtuber'
];
const roleEl = document.getElementById('dynamic-role');
let roleIdx = 0;
let charIdx = 0;
let deleting = false;

function typeRole() {
  if (!roleEl) return;
  const current = roles[roleIdx];
  if (deleting) {
    roleEl.textContent = current.slice(0, charIdx--);
    if (charIdx < 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; charIdx = 0; setTimeout(typeRole, 500); return; }
    setTimeout(typeRole, 40);
  } else {
    roleEl.textContent = current.slice(0, charIdx++);
    if (charIdx > current.length) { deleting = true; setTimeout(typeRole, 2000); return; }
    setTimeout(typeRole, 60);
  }
}
setTimeout(typeRole, 1500);

/* ══ CONTACT FORM — VALIDATION + localStorage DRAFT ══ */
const form        = document.getElementById('contact-form');
const successBox  = document.getElementById('form-success');
const resetBtn    = document.getElementById('form-reset');
const savedNote   = document.getElementById('saved-note');

const fields = {
  name:    { el: document.getElementById('f-name'),    err: document.getElementById('err-name') },
  email:   { el: document.getElementById('f-email'),   err: document.getElementById('err-email') },
  subject: { el: document.getElementById('f-subject'), err: null },
  message: { el: document.getElementById('f-message'), err: document.getElementById('err-message') }
};

// Restore draft from localStorage
function restoreDraft() {
  const draft = JSON.parse(localStorage.getItem('portfolio-form-draft') || '{}');
  Object.entries(fields).forEach(([key, {el}]) => {
    if (draft[key]) el.value = draft[key];
  });
}
restoreDraft();

// Auto-save draft on input
let saveTimer;
function saveDraft() {
  const draft = {};
  Object.entries(fields).forEach(([key, {el}]) => { draft[key] = el.value; });
  localStorage.setItem('portfolio-form-draft', JSON.stringify(draft));
  savedNote.classList.add('visible');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => savedNote.classList.remove('visible'), 2000);
}

Object.values(fields).forEach(({el}) => {
  el.addEventListener('input', saveDraft);
});

// Validation helpers
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

// Submit
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

  // Simulate successful send
  form.style.display = 'none';
  successBox.hidden = false;
  localStorage.removeItem('portfolio-form-draft');
  alert('✅ Message sent! Thank you for reaching out, Venice will get back to you soon.');
});

// Reset form
resetBtn?.addEventListener('click', () => {
  form.reset();
  form.style.display = 'block';
  successBox.hidden = true;
  clearErrors();
});


/* ══  simple scroll progress visual in nav ══ */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  document.documentElement.style.setProperty('--scroll-progress', scrolled);
}, { passive: true });
