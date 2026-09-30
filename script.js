/**
 * PERSONAL PORTFOLIO WEBSITE - AMEEN MUHAMMED
 * Vanilla JavaScript logic:
 * - Scroll-driven profile image transition (About Me section)
 * - Mobile Navigation Menu Drawer
 * - Header Scroll States & Active Nav Link Highlighting
 * - Portfolio Category Filter
 * - Smooth Reveal on Scroll
 * - Interactive Contact Form
 */
document.addEventListener('DOMContentLoaded', () => {
  // Check reduced motion setting
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // ------------------------------------------------------------------------
  // 1. HEADER SCROLL STATE & ACTIVE LINK HIGHLIGHTER
  // ------------------------------------------------------------------------
  const header = document.getElementById('site-header');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function updateHeaderState() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }
  // Active section highlighting using IntersectionObserver
  const sectionObserverOptions = {
    root: null,
    rootMargin: '-30% 0px -40% 0px',
    threshold: 0
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, sectionObserverOptions);
  sections.forEach(section => sectionObserver.observe(section));
  window.addEventListener('scroll', updateHeaderState, { passive: true });
  updateHeaderState();
  // ------------------------------------------------------------------------
  // 2. MOBILE NAVIGATION DRAWER
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  function toggleMobileMenu() {
    const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
    mobileToggle.setAttribute('aria-expanded', !isExpanded);
    mobileToggle.classList.toggle('active');
    mainNav.classList.toggle('open');
  }
  function closeMobileMenu() {
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.classList.remove('active');
    mainNav.classList.remove('open');
  }
  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMobileMenu);
  }
  // Close mobile nav when clicking any nav link
  navLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  // ------------------------------------------------------------------------
  // 3. KEY REQUIREMENT: SCROLL-DRIVEN PROFILE IMAGE TRANSITION
  // ------------------------------------------------------------------------
  const aboutSection = document.getElementById('about');
  const profileImg = document.getElementById('scroll-profile-img');
  const avatarWrapper = document.getElementById('about-avatar-wrapper');
  let ticking = false;
  function handleProfileScrollTransition() {
    if (prefersReducedMotion || !aboutSection || !profileImg || !avatarWrapper) return;
    const rect = aboutSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Calculate progress when section enters viewport
    // start when top is at 80% viewport height, end when top reaches 25% viewport height
    const startPoint = windowHeight * 0.85;
    const endPoint = windowHeight * 0.25;
    let progress = (startPoint - rect.top) / (startPoint - endPoint);
    progress = Math.max(0, Math.min(1, progress));
    // Smooth physics-like interpolation (cubic ease-out)
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    // Subtle upward transition that visually settles image right above name
    const translateY = (1 - easeProgress) * 35; // 35px down -> 0px settled
    const scale = 0.92 + (easeProgress * 0.08); // 0.92 -> 1.0
    const shadowAlpha = 0.1 + (easeProgress * 0.15); // subtle shadow intensification
    profileImg.style.transform = `translate3d(0, ${translateY.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`;
    profileImg.style.boxShadow = `0 ${(10 * scale).toFixed(1)}px ${(25 * scale).toFixed(1)}px rgba(0, 0, 0, ${shadowAlpha.toFixed(2)})`;
    ticking = false;
  }
  function requestScrollUpdate() {
    if (!ticking) {
      requestAnimationFrame(handleProfileScrollTransition);
      ticking = true;
    }
  }
  if (aboutSection && profileImg) {
    window.addEventListener('scroll', requestScrollUpdate, { passive: true });
    window.addEventListener('resize', requestScrollUpdate, { passive: true });
    // Initial call
    requestScrollUpdate();
  }
  // ------------------------------------------------------------------------
  // 4. PORTFOLIO CATEGORY FILTER TABS
  // ------------------------------------------------------------------------
  const filterBtns = document.querySelectorAll('.tab-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active class on buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filterValue = btn.getAttribute('data-filter');
      portfolioCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0) scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px) scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
  // ------------------------------------------------------------------------
  // 5. SCROLL REVEAL ANIMATIONS FOR CARDS
  // ------------------------------------------------------------------------
  if (!prefersReducedMotion) {
    const revealElements = document.querySelectorAll('.service-card, .portfolio-card, .timeline-item, .highlight-item');
    
    revealElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(24px)';
      el.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1
    });
    revealElements.forEach(el => revealObserver.observe(el));
  }
  // ------------------------------------------------------------------------
  // 6. CONTACT FORM SUBMISSION HANDLER
  // ------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');
  const submitBtn = document.getElementById('submit-btn');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('user-name');
      const emailInput = document.getElementById('user-email');
      const messageInput = document.getElementById('user-message');
      // Basic Validation
      if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
        formFeedback.textContent = 'Please fill out all fields before submitting.';
        formFeedback.className = 'form-feedback error';
        return;
      }
      // UI state during send
      submitBtn.disabled = true;
      submitBtn.querySelector('span').textContent = 'Sending...';
      setTimeout(() => {
        formFeedback.textContent = 'Thank you! Your message has been sent successfully.';
        formFeedback.className = 'form-feedback success';
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.querySelector('span').textContent = 'Send Message';
        setTimeout(() => {
          formFeedback.textContent = '';
          formFeedback.className = 'form-feedback';
        }, 5000);
      }, 1000);
    });
  }
  // Set current copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
});
