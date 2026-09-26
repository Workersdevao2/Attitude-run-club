// Custom Cursor
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

if (cursor && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .plan-btn, .event-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      ring.style.width = '52px';
      ring.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '12px';
      cursor.style.height = '12px';
      ring.style.width = '36px';
      ring.style.height = '36px';
    });
  });
}

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });
reveals.forEach(el => observer.observe(el));

// Nav scroll effect
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
}

// Language Toggle (simple PT/EN)
const translations = {
  pt: {
    'nav.home': 'Home',
    'nav.pilares': 'Pilares',
    'nav.planos': 'Planos',
    'nav.eventos': 'Eventos',
    'nav.roadmap': 'Roadmap',
    'nav.contacto': 'Contacto',
    'nav.cta': 'Juntar ao Clube',
    'hero.eyebrow': 'Luanda · Lisboa · Maputo · Cape Town',
    'hero.title1': 'Corre Com',
    'hero.title2': 'Atitude.',
    'hero.sub': 'A maior comunidade lusófona de corrida ligada a uma <strong>marca africana</strong>. Não é só treino — é tribo, identidade e movimento.',
    'hero.cta1': 'Quero Entrar',
    'hero.cta2': 'Ver Eventos',
    'pillars.label': 'Os Cinco Pilares',
    'pillars.title': 'O clube é mais que a corrida.',
    'cta.eyebrow': 'Junta-te à Tribo',
    'cta.title1': 'A tribo está',
    'cta.title2': 'a correr.',
    'cta.sub': 'O maior ativo não será a roupa. Será a tribo Attitude. A roupa vira símbolo. O treino vira ritual. A comunidade vira movimento.',
    'cta.btn1': 'Entrar Agora',
    'cta.btn2': 'Saber Mais'
  },
  en: {
    'nav.home': 'Home',
    'nav.pilares': 'Pillars',
    'nav.planos': 'Plans',
    'nav.eventos': 'Events',
    'nav.roadmap': 'Roadmap',
    'nav.contacto': 'Contact',
    'nav.cta': 'Join the Club',
    'hero.eyebrow': 'Luanda · Lisbon · Maputo · Cape Town',
    'hero.title1': 'Run With',
    'hero.title2': 'Attitude.',
    'hero.sub': 'The largest Portuguese-speaking running community linked to an <strong>African brand</strong>. It\'s not just training — it\'s tribe, identity and movement.',
    'hero.cta1': 'I Want In',
    'hero.cta2': 'See Events',
    'pillars.label': 'The Five Pillars',
    'pillars.title': 'The club is more than running.',
    'cta.eyebrow': 'Join the Tribe',
    'cta.title1': 'The tribe is',
    'cta.title2': 'running.',
    'cta.sub': 'The greatest asset won\'t be the clothes. It will be the Attitude tribe. Clothes become a symbol. Training becomes ritual. Community becomes movement.',
    'cta.btn1': 'Join Now',
    'cta.btn2': 'Learn More'
  }
};

let currentLang = localStorage.getItem('arc-lang') || 'pt';

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('arc-lang', lang);
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  document.querySelectorAll('.lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.querySelectorAll('.lang-toggle button').forEach(btn => {
  btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
});

// Init language
setLanguage(currentLang);

// Hamburger / Mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function closeMobileMenu() {
  if (hamburger) hamburger.classList.remove('active');
  if (mobileMenu) mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  // Close when a link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close when X button is clicked
  const mobileClose = document.getElementById('mobileClose');
  if (mobileClose) {
    mobileClose.addEventListener('click', closeMobileMenu);
  }
}