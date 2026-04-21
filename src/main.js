// =============================================
// PARTICLE SYSTEM
// =============================================
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.cssText = [
    'position:fixed',
    'top:0',
    'left:0',
    'width:100%',
    'height:100%',
    'z-index:0',
    'pointer-events:none'
  ].join(';');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H, particles, mouse;

  const CONFIG = {
    count: 90,
    maxDist: 130,
    speed: 0.45,
    radius: { min: 1, max: 2.8 },
    repelRadius: 100,
    repelForce: 3.5,
    colors: [
      'rgba(139,0,0,',
      'rgba(178,34,34,',
      'rgba(200,60,60,',
      'rgba(220,100,100,',
      'rgba(255,180,180,'
    ]
  };

  function resize() {
    W = canvas.width  = document.body.clientWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * CONFIG.speed * 2;
    this.vy = (Math.random() - 0.5) * CONFIG.speed * 2;
    this.r  = CONFIG.radius.min + Math.random() * (CONFIG.radius.max - CONFIG.radius.min);
    this.color = CONFIG.colors[Math.floor(Math.random() * CONFIG.colors.length)];
    this.baseOpacity = 0.5 + Math.random() * 0.5;
  }

  Particle.prototype.update = function () {
    // Mouse repulsion
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < CONFIG.repelRadius && dist > 0) {
      const force = (CONFIG.repelRadius - dist) / CONFIG.repelRadius;
      this.x += (dx / dist) * force * CONFIG.repelForce;
      this.y += (dy / dist) * force * CONFIG.repelForce;
    }

    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;

    this.x = Math.max(0, Math.min(W, this.x));
    this.y = Math.max(0, Math.min(H, this.y));
  };

  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color + this.baseOpacity + ')';
    ctx.shadowColor = this.color + '0.8)';
    ctx.shadowBlur = 6;
    ctx.fill();
    ctx.shadowBlur = 0;
  };

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.maxDist) {
          const opacity = (1 - dist / CONFIG.maxDist) * 0.35;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139,0,0,${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  function init() {
    resize();
    mouse = { x: -9999, y: -9999 };
    particles = Array.from({ length: CONFIG.count }, () => new Particle());
    animate();
  }

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  // 1. Typed.js Initialization
  const typedElement = document.querySelector('.typed-text');
  if (typedElement && window.Typed) {
    window.typedInstance = new window.Typed('.typed-text', {
      strings: ['Pentester', 'Etical Hacker', 'Analytical', 'Problem Solver'],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
    });
  }

  // 2. Sticky Navbar & Active Link
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-links li a');

  window.addEventListener('scroll', () => {
    // Sticky Nav
    if (window.scrollY > 50) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active Link
    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.scrollY >= sectionTop - 200) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // 3. Scroll Animations (Intersection Observer)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up, .fade-in').forEach(element => {
    observer.observe(element);
  });

  // 4. Mobile Menu Toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links');

  hamburger?.addEventListener('click', () => {
    navLinksContainer?.classList.toggle('active');
    hamburger.classList.toggle('toggle');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer?.classList.remove('active');
      hamburger?.classList.remove('toggle');
    });
  });

  // 5. Certificate Modal & Image Protection Logic
  const modal = document.getElementById("cert-modal");
  const modalImg = document.getElementById("modal-img");
  const captionText = document.getElementById("modal-caption");
  const closeBtn = document.querySelector(".close-modal");

  document.querySelectorAll('.cert-card img').forEach(img => {
    // Prevent right-click and dragging
    img.addEventListener('contextmenu', e => e.preventDefault());
    img.setAttribute('draggable', 'false');

    // Open modal on click
    img.addEventListener('click', function() {
      modal.style.display = "flex";
      modalImg.src = this.src;
      captionText.innerHTML = this.alt;
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = "none";
    });
  }

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // 6. Web Audio API Music Player (Bypass IDM/Downloaders)
  const musicBtn = document.getElementById("music-btn");
  const musicText = document.getElementById("music-text");
  const musicIcon = document.getElementById("music-icon");

  if (musicBtn) {
    let audioCtx = null;
    let audioBuffer = null;
    let sourceNode = null;
    let isPlaying = false;
    let isLoading = false;

    musicBtn.addEventListener("click", async () => {
      if (isLoading) return;

      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }

      if (isPlaying) {
        // Stop music
        if (sourceNode) {
          sourceNode.stop();
          sourceNode.disconnect();
        }
        isPlaying = false;
        musicText.textContent = "Play";
        musicIcon.innerHTML = '<polygon points="6 3 20 12 6 21 6 3"/>';
      } else {
        // Play music
        try {
          isLoading = true;
          musicText.textContent = "Loading...";

          if (!audioBuffer) {
            const response = await fetch('./src/music.mp3');
            const arrayBuffer = await response.arrayBuffer();
            audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
          }

          sourceNode = audioCtx.createBufferSource();
          sourceNode.buffer = audioBuffer;
          sourceNode.loop = true;

          const gainNode = audioCtx.createGain();
          gainNode.gain.value = 0.5; // 50% Volume

          sourceNode.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          
          sourceNode.start(0);
          isPlaying = true;
          musicText.textContent = "Stop";
          musicIcon.innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
        } catch (err) {
          console.error("Failed to play audio:", err);
          musicText.textContent = "Error";
        } finally {
          isLoading = false;
        }
      }
    });
  }
});
