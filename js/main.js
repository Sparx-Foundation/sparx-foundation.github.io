(function () {
  "use strict";

  // ── Nav scroll state ──────────────────────────
  const nav = document.getElementById("nav");
  let lastScroll = 0;

  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      nav.classList.toggle("scrolled", y > 20);
      lastScroll = y;
    },
    { passive: true },
  );

  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    });
  });

  const revealEls = document.querySelectorAll(".reveal, .reveal-up");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  document.querySelectorAll(".hero .reveal").forEach((el) => {
    setTimeout(() => el.classList.add("visible"), 100);
  });

  function animateCounter(el, target, duration = 1600) {
    const start = performance.now();
    const startVal = 0;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = Math.round(startVal + (target - startVal) * eased);
      el.textContent = current;
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  const statNums = document.querySelectorAll(".stat__num");
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !statsAnimated) {
        statsAnimated = true;
        statNums.forEach((el) => {
          const target = parseInt(el.getAttribute("data-target"), 10);
          animateCounter(el, target);
        });
      }
    },
    { threshold: 0.5 },
  );

  const statBar = document.querySelector(".hero__stat-bar");
  if (statBar) statsObserver.observe(statBar);

  const testimonials = document.querySelectorAll(".testimonial");
  const dots = document.querySelectorAll(".dot");
  let currentSlide = 0;
  let autoplayTimer;

  function goToSlide(index) {
    testimonials[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = index;
    testimonials[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % testimonials.length);
  }

  function startAutoplay() {
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    startAutoplay();
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goToSlide(i);
      resetAutoplay();
    });
  });

  startAutoplay();

  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn.textContent;
      btn.textContent = "✓ Message sent!";
      btn.style.background = "#2a6e4a";
      btn.disabled = true;
      form.reset();
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = "";
        btn.disabled = false;
      }, 4000);
    });
  }

  const orbs = document.querySelectorAll(".hero__orb");
  window.addEventListener(
    "mousemove",
    (e) => {
      if (window.innerWidth < 768) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx;
      const dy = (e.clientY - cy) / cy;

      orbs.forEach((orb, i) => {
        const strength = (i + 1) * 12;
        orb.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      });
    },
    { passive: true },
  );

  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll('.nav__links a[href^="#"]');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.style.color =
              link.getAttribute("href") === `#${id}` ? "var(--cream)" : "";
          });
        }
      });
    },
    { threshold: 0.4 },
  );

  sections.forEach((section) => sectionObserver.observe(section));
})();
