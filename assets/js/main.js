// Initialize modules and features
function initializeAll() {
    // Initialize basic features first
    initializeHeroSection();
    initializeMobileMenu();
    initializeStickyHeader();
    initCircleProgress();
    initParticles();
    initializeScrollIndicator();
    initializeParallaxEffect();

    // Load and initialize modules
    loadModules();
}

// Load all modules
function loadModules() {
    const modulePromises = [
        import('./modules/navigation.js').then(m => m.initNavigation()),
        import('./modules/animations.js').then(m => {
            m.initAnimations();
            m.initAchievements();
        }),
        import('./modules/forms.js').then(m => m.initForms()),
        import('./modules/testimonials.js').then(m => m.initTestimonials()),
        import('./modules/images.js').then(m => m.initImageHandling())
    ];

    Promise.all(modulePromises).catch(err => 
        console.warn('Some modules failed to load:', err)
    );
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeAll);

// Counter Animation
function animateCounter(element) {
    if (!element || !element.dataset.value) return;
    
    const target = parseInt(element.dataset.value);
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        if (current < target) {
            current += step;
            if (current > target) current = target;
            element.textContent = Math.floor(current).toLocaleString() + '+';
            requestAnimationFrame(updateCounter);
        }
    };

    updateCounter();
}

// Initialize circular progress animations
function initCircleProgress() {
    const circles = document.querySelectorAll('.progress-ring-circle');
    const values = [85, 95, 75]; // Percentage values for each circle
    
    circles.forEach((circle, index) => {
        if (!circle) return;
        
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        
        // Animate the circle
        setTimeout(() => {
            const offset = circumference - (values[index] / 100 * circumference);
            circle.style.strokeDashoffset = offset;
        }, 500);
    });
}

// Initialize particles.js if it exists
function initParticles() {
    if (typeof particlesJS !== 'undefined' && document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#ffffff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#ffffff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

// Initialize Hero Section
function initializeHeroSection() {
    // Initialize Typed.js if it exists
    const typedElement = document.querySelector('.typing-text');
    if (typedElement && typeof Typed !== 'undefined') {
        try {
            const strings = JSON.parse(typedElement.getAttribute('data-typed') || '[]');
            new Typed(typedElement, {
                strings,
                typeSpeed: 50,
                backSpeed: 30,
                backDelay: 2000,
                startDelay: 1000,
                loop: true,
                showCursor: true,
                cursorChar: '|'
            });
        } catch (error) {
            console.error('Typed.js initialization error:', error);
        }
    }

    // Initialize AOS if it exists
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Initialize Stats Counter
    const stats = document.querySelectorAll('.stat-number');
    stats.forEach(stat => {
        if (!stat) return;
        const targetValue = parseInt(stat.getAttribute('data-count') || '0');
        animateValue(stat, 0, targetValue, 2000);
    });

    initCircleProgress();
    initParticles();
    initializeScrollIndicator();
    initializeParallaxEffect();
}

// Helper function to animate number counting
function animateValue(obj, start, end, duration) {
    if (!obj) return;
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        obj.textContent = currentValue.toLocaleString();
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize scroll indicator
function initializeScrollIndicator() {
    const scrollIndicator = document.querySelector('.hero-scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const nextSection = document.querySelector('.about-section');
            if (nextSection) {
                nextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}

// Initialize parallax effect
function initializeParallaxEffect() {
    const shapes = document.querySelectorAll('.shape');
    if (shapes.length > 0) {
        document.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;

            shapes.forEach(shape => {
                if (!shape) return;
                const speed = parseFloat(shape.getAttribute('data-speed') || '0.1');
                const x = (window.innerWidth - e.pageX * speed) / 100;
                const y = (window.innerHeight - e.pageY * speed) / 100;
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });
        });
    }
}

// Initialize mobile menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('.main-nav') && !event.target.closest('.menu-toggle')) {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    }
}

// Initialize sticky header
function initializeStickyHeader() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            // Scrolling down
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            // Scrolling up
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Video Background Fallback
const video = document.querySelector('.hero-video');
if (video) {
  video.addEventListener('error', () => {
    video.style.display = 'none';
    video.parentElement.style.backgroundImage = 'url(assets/images/blur-hospital.jpg)';
    video.parentElement.style.backgroundSize = 'cover';
    video.parentElement.style.backgroundPosition = 'center';
  });
}

// Feature Card Hover Effects
const featureCards = document.querySelectorAll('.feature-card');
featureCards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.feature-hover').style.transform = 'translateY(0)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.querySelector('.feature-hover').style.transform = 'translateY(100%)';
  });
});

// Team member hover effects
document.querySelectorAll('.team-member-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.member-overlay').style.bottom = '0';
  });
  
  card.addEventListener('mouseleave', () => {
    card.querySelector('.member-overlay').style.bottom = '-100%';
  });
});

// Mission Vision hover animations
document.querySelectorAll('.mission-card, .vision-card, .values-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.querySelector('.card-icon i').style.transform = 'scale(1.2) rotate(360deg)';
  });
  
  card.addEventListener('mouseleave', () => {
    card.querySelector('.card-icon i').style.transform = 'none';
  });
});

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.2,
  rootMargin: '0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe elements with animation classes
document.querySelectorAll('.fade-in-up, .slide-in-left, .slide-in-right').forEach(el => {
  observer.observe(el);
});

// Team Section Specialty Filter
document.addEventListener('DOMContentLoaded', function() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const teamMembers = document.querySelectorAll('.team-member-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');

      const specialty = button.getAttribute('data-specialty');

      teamMembers.forEach(member => {
        if (specialty === 'all' || member.getAttribute('data-specialty') === specialty) {
          member.classList.remove('hidden');
          // Reset animation
          member.style.animation = 'none';
          member.offsetHeight; // Trigger reflow
          member.style.animation = null;
          member.classList.add('fade-in-up');
        } else {
          member.classList.add('hidden');
        }
      });
    });
  });

  // Image loading handling
  const doctorImages = document.querySelectorAll('.member-image-wrapper img');
  
  doctorImages.forEach(img => {
    img.parentElement.classList.add('loading');
    
    img.addEventListener('load', () => {
      img.parentElement.classList.remove('loading');
    });

    img.addEventListener('error', () => {
      img.parentElement.classList.remove('loading');
      img.parentElement.classList.add('error');
      img.src = 'assets/images/doctor-placeholder.jpg';
    });
  });

  // Smooth scroll for appointment links
  document.querySelectorAll('a[href="#appointment"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const appointmentSection = document.querySelector('#appointment');
      if (appointmentSection) {
        appointmentSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Lazy loading for team member images
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}); 