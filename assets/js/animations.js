/* ============================================================
   FLICKS & LICKS — animations.js
   GSAP ScrollTrigger · Tabs · Lightbox · Gallery · Forms
   ============================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── SCROLL REVEALS ──────────────────────────────────────── */
function initScrollReveals() {
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: .9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });
}

/* ── STAGGER REVEALS ─────────────────────────────────────── */
function initStaggerReveals() {
  gsap.utils.toArray('.reveal-stagger').forEach(container => {
    const items = container.querySelectorAll('.stagger-item');
    if (!items.length) return;
    gsap.fromTo(items, { opacity: 0, y: 40 }, {
      opacity: 1, y: 0, duration: .8, stagger: .15, ease: 'power3.out',
      scrollTrigger: { trigger: container, start: 'top 82%', once: true }
    });
  });
}

/* ── PARALLAX ────────────────────────────────────────────── */
function initParallax() {
  gsap.utils.toArray('.parallax-img').forEach(el => {
    gsap.to(el, {
      yPercent: -18, ease: 'none',
      scrollTrigger: {
        trigger: el.closest('.parallax-container') || el.parentElement,
        start: 'top bottom', end: 'bottom top', scrub: true,
      }
    });
  });
}

/* ── WORD-BY-WORD REVEAL ─────────────────────────────────── */
function initWordReveal() {
  document.querySelectorAll('.word-reveal').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w =>
      `<span class="word-wrap"><span class="word-inner" style="transform:translateY(110%);display:inline-block;">${w}</span></span>`
    ).join(' ');

    const spans = el.querySelectorAll('.word-inner');
    ScrollTrigger.create({
      trigger: el, start: 'top 82%', once: true,
      onEnter: () => gsap.to(spans, { y: 0, opacity: 1, duration: .7, stagger: .04, ease: 'power3.out' })
    });
  });
}

/* ── DRAW UNDERLINE ──────────────────────────────────────── */
function initDrawUnderline() {
  document.querySelectorAll('.draw-underline').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => el.classList.add('drawn')
    });
  });
}

/* ── TIMELINE NODES ──────────────────────────────────────── */
function initTimeline() {
  gsap.utils.toArray('.timeline-node').forEach((node, i) => {
    gsap.fromTo(node, { opacity: 0, x: i % 2 === 0 ? -50 : 50 }, {
      opacity: 1, x: 0, duration: .85, ease: 'power3.out',
      scrollTrigger: { trigger: node, start: 'top 82%', once: true }
    });
  });
}

/* ── HERO ANIMATIONS (index.html) ────────────────────────── */
function initHeroAnimations() {
  if (!document.querySelector('.hero-content')) return;
  const tl = gsap.timeline({ delay: 1.4 });
  tl.fromTo('.hero-label',    { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6, ease: 'power3.out' })
    .fromTo('.hero-title',    { opacity: 0, y: 45 }, { opacity: 1, y: 0, duration: .85, ease: 'power3.out' }, '-=.2')
    .fromTo('.hero-subtitle', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .7,  ease: 'power3.out' }, '-=.3')
    .fromTo('.hero-cta',      { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6,  stagger: .15, ease: 'power3.out' }, '-=.3')
    .fromTo('.hero-scroll',   { opacity: 0 },         { opacity: 1, duration: .5 }, '-=.1');
}

/* ── NUMBER COUNTERS ─────────────────────────────────────── */
function initCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target  = parseInt(el.dataset.count);
    const suffix  = el.dataset.suffix || '';
    let counted   = false;

    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !counted) {
          counted = true;
          let cur = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            cur += step;
            if (cur >= target) { cur = target; clearInterval(timer); }
            el.textContent = Math.floor(cur) + suffix;
          }, 16);
        }
      });
    }, { threshold: .5 });
    obs.observe(el);
  });
}

/* ── GALLERY FILTER ──────────────────────────────────────── */
function initGalleryFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const show = filter === 'all'
        ? [...items]
        : [...items].filter(item => item.dataset.category === filter);
      const hide = [...items].filter(item => !show.includes(item));

      gsap.to(hide, {
        opacity: 0, scale: .92, duration: .3, stagger: .04, ease: 'power2.in',
        onComplete: () => hide.forEach(i => { i.style.display = 'none'; })
      });

      setTimeout(() => {
        show.forEach(item => { item.style.display = 'block'; item.style.opacity = '0'; item.style.transform = 'scale(.92)'; });
        gsap.to(show, { opacity: 1, scale: 1, duration: .4, stagger: .06, ease: 'power2.out' });
      }, 320);
    });
  });
}

