const html = document.documentElement;
const yearEl = document.getElementById('year');
const langSwitch = document.getElementById('lang-switch');
const textNodes = document.querySelectorAll('.t');
const navToggle = document.getElementById('nav-toggle');
const siteNav = document.getElementById('site-nav');
const navLinks = document.querySelectorAll('#site-nav a');
const revealItems = document.querySelectorAll('.reveal');
const filterButtons = document.querySelectorAll('.filter-btn');
const albumCards = document.querySelectorAll('.album-card');

if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

function applyLanguage(lang) {
  html.setAttribute('data-lang', lang);
  html.setAttribute('lang', lang === 'ko' ? 'ko' : 'en');

  textNodes.forEach((node) => {
    const value = node.dataset[lang];
    if (value) node.innerHTML = value;
  });

  const currentLocale = lang === 'ko' ? 'ko_KR' : 'en_US';
  const localeMeta = document.querySelector('meta[property="og:locale"]');
  if (localeMeta) localeMeta.setAttribute('content', currentLocale);

  try {
    localStorage.setItem('fantasia-lang', lang);
  } catch (error) {
    // ignore storage errors
  }
}

let savedLang = 'en';
try {
  savedLang = localStorage.getItem('fantasia-lang') || 'en';
} catch (error) {
  savedLang = 'en';
}
applyLanguage(savedLang === 'ko' ? 'ko' : 'en');

if (langSwitch) {
  langSwitch.addEventListener('click', () => {
    const nextLang = html.getAttribute('data-lang') === 'en' ? 'ko' : 'en';
    applyLanguage(nextLang);
  });
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => observer.observe(item));

function applyFilter(filter) {
  albumCards.forEach((card) => {
    const format = card.dataset.format;
    const featured = card.dataset.featured === 'true';

    let show = false;
    if (filter === 'all') show = true;
    if (filter === 'stereo' && format === 'stereo') show = true;
    if (filter === 'atmos' && format === 'atmos') show = true;
    if (filter === 'featured' && featured) show = true;

    card.classList.toggle('is-hidden', !show);
  });
}

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterButtons.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    applyFilter(btn.dataset.filter);
  });
});

window.addEventListener('scroll', () => {
  const header = document.querySelector('.site-header');
  if (!header) return;
  header.style.borderBottomColor = window.scrollY > 20
    ? 'rgba(209, 168, 87, 0.12)'
    : 'rgba(255, 255, 255, 0.05)';
});
