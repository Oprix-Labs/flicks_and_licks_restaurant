/* ============================================================
   FLICKS & LICKS — main.js
   Shared: Preloader · Cursor · Navbar · Mobile Menu · Transitions · Tilt
   ============================================================ */

/* ── PRELOADER ───────────────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const onLoad = () => {
    gsap.to(preloader, {
      opacity: 0, duration: .9, delay: 1.1, ease: 'power2.inOut',
      onComplete: () => {
        preloader.style.display = 'none';
        document.dispatchEvent(new CustomEvent('pageReady'));
      }
    });
  };

  if (document.readyState === 'complete') {
    setTimeout(onLoad, 200);
  } else {
    window.addEventListener('load', onLoad);
  }
}

/* ── CUSTOM CURSOR ───────────────────────────────────────── */
function initCursor() {
  if (window.innerWidth < 768) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mX = 0, mY = 0, rX = 0, rY = 0;

  document.addEventListener('mousemove', e => {
    mX = e.clientX; mY = e.clientY;
    dot.style.left  = mX + 'px';
    dot.style.top   = mY + 'px';
  });

  (function animateRing() {
    rX += (mX - rX) * .12;
    rY += (mY - rY) * .12;
    ring.style.left = rX + 'px';
    ring.style.top  = rY + 'px';
    requestAnimationFrame(animateRing);
  })();

  const expand = () => { dot.classList.add('expanded'); ring.classList.add('expanded'); };
  const shrink = () => { dot.classList.remove('expanded'); ring.classList.remove('expanded'); };

  document.querySelectorAll('a, button, .tilt-card, .flip-card, .gallery-item, .menu-tab, .filter-btn, input, textarea, select').forEach(el => {
    el.addEventListener('mouseenter', expand);
    el.addEventListener('mouseleave', shrink);
  });
}

/* ── NAVBAR ──────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const update = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ── MOBILE MENU ─────────────────────────────────────────── */
function initMobileMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  if (!btn || !menu) return;

  const open  = () => { menu.classList.add('open'); btn.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const close = () => { menu.classList.remove('open'); btn.classList.remove('open'); document.body.style.overflow = ''; };

  btn.addEventListener('click', () => menu.classList.contains('open') ? close() : open());
  menu.querySelectorAll('.mobile-nav-link').forEach(l => l.addEventListener('click', close));
}

/* ── PAGE TRANSITIONS ────────────────────────────────────── */
function initPageTransitions() {
  const overlay = document.getElementById('page-transition');
  if (!overlay) return;

  // Fade in on arrival
  gsap.fromTo(overlay, { opacity: 1 }, { opacity: 0, duration: .5, ease: 'power2.out', delay: .05 });

  // Intercept internal links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel') || href === '') return;

    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.href;
      gsap.to(overlay, {
        opacity: 1, duration: .35, ease: 'power2.inOut',
        onComplete: () => { window.location.href = target; }
      });
    });
  });
}

/* ── CARD TILT ───────────────────────────────────────────── */
function initCardTilt() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = (e.clientX - r.left) / r.width  - .5;
      const y  = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `perspective(900px) rotateX(${-y * 14}deg) rotateY(${x * 14}deg) translateZ(12px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) translateZ(0)';
    });
  });
}

/* ── ACTIVE NAV LINK ─────────────────────────────────────── */
function setActiveNav() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
    if (link.getAttribute('href') === page) link.classList.add('active');
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCursor();
  initNavbar();
  initMobileMenu();
  initPageTransitions();
  initCardTilt();
  setActiveNav();
});
