// ── PASSWORD ──────────────────────────────────────
// IMPORTANT: this is a SOFT gate. The page HTML is still in the source.
// For real privacy, use a host-level password (e.g. Netlify, Cloudflare Access).
//
// To update the password:
// 1. Open browser console (F12 → Console)
// 2. Run: crypto.subtle.digest('SHA-256', new TextEncoder().encode('yournewpassword'))
//         .then(buf => console.log(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')))
// 3. Replace SITE_HASH below with the result
const SITE_HASH = 'a8699e7d7a9f8ee8d37e4177f5dc9775771c4966fc1ad1da171815f7472cfa5d';
// ──────────────────────────────────────────────────

const SESSION_KEY = 'orl_auth';

async function checkPassword() {
  const input = document.getElementById('pw-input');
  const error = document.getElementById('pw-error');
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(input.value));
  const hash = Array.from(new Uint8Array(buf))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  if (hash === SITE_HASH) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    document.getElementById('pw-overlay').classList.add('hidden');
    error.textContent = '';
    document.body.focus?.();
  } else {
    error.textContent = 'Incorrect password. Try again.';
    input.value = '';
    input.focus();
  }
}

// ── IMAGE FALLBACKS ───────────────────────────────
// For any <img data-fallback="🏜">, swap it for a styled emoji span when
// the src is missing or fails to load. Keeps the HTML clean.
function setupImageFallbacks() {
  document.querySelectorAll('img[data-fallback]').forEach(img => {
    let handled = false;
    const useFallback = () => {
      if (handled) return;
      handled = true;
      const span = document.createElement('span');
      span.className = 'fallback-emoji';
      span.setAttribute('aria-hidden', 'true');
      span.textContent = img.dataset.fallback;
      img.replaceWith(span);
    };
    const src = (img.getAttribute('src') || '').trim();
    if (!src) { useFallback(); return; }
    img.addEventListener('error', useFallback);
    // If the image already finished loading and had no pixels, fallback now.
    if (img.complete && img.naturalWidth === 0) useFallback();
  });
}

// ── PASSWORD OVERLAY ──────────────────────────────
function setupPasswordOverlay() {
  const overlay = document.getElementById('pw-overlay');
  const input = document.getElementById('pw-input');
  const button = document.getElementById('pw-btn');

  button.addEventListener('click', checkPassword);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPassword();
  });

  // Focus trap: while the overlay is visible, keep Tab inside it.
  overlay.addEventListener('keydown', (e) => {
    if (overlay.classList.contains('hidden')) return;
    if (e.key !== 'Tab') return;
    const focusable = [input, button];
    const i = focusable.indexOf(document.activeElement);
    if (e.shiftKey) {
      if (i <= 0) { e.preventDefault(); focusable[focusable.length - 1].focus(); }
    } else {
      if (i === focusable.length - 1) { e.preventDefault(); focusable[0].focus(); }
    }
  });

  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    overlay.classList.add('hidden');
  } else {
    // Land focus on the input so users can just start typing.
    input.focus();
  }
}

// ── SCROLL ANIMATIONS ─────────────────────────────
// Stagger by sibling index so the cascade is consistent regardless of
// which order the IntersectionObserver happens to fire entries in.
function setupFadeUp() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement.children)
        .filter(c => c.classList.contains('fade-up'));
      const idx = Math.max(0, siblings.indexOf(el));
      setTimeout(() => el.classList.add('visible'), idx * 80);
      observer.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
}

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupImageFallbacks();
  setupPasswordOverlay();
  setupFadeUp();
});
