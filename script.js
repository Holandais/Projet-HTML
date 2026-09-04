// Éléments principaux du DOM
const body = document.body;
const themeToggle = document.getElementById('theme-toggle');
const yearElement = document.getElementById('year');
const scrollTopBtn = document.getElementById('scroll-top-btn');
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// Met à jour l'année dans le footer
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

// Gestion du thème clair/sombre
function applyTheme(theme) {
  const isDark = theme === 'dark';
  body.classList.toggle('dark-theme', isDark);
  body.classList.toggle('light-theme', !isDark);

  if (themeToggle) {
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    themeToggle.setAttribute('aria-label', isDark ? 'Passer au thème clair' : 'Passer au thème sombre');
  }

  localStorage.setItem('site-theme', theme);
}

const savedTheme = localStorage.getItem('site-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
applyTheme(savedTheme || (prefersDark ? 'dark' : 'light'));

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      if (formStatus) {
        formStatus.textContent = 'Merci de remplir tous les champs.';
        formStatus.style.color = '#dc2626';
      }
      return;
    }

    if (formStatus) {
      formStatus.textContent = 'Message envoyé avec succès !';
      formStatus.style.color = '#0f766e';
    }

    contactForm.reset();
  });
}

// Animation d'apparition au scroll
const revealItems = document.querySelectorAll('.card, .info-card, .card-section, .contact-link, .portfolio-card');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealItems.forEach((item) => observer.observe(item));

// Carrousel des projets
const slides = Array.from(document.querySelectorAll('.project-slide'));
const dots = Array.from(document.querySelectorAll('.dot'));
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentSlide = 0;

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === currentSlide);
  });

  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentSlide);
  });
}

if (slides.length && prevBtn && nextBtn) {
  prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));

  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => showSlide(idx));
  });

  setInterval(() => showSlide(currentSlide + 1), 5000);
}

// Carrousel et filtres des certifications
const certificationSlides = Array.from(document.querySelectorAll('.certification-slide'));
const certificationCards = Array.from(document.querySelectorAll('.certificate-card'));
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const certPrevBtn = document.querySelector('.certification-arrow.prev');
const certNextBtn = document.querySelector('.certification-arrow.next');
let activeCertificationFilter = 'all';
let certificationIndex = 0;

function getVisibleCertificationSlides() {
  return certificationSlides.filter((slide) => slide.querySelector('.certificate-card:not(.hidden)'));
}

function showCertificationSlide(index) {
  const visibleSlides = getVisibleCertificationSlides();

  if (!visibleSlides.length) {
    certificationSlides.forEach((slide) => slide.classList.remove('active'));
    return;
  }

  certificationIndex = (index + visibleSlides.length) % visibleSlides.length;

  certificationSlides.forEach((slide) => {
    const isActive = visibleSlides[certificationIndex] === slide;
    slide.classList.toggle('active', isActive);
  });
}

function applyCertificationFilter(filter) {
  activeCertificationFilter = filter;

  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  certificationCards.forEach((card) => {
    const matches = filter === 'all' || card.dataset.category === filter;
    card.classList.toggle('hidden', !matches);
  });

  certificationIndex = 0;
  showCertificationSlide(0);
}

if (filterButtons.length) {
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => applyCertificationFilter(button.dataset.filter));
  });
}

// Téléchargement direct des certificats PDF
const certificateDownloadLinks = document.querySelectorAll('.certificate-card a[href*="certifications/"]');
certificateDownloadLinks.forEach((link) => {
  const fileName = link.getAttribute('href').split('/').pop();
  link.setAttribute('download', fileName);
  link.setAttribute('target', '_self');
  link.setAttribute('rel', 'noopener noreferrer');
  link.setAttribute('aria-label', 'Télécharger le PDF');

  link.addEventListener('click', (event) => {
    event.preventDefault();

    const downloadLink = document.createElement('a');
    downloadLink.href = link.getAttribute('href');
    downloadLink.download = fileName;
    downloadLink.target = '_self';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  });
});

if (certPrevBtn && certNextBtn) {
  certPrevBtn.addEventListener('click', () => showCertificationSlide(certificationIndex - 1));
  certNextBtn.addEventListener('click', () => showCertificationSlide(certificationIndex + 1));
}

applyCertificationFilter(activeCertificationFilter);

// Bouton retour en haut
if (scrollTopBtn) {
  const updateScrollButton = () => {
    scrollTopBtn.classList.toggle('visible', window.scrollY > 300);
  };

  updateScrollButton();
  window.addEventListener('scroll', updateScrollButton);

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
