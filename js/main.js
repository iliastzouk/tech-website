document.addEventListener('DOMContentLoaded', () => {

  /* ===== DARK / LIGHT MODE TOGGLE ===== */
  const darkToggle = document.getElementById('darkToggle');
  const savedMode = localStorage.getItem('colorMode');

  if (savedMode === 'light') {
    document.body.classList.add('light-mode');
    if (darkToggle) darkToggle.textContent = '☀️';
  }

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      darkToggle.textContent = isLight ? '☀️' : '🌙';
      localStorage.setItem('colorMode', isLight ? 'light' : 'dark');
    });
  }

  /* ===== HAMBURGER MENU ===== */
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('nav-open');
    });

    // Mobile dropdowns on click
    const dropdowns = navMenu.querySelectorAll('.dropdown > a');
    dropdowns.forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const parent = link.parentElement;
          parent.classList.toggle('open');
        }
      });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
        navMenu.classList.remove('nav-open');
      }
    });
  }

  /* ===== SCROLL TO TOP ===== */
  const scrollTopBtn = document.getElementById('scrollTop');

  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ===== CAROUSEL ===== */
  const carouselContainer = document.querySelector('.carousel-container');

  if (carouselContainer) {
    const track = carouselContainer.querySelector('.carousel-track');
    const slides = carouselContainer.querySelectorAll('.slide');
    const prevBtn = carouselContainer.querySelector('.carousel-btn.prev');
    const nextBtn = carouselContainer.querySelector('.carousel-btn.next');
    const indicators = carouselContainer.querySelectorAll('.indicator');

    let current = 0;
    let autoPlayTimer = null;

    function goToSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;
      current = index;
      if (track) track.style.transform = `translateX(-${current * 100}%)`;
      indicators.forEach((dot, i) => {
        dot.classList.toggle('active', i === current);
      });
    }

    function startAutoPlay() {
      autoPlayTimer = setInterval(() => goToSlide(current + 1), 4000);
    }

    function stopAutoPlay() {
      clearInterval(autoPlayTimer);
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(current - 1); startAutoPlay(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { stopAutoPlay(); goToSlide(current + 1); startAutoPlay(); });

    indicators.forEach((dot, i) => {
      dot.addEventListener('click', () => { stopAutoPlay(); goToSlide(i); startAutoPlay(); });
    });

    // Touch support
    let touchStartX = 0;
    let touchEndX = 0;

    carouselContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    carouselContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        stopAutoPlay();
        goToSlide(diff > 0 ? current + 1 : current - 1);
        startAutoPlay();
      }
    }, { passive: true });

    goToSlide(0);
    startAutoPlay();
  }

  /* ===== ACCORDION ===== */
  const accordionItems = document.querySelectorAll('.accordion-item');

  if (accordionItems.length > 0) {
    accordionItems.forEach(item => {
      const header = item.querySelector('.accordion-header');
      if (header) {
        header.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');
          // Close all
          accordionItems.forEach(i => i.classList.remove('open'));
          // Toggle current
          if (!isOpen) item.classList.add('open');
        });
      }
    });
  }

  /* ===== CONTACT FORM VALIDATION ===== */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    const contactMsg = document.getElementById('contactMsg');

    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('contactName').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      const subject = document.getElementById('contactSubject').value.trim();
      const message = document.getElementById('contactMessage').value.trim();

      if (!name || !email || !subject || !message) {
        showMsg(contactMsg, 'error', '❌ Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.');
        return;
      }

      if (!isValidEmail(email)) {
        showMsg(contactMsg, 'error', '❌ Παρακαλώ εισάγετε ένα έγκυρο email.');
        return;
      }

      showMsg(contactMsg, 'success', '✅ Το μήνυμά σας στάλθηκε επιτυχώς! Θα επικοινωνήσουμε μαζί σας σύντομα.');
      contactForm.reset();
    });
  }

  /* ===== REVIEW FORM VALIDATION ===== */
  const reviewForm = document.getElementById('reviewForm');

  if (reviewForm) {
    const reviewMsg = document.getElementById('reviewMsg');

    reviewForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('reviewName').value.trim();
      const email = document.getElementById('reviewEmail').value.trim();
      const rating = document.getElementById('ratingValue').value;
      const comment = document.getElementById('reviewComment').value.trim();

      if (!name || !email || !comment) {
        showMsg(reviewMsg, 'error', '❌ Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.');
        return;
      }

      if (!isValidEmail(email)) {
        showMsg(reviewMsg, 'error', '❌ Παρακαλώ εισάγετε ένα έγκυρο email.');
        return;
      }

      if (!rating || rating === '0') {
        showMsg(reviewMsg, 'error', '❌ Παρακαλώ επιλέξτε αξιολόγηση (αστέρια).');
        return;
      }

      showMsg(reviewMsg, 'success', `✅ Η αξιολόγησή σας (${rating} ⭐) υποβλήθηκε επιτυχώς! Ευχαριστούμε!`);
      reviewForm.reset();
      resetStars();
    });
  }

  /* ===== STAR RATING WIDGET ===== */
  const stars = document.querySelectorAll('.star');
  const ratingInput = document.getElementById('ratingValue');

  if (stars.length > 0 && ratingInput) {
    stars.forEach((star, index) => {
      star.addEventListener('click', () => {
        ratingInput.value = index + 1;
        stars.forEach((s, i) => {
          s.classList.toggle('active', i <= index);
        });
      });

      star.addEventListener('mouseenter', () => {
        stars.forEach((s, i) => {
          s.style.color = i <= index ? '#ffc107' : '';
        });
      });

      star.addEventListener('mouseleave', () => {
        const current = parseInt(ratingInput.value) || 0;
        stars.forEach((s, i) => {
          s.style.color = '';
          s.classList.toggle('active', i < current);
        });
      });
    });
  }

  function resetStars() {
    if (stars.length > 0 && ratingInput) {
      ratingInput.value = '0';
      stars.forEach(s => {
        s.classList.remove('active');
        s.style.color = '';
      });
    }
  }

  /* ===== HELPERS ===== */
  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showMsg(el, type, text) {
    if (!el) return;
    el.textContent = text;
    el.className = `form-msg ${type}`;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    setTimeout(() => {
      el.className = 'form-msg';
      el.textContent = '';
    }, 6000);
  }

});
