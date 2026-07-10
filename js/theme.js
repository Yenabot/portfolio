/* ────────────────────────────────────────────────
   theme.js — dark mode, font size, contrast
   ──────────────────────────────────────────────── */

const htmlEl = document.documentElement;

/* dark mode */
const darkToggle = document.getElementById('dark-toggle');

function applyTheme(theme) {
  htmlEl.setAttribute('data-theme', theme);
  if (darkToggle) darkToggle.checked = theme === 'dark';
  localStorage.setItem('portfolio-theme', theme);
}

const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
applyTheme(savedTheme);

darkToggle?.addEventListener('change', () => {
  applyTheme(darkToggle.checked ? 'dark' : 'light');
});

/* font size */
const fontSizes = ['sm', 'md', 'lg'];
const fontDec = document.getElementById('font-dec');
const fontInc = document.getElementById('font-inc');

function applyFontSize(size) {
  htmlEl.setAttribute('data-fontsize', size);
  localStorage.setItem('portfolio-fontsize', size);
}

const savedFontSize = localStorage.getItem('portfolio-fontsize') || 'md';
applyFontSize(savedFontSize);

function stepFontSize(dir) {
  const current = htmlEl.getAttribute('data-fontsize') || 'md';
  const idx = fontSizes.indexOf(current);
  const next = fontSizes[Math.min(fontSizes.length - 1, Math.max(0, idx + dir))];
  applyFontSize(next);
}

fontDec?.addEventListener('click', () => stepFontSize(-1));
fontInc?.addEventListener('click', () => stepFontSize(1));

/* high contrast */
const contrastToggle = document.getElementById('contrast-toggle');

function applyContrast(on) {
  if (on) htmlEl.setAttribute('data-contrast', 'high');
  else htmlEl.removeAttribute('data-contrast');
  if (contrastToggle) contrastToggle.checked = on;
  localStorage.setItem('portfolio-contrast', on ? '1' : '0');
}

applyContrast(localStorage.getItem('portfolio-contrast') === '1');

contrastToggle?.addEventListener('change', () => {
  applyContrast(contrastToggle.checked);
});

/* settings panel */
const settingsBtn   = document.getElementById('settings-toggle');
const settingsPanel = document.getElementById('settings-panel');

settingsBtn?.addEventListener('click', (e) => {
  e.stopPropagation();
  settingsPanel.classList.toggle('open');
});

document.addEventListener('click', (e) => {
  if (!settingsPanel) return;
  if (settingsPanel.classList.contains('open') &&
      !settingsPanel.contains(e.target) &&
      e.target !== settingsBtn) {
    settingsPanel.classList.remove('open');
  }
});
