// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAll();
});

function initializeAll() {
    initSmoothScrolling();
    initAnimations();
    initTestimonials();
    initHeaderScroll();
    initButtonEffects();
    initMobileMenu();
    initFormValidation();
    initParallaxEffects();
    initImageHandling();
}

// Enhanced smooth scrolling
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollBy({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Enhanced animations
function initAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('stats-counter')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(element => observer.observe(element));
}

// Enhanced testimonials
function initTestimonials() {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.testimonial-card');
    const dotsContainer = document.querySelector('.testimonial-dots');
    
    if (!slides.length) return;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.dot');

    function goToSlide(n) {
        slides[currentSlide].style.display = 'none';
        dots[currentSlide].classList.remove('active');
        
        currentSlide = (n + slides.length) % slides.length;
        
        slides[currentSlide].style.display = 'block';
        dots[currentSlide].classList.add('active');
    }

    // Initialize first slide
    goToSlide(0);

    // Auto-advance slides
    setInterval(() => goToSlide(currentSlide + 1), 5000);

    // Expose for button clicks
    window.plusTestimonials = (n) => goToSlide(currentSlide + n);
}

// Enhanced header scroll effect
function initHeaderScroll() {
    const header = document.querySelector('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    });
}

// Button effects
function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn, .animated-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            const x = e.clientX - button.getBoundingClientRect().left;
            const y = e.clientY - button.getBoundingClientRect().top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            button.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1000);
        });
    });
}

// Enhanced mobile menu
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });

        // Close menu on link click
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

// Enhanced form validation
function initFormValidation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const isValid = validateForm(form);
            
            if (isValid) {
                // Show success message
                showFormMessage(form, 'Success! Form submitted.', 'success');
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                }, 2000);
            }
        });

        // Real-time validation
        form.querySelectorAll('input, textarea').forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });
    });
}

function validateForm(form) {
    let isValid = true;
    form.querySelectorAll('input, textarea').forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    const isValid = value !== '';
    
    field.classList.toggle('error', !isValid);
    
    const errorMessage = field.nextElementSibling;
    if (!isValid && (!errorMessage || !errorMessage.classList.contains('error-message'))) {
        const message = document.createElement('span');
        message.classList.add('error-message');
        message.textContent = `${field.name || 'This field'} is required`;
        field.parentNode.insertBefore(message, field.nextSibling);
    } else if (isValid && errorMessage?.classList.contains('error-message')) {
        errorMessage.remove();
    }
    
    return isValid;
}

function showFormMessage(form, message, type) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('form-message', type);
    messageElement.textContent = message;
    
    form.appendChild(messageElement);
    
    setTimeout(() => messageElement.remove(), 3000);
}

// Parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
    });
}

// Counter animation
function animateCounter(counter) {
    const target = parseInt(counter.dataset.target);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
        current += step;
        if (current < target) {
            counter.textContent = Math.floor(current);
            requestAnimationFrame(update);
        } else {
            counter.textContent = target;
        }
    }

    update();
}

// Modern Navigation
document.addEventListener('DOMContentLoaded', () => {
  // Navigation variables
  const header = document.querySelector('header');
  const nav = document.querySelector('nav');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('nav a');
  
  // Smooth scroll for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const headerOffset = header.offsetHeight;
          const elementPosition = target.offsetTop;
          const offsetPosition = elementPosition - headerOffset;
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
          
          // Close mobile menu if open
          if (nav.classList.contains('active')) {
            nav.classList.remove('active');
            menuToggle.classList.remove('active');
          }
        }
      }
    });
  });
  
  // Mobile menu toggle with animation
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      menuToggle.classList.toggle('active');
      
      // Animate menu items
      const menuItems = nav.querySelectorAll('li');
      menuItems.forEach((item, index) => {
        if (nav.classList.contains('active')) {
          item.style.animation = `slideIn 0.3s ease forwards ${index * 0.1}s`;
        } else {
          item.style.animation = '';
        }
      });
    });
  }
  
  // Header scroll effect
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class
    if (currentScroll > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScroll > lastScroll && currentScroll > 100) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
});

// Intersection Observer for animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe elements with animation classes
document.addEventListener('DOMContentLoaded', () => {
  const animatedElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right');
  animatedElements.forEach(el => observer.observe(el));
});

// Form validation and submission
const forms = document.querySelectorAll('form');
forms.forEach(form => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Remove any existing error messages
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    
    // Validate required fields
    let isValid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'This field is required';
        field.parentNode.appendChild(errorMessage);
      }
    });
    
    if (isValid) {
      const submitButton = form.querySelector('[type="submit"]');
      submitButton.classList.add('loading');
      
      try {
        // Simulate form submission (replace with actual API call)
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Form submitted successfully!';
        form.appendChild(successMessage);
        
        // Reset form
        form.reset();
      } catch (error) {
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'An error occurred. Please try again.';
        form.appendChild(errorMessage);
      } finally {
        submitButton.classList.remove('loading');
      }
    }
  });
});

// Lazy loading images
document.addEventListener('DOMContentLoaded', () => {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  if ('loading' in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
  }
});

// Add this new function
function initImageHandling() {
    // Handle all images
    document.querySelectorAll('img').forEach(img => {
        // Add loading attribute if not present
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }

        // Handle image loading errors
        img.addEventListener('error', function() {
            this.classList.add('error');
            // Try to load a fallback image if available
            if (this.src.endsWith('.jpg')) {
                const newSrc = this.src.replace('.jpg', '.jpeg');
                this.src = newSrc;
            } else if (this.src.endsWith('.jpeg')) {
                const newSrc = this.src.replace('.jpeg', '.jpg');
                this.src = newSrc;
            }
        });

        // Remove error class if image loads successfully
        img.addEventListener('load', function() {
            this.classList.remove('error');
        });
    });

    // Handle background images
    const elementsWithBgImage = document.querySelectorAll('[style*="background-image"]');
    elementsWithBgImage.forEach(el => {
        const url = el.style.backgroundImage.slice(4, -1).replace(/"/g, "");
        const img = new Image();
        img.onerror = () => {
            // Try alternate extension if image fails to load
            if (url.endsWith('.jpg')) {
                el.style.backgroundImage = `url(${url.replace('.jpg', '.jpeg')})`;
            } else if (url.endsWith('.jpeg')) {
                el.style.backgroundImage = `url(${url.replace('.jpeg', '.jpg')})`;
            }
        };
        img.src = url;
    });
}
