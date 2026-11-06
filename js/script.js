// ===================== Mobile nav toggle =====================
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });
  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mainNav.classList.remove('open'));
  });
}

// ===================== Hero carousel (10 slides, autoplay) =====================
const carousel = document.getElementById('heroCarousel');
const dotsWrap = document.getElementById('heroDots');

if (carousel && dotsWrap) {
  const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
  let current = 0;
  let timer = null;
  const INTERVAL = 5000;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Build dot controls
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Show slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.hero-dot'));

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() { goTo(current + 1); }

  function start() {
    if (prefersReducedMotion) return;
    stop();
    timer = setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) clearInterval(timer);
  }

  start();
  carousel.closest('.hero-media').addEventListener('mouseenter', stop);
  carousel.closest('.hero-media').addEventListener('mouseleave', start);
}

// ===================== Scroll-reveal animations =====================
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger');

if (revealEls.length && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in-view'));
}

// ===================== Projects: filter + lightbox =====================
const projectGrid = document.getElementById('projectGrid');
const lightbox = document.getElementById('lightbox');

if (projectGrid && lightbox) {
  const items = Array.from(projectGrid.querySelectorAll('.masonry-item'));
  const pills = Array.from(document.querySelectorAll('.filter-pill[data-filter]'));
  const lbImg = lightbox.querySelector('.lb-img');
  const lbCap = lightbox.querySelector('.lb-caption');
  const moreBtn = document.getElementById('projectsMore');
  const PAGE = 12;
  let filter = 'all';
  let expanded = false;
  let visible = items;
  let index = 0;

  function render() {
    const matching = items.filter(it => filter === 'all' || it.dataset.project === filter);
    items.forEach(it => it.classList.add('is-hidden'));
    visible = expanded ? matching : matching.slice(0, PAGE);
    visible.forEach(it => {
      it.classList.remove('is-hidden');
      it.classList.add('in-view');
    });
    if (moreBtn) moreBtn.hidden = expanded || matching.length <= PAGE;
  }
  if (moreBtn) moreBtn.addEventListener('click', () => { expanded = true; render(); });
  let lastFocus = null;

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      filter = pill.dataset.filter;
      expanded = false;
      pills.forEach(p => {
        const on = p === pill;
        p.classList.toggle('active', on);
        p.setAttribute('aria-pressed', on);
      });
      render();
    });
  });
  render();

  function show(i) {
    index = (i + visible.length) % visible.length;
    const item = visible[index];
    const img = item.querySelector('img');
    lbImg.src = img.currentSrc || img.src;
    lbImg.alt = img.alt;
    const name = item.querySelector('.mi-name').textContent;
    const status = item.querySelector('.mi-status').textContent;
    lbCap.innerHTML = `<strong>${name}</strong>${status} · ${index + 1} / ${visible.length}`;
  }
  function open(item) {
    lastFocus = document.activeElement;
    show(visible.indexOf(item));
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.lb-close').focus();
  }
  function close() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  items.forEach(item => {
    item.tabIndex = 0;
    item.addEventListener('click', () => open(item));
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(item); }
    });
  });
  lightbox.querySelector('.lb-close').addEventListener('click', close);
  lightbox.querySelector('.lb-prev').addEventListener('click', () => show(index - 1));
  lightbox.querySelector('.lb-next').addEventListener('click', () => show(index + 1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) close(); });
  document.addEventListener('keydown', e => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });

  // Swipe on touch devices
  let startX = null;
  lightbox.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
    startX = null;
  });
}

// ===================== Contact form (demo only) =====================
// This form does not send data anywhere yet — wire it up to your email
// service, form backend (e.g. Formspree, Resend), or CRM of choice.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thanks! This is a demo form — connect it to your email service or form backend to start receiving real submissions.');
    contactForm.reset();
  });
}
