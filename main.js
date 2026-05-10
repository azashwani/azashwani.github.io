// ── PASSWORD ──────────────────────────────────────
// To update the password:
// 1. Open browser console (F12 → Console)
// 2. Run: crypto.subtle.digest('SHA-256', new TextEncoder().encode('yournewpassword'))
//         .then(buf => console.log(Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2,'0')).join('')))
// 3. Replace SITE_HASH below with the result
const SITE_HASH = 'a8699e7d7a9f8ee8d37e4177f5dc9775771c4966fc1ad1da171815f7472cfa5d';
// ──────────────────────────────────────────────────

const SESSION_KEY = 'orl_auth';

function checkPassword() {
  const input = document.getElementById('pw-input').value;
  const error = document.getElementById('pw-error');
  const encoder = new TextEncoder();
  crypto.subtle.digest('SHA-256', encoder.encode(input)).then(buf => {
    const hash = Array.from(new Uint8Array(buf))
      .map(b => b.toString(16).padStart(2, '0')).join('');
    if (hash === SITE_HASH) {
      sessionStorage.setItem(SESSION_KEY, 'true');
      document.getElementById('pw-overlay').classList.add('hidden');
      error.textContent = '';
    } else {
      error.textContent = 'Incorrect password. Try again.';
      document.getElementById('pw-input').value = '';
      document.getElementById('pw-input').focus();
    }
  });
}

// ── SCROLL ANIMATIONS ─────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// ── INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {

  // Password: allow Enter key
  document.getElementById('pw-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') checkPassword();
  });

  // Stay unlocked within the same browser session
  if (sessionStorage.getItem(SESSION_KEY) === 'true') {
    document.getElementById('pw-overlay').classList.add('hidden');
  }

  // Observe all fade-up elements
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

});
