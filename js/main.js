document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // Fetch site data
  fetch('data/site.json')
    .then(res => res.json())
    .then(data => {
      renderBenefits(data.benefits);
      renderTestimonials(data.testimonials);
      if (typeof lucide !== 'undefined') lucide.createIcons();
    })
    .catch(err => console.error('Error loading data:', err));

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', () => {
      const willOpen = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuToggle.setAttribute('aria-expanded', String(willOpen));
      menuToggle.querySelector('.menu-icon')?.classList.toggle('hidden');
      menuToggle.querySelector('.close-icon')?.classList.toggle('hidden');
    });
  }

  // Close mobile menu on link click
  document.querySelectorAll('#mobile-menu a.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu?.classList.add('hidden');
      menuToggle?.setAttribute('aria-expanded', 'false');
      menuToggle?.querySelector('.menu-icon')?.classList.remove('hidden');
      menuToggle?.querySelector('.close-icon')?.classList.add('hidden');
    });
  });

  // Sticky nav shadow
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 0);
    });
  }

  // Smooth scroll for all anchor links (fallback for browsers not supporting scroll-behavior)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Highlight CTA when subscription section is visible
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const ctaButtons = document.querySelectorAll('a[href="#suscripcion"], button#mc-submit');
      ctaButtons.forEach(btn => {
        if (entry.isIntersecting) {
          btn.classList.add('cta-highlight');
        } else {
          btn.classList.remove('cta-highlight');
        }
      });
    });
  }, { threshold: 0.3 });

  const subscriptionSection = document.getElementById('suscripcion');
  if (subscriptionSection) observer.observe(subscriptionSection);

  // Active nav link based on scroll position
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  });

  // Mailchimp integration
  const form = document.getElementById('mc-form');
  const emailInput = document.getElementById('mc-email');
  const messageDiv = document.getElementById('mc-message');
  const submitBtn = document.getElementById('mc-submit');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = emailInput ? emailInput.value.trim() : '';
      
      // Basic validation
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showMessage('Por favor ingresa un correo electrónico válido.', 'error');
        return;
      }

      // Simulated Mailchimp subscription (replace with real endpoint or JSONP)
      // For demonstration, show success after 1.5s
      showMessage('Procesando suscripción...', 'loading');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      // Actual Mailchimp JSONP call would look like:
      // const endpoint = 'https://USERNAME.usXX.list-manage.com/subscribe/post-json?u=USER_ID&id=LIST_ID&EMAIL=' + encodeURIComponent(email);
      // Then use JSONP with callback.
      
      // Simulated response
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Suscribirme';
        showMessage('¡Gracias por suscribirte! Revisa tu correo para confirmar.', 'success');
        emailInput.value = '';
      }, 1500);
    });
  }

  function showMessage(msg, type) {
    if (!messageDiv) return;
    messageDiv.textContent = msg;
    messageDiv.className = 'mt-4 text-sm';
    if (type === 'success') messageDiv.classList.add('mc-success');
    else if (type === 'error') messageDiv.classList.add('mc-error');
    else if (type === 'loading') messageDiv.classList.add('mc-loading');
  }

  // Render benefits from data
  function renderBenefits(benefits) {
    const grid = document.getElementById('benefits-grid');
    if (!grid || !benefits) return;
    grid.innerHTML = benefits.map(b => `
      <div class="benefit-card text-center">
        <div class="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
          <i data-lucide="${b.icon}" class="w-6 h-6 text-primary"></i>
        </div>
        <h3 class="font-semibold text-lg mb-2">${b.label}</h3>
        <p class="text-sm text-muted">${getDescriptionFor(b.icon)}</p>
      </div>
    `).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function getDescriptionFor(icon) {
    const map = {
      'sparkles': 'Acceso anticipado a nuevas funciones y tendencias.',
      'shield-check': 'Datos seguros y prácticas de privacidad de primer nivel.',
      'users': 'Conecta con una red de profesionales apasionados.',
      'mail': 'Newsletter semanal con contenido curado solo para suscriptores.',
      'chart-line': 'Herramientas y métricas para medir tu crecimiento.',
      'message-circle': 'Soporte personalizado para resolver tus dudas.'
    };
    return map[icon] || 'Descripción del beneficio.';
  }

  // Render testimonials
  function renderTestimonials(testimonials) {
    const grid = document.getElementById('testimonials-grid');
    if (!grid || !testimonials) return;
    grid.innerHTML = testimonials.map(t => `
      <div class="testimonial-card text-center">
        <div class="text-4xl mb-4">
          <i data-lucide="message-circle" class="w-8 h-8 mx-auto text-primary/40"></i>
        </div>
        <blockquote class="text-lg italic mb-4">"${t.quote}"</blockquote>
        <div class="font-semibold">${t.name}</div>
        <div class="text-sm text-muted">${t.role}</div>
      </div>
    `).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }
});