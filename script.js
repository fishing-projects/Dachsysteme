/* ============================================
   ENTWURF 2 – JavaScript
   Tabs, Scroll Animations, Counter, Navigation
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Hero Popup ----
  const heroPopup = document.getElementById('hero-popup');
  const heroPopupClose = document.getElementById('hero-popup-close');
  const heroPopupBackdrop = document.getElementById('hero-popup-backdrop');

  if (heroPopup && heroPopupClose && heroPopupBackdrop) {
    document.body.classList.add('hero-popup-open');

    const closeHeroPopup = () => {
      heroPopup.classList.add('hero-popup--hidden');
      document.body.classList.remove('hero-popup-open');
    };

    heroPopupClose.addEventListener('click', closeHeroPopup);
    heroPopupBackdrop.addEventListener('click', closeHeroPopup);
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeHeroPopup();
    });
  }

  // ---- Intersection Observer ----
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  };

  const animateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        animateObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-in').forEach(el => {
    animateObserver.observe(el);
  });

  // ---- Counter Animation ----
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2200;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(target * eased);
          counter.textContent = current.toLocaleString('de-DE');

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          }
        }
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-target]').forEach(el => {
    counterObserver.observe(el);
  });

  // ---- Product Tabs ----
  const tabs = document.querySelectorAll('.product-tab');
  const contents = document.querySelectorAll('.product-tabs__content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Remove active from all
      tabs.forEach(t => t.classList.remove('active'));
      contents.forEach(c => c.classList.remove('active'));

      // Set active
      tab.classList.add('active');
      const targetContent = document.getElementById(`tab-${target}`);
      if (targetContent) {
        targetContent.classList.add('active');

        // Re-trigger animations for newly visible cards
        targetContent.querySelectorAll('.animate-in').forEach(el => {
          el.classList.remove('visible');
          void el.offsetWidth; // Force reflow
          animateObserver.observe(el);
        });
      }
    });
  });

  // ---- Navigation Scroll ----
  const nav = document.getElementById('main-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });

  // ---- Mobile Menu ----
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    mobileMenu.querySelectorAll('.nav__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

  // ---- Smooth Scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = nav.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ---- Active Nav on Scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('nav__link--active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('nav__link--active');
      }
    });
  }, { passive: true });

});
