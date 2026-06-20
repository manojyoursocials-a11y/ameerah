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