/* ── LIGHTBOX ────────────────────────────────────────────── */
function initLightbox() {
  const lb      = document.getElementById('lightbox');
  const lbImg   = document.getElementById('lightbox-img');
  const lbClose = document.getElementById('lightbox-close');
  const lbPrev  = document.getElementById('lightbox-prev');
  const lbNext  = document.getElementById('lightbox-next');
  if (!lb || !lbImg) return;

  const imgs = [...document.querySelectorAll('.gallery-item img')];
  let cur = 0;

  const open  = i  => { cur = i; lbImg.src = imgs[cur].src; lb.classList.add('active'); document.body.style.overflow = 'hidden'; };
  const close = () => { lb.classList.remove('active'); document.body.style.overflow = ''; };
  const prev  = () => { cur = (cur - 1 + imgs.length) % imgs.length; gsap.fromTo(lbImg, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: .3 }); lbImg.src = imgs[cur].src; };
  const next  = () => { cur = (cur + 1)               % imgs.length; gsap.fromTo(lbImg, { x:  40, opacity: 0 }, { x: 0, opacity: 1, duration: .3 }); lbImg.src = imgs[cur].src; };

  document.querySelectorAll('.gallery-item').forEach((item, i) => item.addEventListener('click', () => open(i)));
  lbClose?.addEventListener('click', close);
  lbPrev?.addEventListener('click',  prev);
  lbNext?.addEventListener('click',  next);
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  });
}

/* ── MENU TABS ───────────────────────────────────────────── */
function initMenuTabs() {
  const tabs     = document.querySelectorAll('.menu-tab');
  const sections = document.querySelectorAll('.menu-section');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      sections.forEach(sec => {
        if (sec.dataset.section === target) {
          sec.style.display = 'grid';
          gsap.fromTo(sec, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .4, ease: 'power2.out' });
        } else {
          gsap.to(sec, { opacity: 0, duration: .2, onComplete: () => { sec.style.display = 'none'; } });
        }
      });
    });
  });
}

/* ── FORM VALIDATION ─────────────────────────────────────── */
function validateField(input) {
  const errEl = input.parentElement?.querySelector('.field-error');
  const val   = input.value.trim();
  let ok = true, msg = '';

  if (input.required && !val) {
    ok = false; msg = 'This field is required.';
  } else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
    ok = false; msg = 'Please enter a valid email.';
  } else if (input.type === 'tel' && val && !/^[\d\s\-+()]{7,}$/.test(val)) {
    ok = false; msg = 'Please enter a valid phone number.';
  }

  input.classList.toggle('error',   !ok && val !== '');
  input.classList.toggle('success',  ok && !!val);
  if (errEl) { errEl.textContent = msg; errEl.classList.toggle('show', !ok); }
  return ok;
}

function showSuccess(form) {
  // Look for a sibling thank-you element first, then fall back to inside form
  const el = document.getElementById('reservation-thankyou')
          || document.getElementById('contact-thankyou')
          || form.querySelector('.success-message');
  if (!el) return;
  form.style.display = 'none';
  el.classList.add('show');
  gsap.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' });
  el.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function initFormValidation(formId) {
  const form = document.getElementById(formId);
  if (!form) return;

  const inputs = form.querySelectorAll('.form-input');
  inputs.forEach(inp => {
    inp.addEventListener('input', () => validateField(inp));
    inp.addEventListener('blur',  () => validateField(inp));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const valid = [...inputs].map(validateField).every(Boolean);
    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    btn.classList.add('btn-loading');
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove('btn-loading');
      btn.disabled = false;
      showSuccess(form);
      form.reset();
      inputs.forEach(i => i.classList.remove('success', 'error'));
    }, 2000);
  });
}

/* ── INIT ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveals();
  initStaggerReveals();
  initParallax();
  initWordReveal();
  initDrawUnderline();
  initTimeline();
  initHeroAnimations();
  initCounters();
  initGalleryFilter();
  initLightbox();
  initMenuTabs();
  initFormValidation('reservation-form');
  initFormValidation('contact-form');
});
