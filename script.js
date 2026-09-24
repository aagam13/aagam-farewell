// ===== CARD FLIP =====
function flipCard(cardEl) {
  cardEl.style.transform = ''; // clear any inline tilt transform first
  cardEl.classList.toggle('flipped');
}

// ===== SCROLL REVEAL FOR CARDS =====
function revealCards() {
  const cards = document.querySelectorAll('.card-wrapper');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach((card, i) => {
    card.dataset.delay = i * 120;
    observer.observe(card);
  });
}

// ===== PARTICLE SYSTEM =====
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  const PARTICLE_COUNT = 90;
  const particles = [];

  const colors = [
    'rgba(245,200,66,',    // gold
    'rgba(124,58,237,',    // purple
    'rgba(168,85,247,',    // purple-light
    'rgba(236,72,153,',    // pink
    'rgba(6,182,212,',     // cyan
    'rgba(255,255,255,',   // white
  ];

  function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      color: randomColor(),
      alpha: Math.random() * 0.6 + 0.1,
      dx: (Math.random() - 0.5) * 0.35,
      dy: (Math.random() - 0.5) * 0.35,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    });
  }

  // Shooting stars
  const stars = [];
  function spawnStar() {
    stars.push({
      x: Math.random() * W,
      y: Math.random() * (H * 0.6),
      len: Math.random() * 80 + 40,
      speed: Math.random() * 6 + 4,
      alpha: 1,
      angle: Math.PI / 4,
    });
  }

  setInterval(spawnStar, 3000);

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Draw particles
    particles.forEach(p => {
      p.pulse += p.pulseSpeed;
      const a = p.alpha * (0.7 + 0.3 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + a + ')';
      ctx.fill();

      // Glow for bigger particles
      if (p.r > 1.5) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color + (a * 0.15) + ')';
        ctx.fill();
      }

      p.x += p.dx;
      p.y += p.dy;

      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;
    });

    // Draw shooting stars
    for (let i = stars.length - 1; i >= 0; i--) {
      const s = stars[i];
      ctx.beginPath();
      const gradient = ctx.createLinearGradient(
        s.x, s.y,
        s.x - Math.cos(s.angle) * s.len,
        s.y - Math.sin(s.angle) * s.len
      );
      gradient.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = gradient;
      ctx.lineWidth = 1.5;
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(s.angle) * s.len, s.y - Math.sin(s.angle) * s.len);
      ctx.stroke();

      s.x += Math.cos(s.angle) * s.speed;
      s.y += Math.sin(s.angle) * s.speed;
      s.alpha -= 0.015;

      if (s.alpha <= 0) stars.splice(i, 1);
    }

    requestAnimationFrame(draw);
  }

  draw();
}

// ===== TILT EFFECT ON CARDS =====
function initTilt() {
  const wrappers = document.querySelectorAll('.card-wrapper');
  wrappers.forEach(wrapper => {
    const card = wrapper.querySelector('.card');

    wrapper.addEventListener('mousemove', (e) => {
      if (card.classList.contains('flipped')) return;
      const rect = wrapper.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `rotateY(${dx * 10}deg) rotateX(${-dy * 8}deg) scale(1.03)`;
    });

    wrapper.addEventListener('mouseleave', () => {
      // Always clear inline style so flip class works correctly
      card.style.transform = '';
    });
  });
}

// ===== CONFETTI ON OPEN =====
function burstConfetti(x, y) {
  const colors = ['#f5c842', '#7c3aed', '#ec4899', '#06b6d4', '#fff', '#a855f7'];
  const container = document.body;
  for (let i = 0; i < 18; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position: fixed;
      left: ${x}px;
      top: ${y}px;
      width: ${Math.random() * 8 + 4}px;
      height: ${Math.random() * 8 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 9999;
      opacity: 1;
      transform: translate(0,0) rotate(0deg);
      transition: transform 1s ease-out, opacity 1s ease-out;
    `;
    container.appendChild(dot);
    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * 120 + 40;
    setTimeout(() => {
      dot.style.transform = `translate(${Math.cos(angle)*dist}px, ${Math.sin(angle)*dist - 60}px) rotate(${Math.random()*360}deg)`;
      dot.style.opacity = '0';
    }, 10);
    setTimeout(() => dot.remove(), 1100);
  }
}

// Patch flipCard to also fire confetti
const _origFlip = flipCard;
window.flipCard = function(cardEl) {
  const wasFlipped = cardEl.classList.contains('flipped');
  _origFlip(cardEl);
  if (!wasFlipped) {
    const rect = cardEl.getBoundingClientRect();
    burstConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
};

// ===== SORT =====
let sortAsc = true;

function toggleSort() {
  sortAsc = !sortAsc;

  const btn = document.getElementById('sortBtn');
  const label = document.getElementById('sortLabel');
  const grid = document.getElementById('cardsGrid');
  const cards = Array.from(grid.querySelectorAll('.card-wrapper'));

  // Sort by data-name alphabetically
  cards.sort((a, b) => {
    const nameA = (a.dataset.name || '').toLowerCase();
    const nameB = (b.dataset.name || '').toLowerCase();
    return sortAsc
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  // Fade out, reorder, fade in
  grid.style.opacity = '0';
  grid.style.transition = 'opacity 0.2s ease';

  setTimeout(() => {
    cards.forEach(card => grid.appendChild(card));
    grid.style.opacity = '1';
  }, 200);

  // Update button state
  btn.classList.toggle('desc', !sortAsc);
  label.textContent = sortAsc ? 'A–Z' : 'Z–A';
}


// ===== SEARCH =====
function initSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  const noResults = document.getElementById('noResults');
  const cards = document.querySelectorAll('.card-wrapper');

  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    let visibleCount = 0;

    cards.forEach(card => {
      const name = (card.dataset.name || '').toLowerCase();
      const matches = name.includes(query);
      card.style.display = matches ? '' : 'none';
      if (matches) visibleCount++;
    });

    clearBtn.classList.toggle('visible', query.length > 0);
    noResults.classList.toggle('visible', visibleCount === 0 && query.length > 0);
  });
}

function clearSearch() {
  const input = document.getElementById('searchInput');
  const clearBtn = document.getElementById('searchClear');
  const noResults = document.getElementById('noResults');
  const cards = document.querySelectorAll('.card-wrapper');

  input.value = '';
  cards.forEach(card => card.style.display = '');
  clearBtn.classList.remove('visible');
  noResults.classList.remove('visible');
  input.focus();
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initParticles();
  revealCards();
  initTilt();
  initSearch();
});
