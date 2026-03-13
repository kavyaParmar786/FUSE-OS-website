/* FUSE OS v2 — script.js */
'use strict';

/* ── Nav ───────────────────────────────────── */
const nav    = document.querySelector('.nav');
const burger = document.getElementById('burger');
const links  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav?.classList.toggle('solid', window.scrollY > 20);
}, { passive: true });

burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  links?.classList.toggle('open');
});

// close menu on link click
document.querySelectorAll('.nav-link').forEach(l => {
  l.addEventListener('click', () => {
    burger?.classList.remove('open');
    links?.classList.remove('open');
  });
});

// active nav link
const page = location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(l => {
  if (l.getAttribute('href') === page || (page === '' && l.getAttribute('href') === 'index.html')) {
    l.classList.add('active');
  }
});

/* ── Scroll reveal ─────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  revealEls.forEach(el => io.observe(el));
}

/* ── Counter animation ─────────────────────── */
function animCount(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const dur    = 1800;
  const start  = performance.now();
  const ease   = t => 1 - Math.pow(1 - t, 3);
  const tick   = now => {
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(ease(p) * target).toLocaleString() + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const counterIo = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animCount(e.target); counterIo.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterIo.observe(el));

/* ── Feature tabs ──────────────────────────── */
const tabs  = document.querySelectorAll('.feat-tab');
const cards = document.querySelectorAll('.feat-card[data-cat]');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const cat = tab.dataset.cat;
    cards.forEach(c => {
      c.style.display = (cat === 'all' || c.dataset.cat === cat) ? '' : 'none';
    });
  });
});

/* ── Command search + filter ───────────────── */
const cmdSearch = document.getElementById('cmd-search');
const cmdCats   = document.querySelectorAll('.cmd-cat');
const cmdGroups = document.querySelectorAll('.cmd-group');

function filterCmds() {
  const q   = cmdSearch?.value.toLowerCase() || '';
  const cat = document.querySelector('.cmd-cat.active')?.dataset.cat || 'all';
  cmdGroups.forEach(g => {
    let show = false;
    g.querySelectorAll('tr[data-cat]').forEach(row => {
      const name = row.querySelector('.cmd-name')?.textContent.toLowerCase() || '';
      const desc = row.querySelector('.cmd-desc')?.textContent.toLowerCase() || '';
      const ok = (cat === 'all' || row.dataset.cat === cat) && (!q || name.includes(q) || desc.includes(q));
      row.style.display = ok ? '' : 'none';
      if (ok) show = true;
    });
    g.style.display = show ? '' : 'none';
  });
}
cmdSearch?.addEventListener('input', filterCmds);
cmdCats.forEach(btn => {
  btn.addEventListener('click', () => {
    cmdCats.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filterCmds();
  });
});

/* ── FAQ accordion ─────────────────────────── */
document.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q')?.addEventListener('click', () => {
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

/* ── Verify flow ───────────────────────────── */
const verifyBtn = document.getElementById('verify-btn');
const statusEl  = document.getElementById('verify-status');
let step = 0;

document.getElementById('discord-btn')?.addEventListener('click', () => {
  step = 1;
  document.getElementById('step-1')?.classList.add('done');
  showStatus('info', '✓ Discord connected. Now subscribe to the YouTube channel.');
});

document.getElementById('yt-btn')?.addEventListener('click', () => {
  if (step < 1) { showStatus('error', 'Please connect Discord first.'); return; }
  step = 2;
  document.getElementById('step-2')?.classList.add('done');
  window.open('https://youtube.com/@FuseOS', '_blank');
  showStatus('info', '✓ Opened YouTube. After subscribing, click Verify.');
});

verifyBtn?.addEventListener('click', async () => {
  if (step < 2) { showStatus('error', 'Please complete the steps above first.'); return; }
  verifyBtn.disabled = true;
  verifyBtn.textContent = 'Verifying…';
  await new Promise(r => setTimeout(r, 1800));
  verifyBtn.disabled = false;
  verifyBtn.textContent = 'Verify Subscription';
  showStatus('success', '🎉 Verified! The Content Fan role has been granted to your account.');
  document.getElementById('step-3')?.classList.add('done');
});

function showStatus(type, msg) {
  if (!statusEl) return;
  statusEl.className = 'verify-status visible';
  if (type === 'success') statusEl.classList.add('success');
  else if (type === 'error') statusEl.classList.add('error');
  statusEl.textContent = msg;
}

/* ── Subtle ambient mouse glow ─────────────── */
if (!window.matchMedia('(pointer:coarse)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `position:fixed;pointer-events:none;z-index:0;
    width:400px;height:400px;border-radius:50%;
    background:radial-gradient(circle,rgba(94,234,212,0.04) 0%,transparent 70%);
    transform:translate(-50%,-50%);transition:left 0.8s ease,top 0.8s ease;`;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  }, { passive: true });
}
