declare const Typed: any;

// Wait for DOM
document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Typed.js Initialization
  const typedElement = document.querySelector('.typed-text');
  if (typedElement) {
    new Typed('.typed-text', {
      strings: ['Software Developer', 'Full-Stack Engineer', 'Problem Solver'],
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
      const sectionTop = (section as HTMLElement).offsetTop;
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
    // Animate hamburger to X
    hamburger.classList.toggle('toggle');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinksContainer?.classList.remove('active');
      hamburger?.classList.remove('toggle');
    });
  });
});
