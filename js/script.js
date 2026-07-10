/* ────────────────────────────────────────────────
   script.js — nav, scroll fx, dynamic role
   ──────────────────────────────────────────────── */

/* active nav */
const navLinks = document.querySelectorAll('.nav-btn');
const currentPage = location.pathname.split('/').pop() || 'index.html';

navLinks.forEach(link => {
  const href = link.getAttribute('href');
  link.classList.toggle('active', href === currentPage);
});

/* scroll progress */
window.addEventListener('scroll', () => {
  const max = document.body.scrollHeight - window.innerHeight;
  const scrolled = max > 0 ? window.scrollY / max : 0;
  document.documentElement.style.setProperty('--scroll-progress', scrolled);
}, { passive: true });

/* scroll animations */
const animSections = document.querySelectorAll('.animate-section');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // skill bars
      if (entry.target.id === 'skills') animateSkillBars();
    }
  });
}, { threshold: 0.1 });

animSections.forEach(s => observer.observe(s));

/* skill bars */
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

/* dynamic role */
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
if (roleEl) setTimeout(typeRole, 1500);
