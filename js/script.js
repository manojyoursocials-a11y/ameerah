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

// ===================== Subtle scroll motion: auto-tagging =====================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Section headings rise from a soft blur
document.querySelectorAll('main section h2, section h2').forEach(h => {
  if (!h.closest('.hero, .reveal, .reveal-stagger')) h.classList.add('reveal-text');
});
// Eyebrows and stand-alone paragraphs fade up
document.querySelectorAll('section > .container > .eyebrow, .projects-subheader').forEach(el => {
  if (!el.closest('.reveal, .reveal-stagger')) el.classList.add('reveal');
});
// Images unmask softly
document.querySelectorAll('.about-img-primary').forEach(el => el.classList.add('reveal-img'));
// About feature grid staggers in
document.querySelectorAll('.feature-grid').forEach(el => {
  if (!el.closest('.reveal, .reveal-stagger')) el.classList.add('reveal-stagger');
});
// Parallax layers (speed: px of drift per px scrolled, relative to viewport centre)
[['.about-img-primary', 0.04], ['.about-img-secondary', -0.08], ['.contact-image > img', 0.06],
 ['.featured-banner > video', 0.05], ['.hero-carousel', 0.18]].forEach(([sel, speed]) => {
  document.querySelectorAll(sel).forEach(el => { el.dataset.parallax = speed; });
});

// ===================== Scroll-linked effects (parallax, header, progress) =====================
const header = document.querySelector('.site-header');
const progress = document.createElement('div');
progress.className = 'scroll-progress';
progress.setAttribute('aria-hidden', 'true');
document.body.appendChild(progress);
const parallaxEls = reduceMotion ? [] : Array.from(document.querySelectorAll('[data-parallax]'));
let ticking = false;
function onScroll() {
  const y = window.scrollY;
  const vh = window.innerHeight;
  if (header) header.classList.toggle('is-scrolled', y > 20);
  const max = document.documentElement.scrollHeight - vh;
  progress.style.setProperty('--sp', max > 0 ? (y / max).toFixed(4) : 0);
  parallaxEls.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.bottom < -100 || r.top > vh + 100) return;
    const speed = parseFloat(el.dataset.parallax);
    if (el.classList.contains('hero-carousel')) {
      // Hero drifts down slower than the page, starting from rest at the top
      el.style.translate = `0 ${Math.min(y * speed, 160).toFixed(1)}px`;
      return;
    }
    const offset = (r.top + r.height / 2 - vh / 2) * speed;
    el.style.translate = `0 ${Math.max(-40, Math.min(40, -offset)).toFixed(1)}px`;
  });
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
}, { passive: true });
window.addEventListener('resize', onScroll);
onScroll();

// ===================== Scroll-reveal animations =====================
const revealEls = document.querySelectorAll('.reveal, .reveal-stagger, .reveal-img, .reveal-text');

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

// ===================== Featured walkthrough video =====================
const fBanner = document.getElementById('featuredBanner');
const fVideo = document.getElementById('featuredVideo');
const fPlay = document.getElementById('featuredPlay');
if (fBanner && fVideo && fPlay) {
  const pauseIcon = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z"/></svg>';
  const playIcon = fPlay.innerHTML;
  const toggle = () => {
    if (fVideo.paused) {
      fVideo.play();
      fBanner.classList.add('is-playing');
      fPlay.innerHTML = pauseIcon;
      fPlay.setAttribute('aria-label', 'Pause the Azure walkthrough');
    } else {
      fVideo.pause();
      fBanner.classList.remove('is-playing');
      fPlay.innerHTML = playIcon;
      fPlay.setAttribute('aria-label', 'Play the Azure walkthrough');
    }
  };
  fPlay.addEventListener('click', toggle);
  fVideo.addEventListener('click', toggle);
}

// ===================== Contact form → email =====================
// Opens the visitor's email app with a pre-filled message to both studio inboxes.
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fields = ['name', 'phone', 'requirements'].map(id => contactForm.querySelector('#' + id));
    let firstBad = null;
    fields.forEach(f => {
      const bad = !f.value.trim();
      f.classList.toggle('is-invalid', bad);
      f.setAttribute('aria-invalid', bad);
      if (bad && !firstBad) firstBad = f;
    });
    if (firstBad) { firstBad.focus(); return; }

    const [name, phone, req] = fields.map(f => f.value.trim());
    const to = contactForm.dataset.mailto;
    const subject = `New enquiry from ${name}`;
    const body = `Hello Ameerah Design Studio,

Name: ${name}
Phone: ${phone}

Requirements:
${req}

Thank you.`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
  contactForm.addEventListener('input', (e) => {
    if (e.target.classList.contains('is-invalid') && e.target.value.trim()) {
      e.target.classList.remove('is-invalid');
      e.target.removeAttribute('aria-invalid');
    }
  });
}
